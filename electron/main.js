"use strict";

const { app, BrowserWindow, ipcMain, dialog, shell, Notification } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const https = require("https");
const { spawn } = require("child_process");
const Store = require("./store");
const media = require("./media");
const { createWatcher } = require("./watcher");
const { autoUpdater } = require("electron-updater");

const WATCH_EXTS = ["mp4", "mov", "mkv", "avi", "mxf", "m4v", "webm", "png", "exr", "jpg", "jpeg", "tif"];
const PROJECT_EXTS = ["aep", "aet", "prproj", "drp", "blend", "c4d", "sesx", "ppj", "fcpxml", "veg"];
const activeWatchers = new Map(); // id -> { watcher, folder, mode, options }

const isDev = process.argv.includes("--dev");
let store;
let mainWindow = null;

/* ---------------------------------------------------------
   Fenêtre principale
   --------------------------------------------------------- */
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#0a0a0a",
    title: "Slate",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // Sécurité : le renderer n'a pas accès direct à Node.
      nodeIntegration: false,
      sandbox: false, // preload a besoin de require() pour le bridge.
    },
  });

  win.loadFile(path.join(__dirname, "..", "index.html"));
  if (isDev) win.webContents.openDevTools({ mode: "detach" });
  mainWindow = win;
}

/* ---------------------------------------------------------
   Cycle de vie
   --------------------------------------------------------- */
app.whenReady().then(() => {
  store = new Store(path.join(app.getPath("userData"), "motionhub.json"), {
    projects: [],
    watches: [],
  });

  registerIpc();
  createWindow();
  restoreWatchers();
  setupAutoUpdate();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/* ---------------------------------------------------------
   Handlers IPC (le pont entre l'UI et le système de fichiers)
   --------------------------------------------------------- */
function registerIpc() {
  // Sélecteur de dossier natif.
  ipcMain.handle("dialog:pickFolder", async () => {
    const res = await dialog.showOpenDialog({
      title: "Choisir le dossier du projet",
      properties: ["openDirectory"],
    });
    return res.canceled ? null : res.filePaths[0];
  });

  // Liste des projets enregistrés. On complète au passage les métadonnées
  // de date (création/modification du dossier) pour les anciens projets.
  ipcMain.handle("projects:list", () => {
    const projects = store.get("projects") || [];
    let changed = false;
    projects.forEach((p) => {
      if (p.birthtime != null && p.mtime != null) return;
      try {
        const st = fs.statSync(p.path);
        if (p.birthtime == null) { p.birthtime = st.birthtimeMs; changed = true; }
        if (p.mtime == null) { p.mtime = st.mtimeMs; changed = true; }
      } catch (e) { /* dossier déplacé/supprimé : on laisse tel quel */ }
    });
    if (changed) store.set("projects", projects);
    return projects;
  });

  // Ajoute un projet à partir d'un chemin de dossier.
  ipcMain.handle("projects:add", (_evt, folderPath) => {
    if (!folderPath || !fs.existsSync(folderPath)) {
      throw new Error("Dossier introuvable.");
    }
    const projects = store.get("projects") || [];
    if (projects.some((p) => p.path === folderPath)) {
      return { projects, added: false, reason: "exists" };
    }
    const stat = fs.statSync(folderPath);
    const project = {
      id: crypto.randomUUID(),
      name: path.basename(folderPath),
      path: folderPath,
      drive: path.parse(folderPath).root,
      addedAt: Date.now(),
      mtime: stat.mtimeMs,
      birthtime: stat.birthtimeMs,
    };
    projects.unshift(project);
    store.set("projects", projects);
    return { projects, added: true, project };
  });

  // Retire un projet (n'efface aucun fichier réel).
  ipcMain.handle("projects:remove", (_evt, id) => {
    const projects = (store.get("projects") || []).filter((p) => p.id !== id);
    store.set("projects", projects);
    return projects;
  });

  // Met à jour les métadonnées d'un projet (statut, client, deadline, tags, notes…).
  ipcMain.handle("projects:update", (_evt, { id, patch }) => {
    const projects = store.get("projects") || [];
    const p = projects.find((x) => x.id === id);
    if (!p) throw new Error("Projet introuvable.");
    Object.assign(p, patch);
    store.set("projects", projects);
    return p;
  });

  // Crée l'arborescence d'un projet : un dossier racine + les sous-dossiers.
  ipcMain.handle("projects:scaffold", (_evt, { parent, name, folders }) => {
    if (!parent || !fs.existsSync(parent)) throw new Error("Dossier parent introuvable.");
    const safeName = String(name || "").trim().replace(/[<>:"/\\|?*]+/g, "_");
    if (!safeName) throw new Error("Nom de projet invalide.");
    const root = path.join(parent, safeName);
    if (fs.existsSync(root)) throw new Error("Un dossier « " + safeName + " » existe déjà ici.");
    fs.mkdirSync(root, { recursive: true });
    let created = 1;
    (folders || []).forEach((rel) => {
      // on neutralise tout remontée de chemin (..) et les séparateurs Windows
      const clean = String(rel).replace(/\\/g, "/").split("/")
        .map((s) => s.trim().replace(/[<>:"|?*]+/g, "_"))
        .filter((s) => s && s !== "." && s !== "..")
        .join(path.sep);
      if (!clean) return;
      const full = path.join(root, clean);
      if (!full.startsWith(root)) return;
      try { fs.mkdirSync(full, { recursive: true }); created++; } catch (e) {}
    });
    return { root, created };
  });

  // Trouve le fichier-projet principal (le plus récent) d'un dossier.
  ipcMain.handle("projects:mainFile", (_evt, dirPath) => {
    let best = null;
    const walk = (d, depth) => {
      if (depth > 2) return;
      let entries;
      try {
        entries = fs.readdirSync(d, { withFileTypes: true });
      } catch (e) {
        return;
      }
      for (const e of entries) {
        const full = path.join(d, e.name);
        if (e.isDirectory()) walk(full, depth + 1);
        else {
          const ext = (e.name.split(".").pop() || "").toLowerCase();
          if (PROJECT_EXTS.indexOf(ext) !== -1) {
            try {
              const st = fs.statSync(full);
              if (!best || st.mtimeMs > best.mtime) best = { path: full, name: e.name, mtime: st.mtimeMs };
            } catch (err) {}
          }
        }
      }
    };
    walk(dirPath, 0);
    return best;
  });

  // Sauvegarde (copie) un dossier projet vers une destination choisie (robocopy).
  ipcMain.handle("projects:backup", async (_evt, srcPath) => {
    if (!srcPath || !fs.existsSync(srcPath)) throw new Error("Projet introuvable.");
    const res = await dialog.showOpenDialog({
      title: "Choisir le dossier de destination de la sauvegarde",
      properties: ["openDirectory"],
    });
    if (res.canceled) return { canceled: true };
    const dest = path.join(res.filePaths[0], path.basename(srcPath));
    return new Promise((resolve, reject) => {
      const p = spawn("robocopy", [srcPath, dest, "/E", "/NFL", "/NDL", "/NJH", "/NJS", "/NP", "/R:1", "/W:1"]);
      p.on("error", reject);
      p.on("close", (code) => {
        // robocopy : codes 0–7 = succès (8+ = erreur)
        if (code < 8) resolve({ canceled: false, dest });
        else reject(new Error("Échec de la copie (robocopy code " + code + ")"));
      });
    });
  });

  // Calcule la taille totale (récursive) d'un dossier.
  ipcMain.handle("fs:folderSize", (_evt, dirPath) => {
    let total = 0;
    let files = 0;
    const walk = (d) => {
      let entries;
      try {
        entries = fs.readdirSync(d, { withFileTypes: true });
      } catch (e) {
        return;
      }
      for (const e of entries) {
        const full = path.join(d, e.name);
        if (e.isDirectory()) walk(full);
        else {
          try {
            total += fs.statSync(full).size;
            files++;
          } catch (err) {
            /* fichier inaccessible : ignoré */
          }
        }
      }
    };
    walk(dirPath);
    return { size: total, files };
  });

  // Lit le contenu d'un dossier (un niveau) avec métadonnées.
  ipcMain.handle("fs:readDir", (_evt, dirPath) => {
    if (!dirPath || !fs.existsSync(dirPath)) {
      throw new Error("Chemin introuvable : " + dirPath);
    }
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    return entries.map((entry) => {
      const full = path.join(dirPath, entry.name);
      let size = 0;
      let mtime = 0;
      try {
        const st = fs.statSync(full);
        size = st.size;
        mtime = st.mtimeMs;
      } catch (e) {
        /* fichier verrouillé / permission : ignoré */
      }
      return {
        name: entry.name,
        path: full,
        isDir: entry.isDirectory(),
        ext: entry.isDirectory() ? "" : (entry.name.split(".").pop() || "").toLowerCase(),
        size,
        mtime,
      };
    });
  });

  // Espace disque libre/total pour les disques des chemins fournis (dédupliqués).
  ipcMain.handle("system:diskSpace", (_evt, paths) => {
    const seen = {};
    const out = [];
    (paths || []).forEach((p) => {
      const root = path.parse(p).root;
      if (!root || seen[root]) return;
      seen[root] = true;
      try {
        const s = fs.statfsSync(root);
        out.push({ drive: root, free: s.bavail * s.bsize, total: s.blocks * s.bsize });
      } catch (e) {
        /* disque inaccessible : ignoré */
      }
    });
    return out;
  });

  // Ouvre un fichier ou dossier dans l'explorateur / l'app par défaut.
  ipcMain.handle("shell:open", (_evt, targetPath) => {
    return shell.openPath(targetPath);
  });

  // Révèle un élément dans l'explorateur Windows.
  ipcMain.handle("shell:reveal", (_evt, targetPath) => {
    shell.showItemInFolder(targetPath);
  });

  // Sélecteur de fichiers vidéo (pour les proxys).
  ipcMain.handle("dialog:pickVideos", async () => {
    const res = await dialog.showOpenDialog({
      title: "Choisir des vidéos",
      properties: ["openFile", "multiSelections"],
      filters: [
        { name: "Vidéos", extensions: ["mp4", "mov", "mkv", "avi", "mxf", "m4v", "webm"] },
        { name: "Tous les fichiers", extensions: ["*"] },
      ],
    });
    return res.canceled ? [] : res.filePaths;
  });

  // Métadonnées d'un média.
  ipcMain.handle("media:probe", (_evt, filePath) => media.probe(filePath));

  // Miniature d'une vidéo (renvoie une data URL affichable directement).
  ipcMain.handle("media:thumbnail", async (_evt, filePath) => {
    const thumbPath = await media.extractThumbnail(filePath, path.join(app.getPath("userData"), "thumbs"));
    const b64 = fs.readFileSync(thumbPath).toString("base64");
    return "data:image/jpeg;base64," + b64;
  });

  // Rendu final le plus récent d'un dossier projet.
  ipcMain.handle("media:latestRender", (_evt, dirPath) => {
    return media.findLatestRender(dirPath, 2);
  });

  // Génération de proxy avec progression envoyée au renderer.
  ipcMain.handle("proxy:generate", async (evt, payload) => {
    const { jobId, input, options } = payload;
    const result = await media.generateProxy(input, options, (pct) => {
      if (!evt.sender.isDestroyed()) {
        evt.sender.send("proxy:progress", { jobId, percent: pct });
      }
    });
    return result;
  });

  /* ---- Boîte à outils média ---- */
  const sendMediaProgress = (evt, jobId) => (pct) => {
    if (!evt.sender.isDestroyed()) evt.sender.send("media:progress", { jobId, percent: pct });
  };

  ipcMain.handle("media:presets", () => media.listPresets());

  ipcMain.handle("dialog:pickImage", async () => {
    const res = await dialog.showOpenDialog({
      title: "Choisir la 1re image de la séquence",
      properties: ["openFile"],
      filters: [
        { name: "Images", extensions: ["png", "jpg", "jpeg", "tif", "tiff", "exr", "dpx", "tga"] },
        { name: "Tous les fichiers", extensions: ["*"] },
      ],
    });
    return res.canceled ? null : res.filePaths[0];
  });

  ipcMain.handle("media:transcode", (evt, { jobId, input, presetId }) => {
    return media.transcode(input, presetId, sendMediaProgress(evt, jobId));
  });

  ipcMain.handle("media:detectSequence", (_evt, firstFile) => media.detectSequence(firstFile));

  ipcMain.handle("media:renderSequence", (evt, { jobId, firstFile, options }) => {
    return media.renderSequence(firstFile, options, sendMediaProgress(evt, jobId));
  });

  ipcMain.handle("media:extractFrames", (_evt, { input, options }) => {
    return media.extractFrames(input, options);
  });

  ipcMain.handle("media:transcodeCustom", (evt, { jobId, input, spec }) => {
    return media.transcodeCustom(input, spec, sendMediaProgress(evt, jobId));
  });

  ipcMain.handle("media:makeGif", (evt, { jobId, input, options }) => {
    return media.makeGif(input, options, sendMediaProgress(evt, jobId));
  });

  ipcMain.handle("media:trim", (evt, { jobId, input, options }) => {
    return media.trimClip(input, options, sendMediaProgress(evt, jobId));
  });

  ipcMain.handle("media:compress", (evt, { jobId, input, options }) => {
    return media.compressTarget(input, options, sendMediaProgress(evt, jobId));
  });

  // Export PDF d'un scénario (rendu HTML -> PDF via Chromium).
  ipcMain.handle("screenplay:exportPdf", async (_evt, { html, name }) => {
    const res = await dialog.showSaveDialog({
      title: "Exporter le scénario en PDF",
      defaultPath: (name || "scenario") + ".pdf",
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });
    if (res.canceled) return { canceled: true };

    const tmp = path.join(app.getPath("temp"), "slate_sp_" + Date.now() + ".html");
    fs.writeFileSync(tmp, html, "utf-8");
    const win = new BrowserWindow({ show: false, webPreferences: { javascript: false } });
    try {
      await win.loadFile(tmp);
      const pdf = await win.webContents.printToPDF({
        pageSize: "Letter",
        printBackground: true,
        preferCSSPageSize: true,
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
      });
      fs.writeFileSync(res.filePath, pdf);
      return { canceled: false, path: res.filePath };
    } finally {
      win.destroy();
      try { fs.unlinkSync(tmp); } catch (e) {}
    }
  });

  /* ---- Assistant IA (API Anthropic) ---- */
  // La clé est stockée côté processus principal (userData), jamais exposée
  // au renderer : ai:getConfig ne renvoie QUE hasKey + model.
  ipcMain.handle("ai:getConfig", () => {
    const cfg = store.get("ai") || {};
    return { hasKey: !!cfg.key, model: cfg.model || "claude-sonnet-5-5" };
  });

  ipcMain.handle("ai:setConfig", (_evt, { key, model }) => {
    const cfg = store.get("ai") || {};
    if (typeof key === "string") cfg.key = key.trim(); // chaîne vide = effacer
    if (typeof model === "string" && model) cfg.model = model;
    store.set("ai", cfg);
    return { hasKey: !!cfg.key, model: cfg.model || "claude-sonnet-5-5" };
  });

  ipcMain.handle("ai:complete", (_evt, { system, prompt, maxTokens }) => {
    const cfg = store.get("ai") || {};
    if (!cfg.key) return Promise.resolve({ error: "Aucune clé API configurée. Ajoute-la dans les Réglages." });
    const model = cfg.model || "claude-sonnet-5-5";
    const payload = JSON.stringify({
      model: model,
      max_tokens: Math.min(Math.max(parseInt(maxTokens, 10) || 1024, 64), 8192),
      // Effort faible : l'écriture créative n'a pas besoin de raisonnement
      // profond → latence et coût (facturés à l'utilisateur) réduits.
      output_config: { effort: "low" },
      system: system || "",
      messages: [{ role: "user", content: String(prompt || "") }],
    });
    return new Promise((resolve) => {
      const req = https.request(
        {
          hostname: "api.anthropic.com",
          path: "/v1/messages",
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": cfg.key,
            "anthropic-version": "2023-06-01",
            "content-length": Buffer.byteLength(payload),
          },
        },
        (res) => {
          let body = "";
          res.on("data", (c) => (body += c));
          res.on("end", () => {
            try {
              const j = JSON.parse(body);
              if (res.statusCode >= 400) {
                resolve({ error: (j.error && j.error.message) || "Erreur API " + res.statusCode });
                return;
              }
              var text = (j.content || [])
                .filter(function (b) { return b.type === "text"; })
                .map(function (b) { return b.text; })
                .join("\n");
              resolve({ text: text, usage: j.usage || null });
            } catch (e) {
              resolve({ error: "Réponse illisible de l'API (" + res.statusCode + ")." });
            }
          });
        }
      );
      req.on("error", (e) => resolve({ error: e.message }));
      req.write(payload);
      req.end();
    });
  });

  ipcMain.handle("dialog:pickLut", async () => {
    const res = await dialog.showOpenDialog({
      title: "Choisir une LUT",
      properties: ["openFile"],
      filters: [{ name: "LUT", extensions: ["cube", "3dl"] }],
    });
    return res.canceled ? null : res.filePaths[0];
  });

  ipcMain.handle("media:applyLut", (evt, { jobId, input, cube }) => {
    return media.applyLut(input, cube, sendMediaProgress(evt, jobId));
  });

  /* ---- Automatisation : surveillance de dossiers (persistante) ---- */
  ipcMain.handle("watch:start", (evt, cfg) => {
    if (!cfg.folder || !fs.existsSync(cfg.folder)) throw new Error("Dossier introuvable.");
    startWatcher(evt.sender, cfg);
    const watches = store.get("watches") || [];
    if (!watches.some((w) => w.id === cfg.id)) {
      watches.push({ id: cfg.id, folder: cfg.folder, mode: cfg.mode, options: cfg.options || {} });
      store.set("watches", watches);
    }
    return { id: cfg.id, folder: cfg.folder, mode: cfg.mode };
  });

  ipcMain.handle("watch:stop", (_evt, id) => {
    const w = activeWatchers.get(id);
    if (w) {
      w.watcher.close();
      activeWatchers.delete(id);
    }
    store.set("watches", (store.get("watches") || []).filter((x) => x.id !== id));
    return true;
  });

  ipcMain.handle("watch:list", () => store.get("watches") || []);

  /* ---- Mises à jour ---- */
  ipcMain.handle("update:version", () => app.getVersion());
  ipcMain.handle("update:check", () => {
    if (!app.isPackaged) return { state: "dev" };
    return autoUpdater
      .checkForUpdates()
      .then(() => ({ state: "checking" }))
      .catch((e) => ({ state: "error", message: String((e && e.message) || e) }));
  });
  ipcMain.handle("update:install", () => {
    autoUpdater.quitAndInstall();
  });
}

// Démarre une surveillance et l'ajoute à la table active.
function startWatcher(webContents, cfg) {
  const { id, folder, mode, options } = cfg;
  if (activeWatchers.has(id)) return;

  const emit = (payload) => {
    if (webContents && !webContents.isDestroyed()) webContents.send("watch:event", Object.assign({ watchId: id }, payload));
  };

  const onNew = (file) => {
    const name = path.basename(file);
    emit({ type: "detected", file, name });

    if (mode === "proxy") {
      emit({ type: "processing", file, name });
      media
        .generateProxy(file, { format: "prores", scale: (options && options.scale) || 0.5 }, null)
        .then((res) => { notify("Slate — proxy créé", path.basename(res.output)); emit({ type: "done", file, name, message: "Proxy créé", output: res.output }); })
        .catch((err) => emit({ type: "error", file, name, message: err.message }));
    } else if (mode === "transcode") {
      emit({ type: "processing", file, name });
      media
        .transcode(file, (options && options.presetId) || "youtube", null)
        .then((res) => { notify("Slate — export créé", path.basename(res.output)); emit({ type: "done", file, name, message: "Transcodé", output: res.output }); })
        .catch((err) => emit({ type: "error", file, name, message: err.message }));
    } else {
      notify("Slate — nouveau fichier", name);
      emit({ type: "done", file, name, message: "Détecté" });
    }
  };

  const watcher = createWatcher(folder, { filter: (ext) => WATCH_EXTS.indexOf(ext) !== -1, onNew });
  activeWatchers.set(id, { watcher, folder, mode, options });
}

// Relance les surveillances persistées au démarrage.
function restoreWatchers() {
  (store.get("watches") || []).forEach((cfg) => {
    if (mainWindow) startWatcher(mainWindow.webContents, cfg);
  });
}

function notify(title, body) {
  if (Notification.isSupported()) new Notification({ title, body }).show();
}

/* ---------------------------------------------------------
   Mises à jour automatiques (electron-updater)
   --------------------------------------------------------- */
function setupAutoUpdate() {
  const send = (payload) => {
    if (mainWindow && !mainWindow.webContents.isDestroyed()) mainWindow.webContents.send("update:status", payload);
  };
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("checking-for-update", () => send({ state: "checking" }));
  autoUpdater.on("update-available", (info) => {
    send({ state: "available", version: info.version });
    notify("Slate", "Mise à jour " + info.version + " disponible — téléchargement…");
  });
  autoUpdater.on("update-not-available", () => send({ state: "none" }));
  autoUpdater.on("download-progress", (p) => send({ state: "downloading", percent: Math.round(p.percent) }));
  autoUpdater.on("update-downloaded", (info) => {
    send({ state: "downloaded", version: info.version });
    notify("Slate", "Mise à jour prête — redémarre pour l'installer.");
  });
  autoUpdater.on("error", (err) => send({ state: "error", message: String((err && err.message) || err) }));

  // Vérification silencieuse au démarrage (uniquement en version installée).
  if (app.isPackaged) {
    autoUpdater.checkForUpdates().catch(() => {});
  }
}

// Ferme proprement les surveillances à la fermeture.
app.on("before-quit", () => {
  activeWatchers.forEach((w) => w.watcher.close());
  activeWatchers.clear();
});
