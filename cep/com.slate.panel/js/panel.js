/* =========================================================
   Logique du panneau Slate (Premiere Pro & After Effects).
   Parle à l'hôte via CSInterface.evalScript -> namespaces
   SlatePr / SlateAe (voir jsx/).
   ========================================================= */
(function () {
  "use strict";

  var cs = new CSInterface();
  var appId = (cs.getApplicationID() || "").toUpperCase(); // "PPRO" ou "AEFT"
  var isAe = appId.indexOf("AEFT") === 0;
  var NS = isAe ? "SlateAe" : "SlatePr";
  var hostLabel = isAe ? "After Effects" : "Premiere Pro";

  // Modèles d'organisation (chemins ; "/" = sous-dossier/bin).
  var TEMPLATES = {
    "Montage": ["01_RUSHES", "01_RUSHES/VIDEO", "01_RUSHES/AUDIO", "02_SEQUENCES", "03_GRAPHISME", "04_MUSIQUE", "05_SOUND_FX", "06_EXPORTS"],
    "Multicam": ["01_RUSHES", "01_RUSHES/CAM_A", "01_RUSHES/CAM_B", "01_RUSHES/DRONE", "02_SON", "03_SEQUENCES", "04_GRAPHISME", "05_EXPORTS"],
    "Motion / VFX": ["01_SOURCES", "01_SOURCES/FOOTAGE", "01_SOURCES/ASSETS", "02_PRECOMPS", "03_COMPS", "04_RENDERS"],
    "Simple": ["RUSHES", "AUDIO", "SEQUENCES", "EXPORTS"]
  };

  function $(id) { return document.getElementById(id); }

  function esLit(s) {
    return '"' + String(s)
      .replace(/\\/g, "\\\\").replace(/"/g, '\\"')
      .replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"';
  }

  function callHost(method, argLits) {
    return new Promise(function (resolve) {
      var script = NS + "." + method + "(" + (argLits || []).join(",") + ")";
      cs.evalScript(script, function (res) {
        if (res === undefined || res === "" || res === "undefined" ||
            String(res).indexOf("EvalScript error") === 0) {
          resolve({ ok: false, error: "Hôte indisponible — ouvre le panneau dans Premiere/After Effects avec un projet ouvert." });
          return;
        }
        try { resolve(JSON.parse(res)); }
        catch (e) { resolve({ ok: false, error: "Réponse illisible : " + res }); }
      });
    });
  }

  function log(msg, cls) {
    var el = $("log");
    el.innerHTML = '<span class="' + (cls || "") + '">' + msg + "</span>";
  }

  function busy(btn, on, label) {
    btn.disabled = on;
    if (on) { btn.dataset._t = btn.textContent; btn.textContent = label || "…"; }
    else if (btn.dataset._t) { btn.textContent = btn.dataset._t; }
  }

  /* ---- Modèles : UI ---- */
  function renderTemplateOptions() {
    var sel = $("tpl");
    sel.innerHTML = "";
    Object.keys(TEMPLATES).forEach(function (name) {
      var o = document.createElement("option");
      o.value = name; o.textContent = name;
      sel.appendChild(o);
    });
    sel.addEventListener("change", renderPreview);
    renderPreview();
  }

  function renderPreview() {
    var paths = TEMPLATES[$("tpl").value] || [];
    $("tpl-preview").textContent = paths.map(function (p) {
      var depth = p.split("/").length - 1;
      return "  ".repeat(depth) + p.split("/").pop();
    }).join("\n");
  }

  function rushesBin() {
    var paths = TEMPLATES[$("tpl").value] || [];
    for (var i = 0; i < paths.length; i++) {
      if (paths[i].indexOf("/") === -1 && /RUSH|SOURCE/i.test(paths[i])) return paths[i];
    }
    return "RUSHES";
  }

  /* ---- Actions ---- */
  function refreshInfo() {
    callHost("info", []).then(function (r) {
      if (!r.ok) { $("proj-stats").innerHTML = '<span class="muted">' + r.error + "</span>"; return; }
      var d = r.data;
      var second = isAe
        ? '<div class="pstat"><b>' + d.comps + "</b><span>comps</span></div>"
        : '<div class="pstat"><b>' + d.sequences + "</b><span>séquences</span></div>";
      $("proj-stats").innerHTML =
        '<div class="pproj">' + (d.project || "Projet sans titre") + "</div>" +
        '<div class="pstat"><b>' + d.items + "</b><span>éléments</span></div>" +
        second;
    });
  }

  function createStructure() {
    var btn = $("btn-bins");
    var paths = (TEMPLATES[$("tpl").value] || []).join("\n");
    var method = isAe ? "createFolders" : "createBins";
    busy(btn, true, "Création…");
    callHost(method, [esLit(paths)]).then(function (r) {
      busy(btn, false);
      if (!r.ok) { log(r.error, "err"); return; }
      log("✓ " + r.data.created + (isAe ? " dossiers créés." : " bins créés."), "ok");
      refreshInfo();
    });
  }

  function importRushes() {
    var btn = $("btn-import");
    busy(btn, true, "Import…");
    callHost("importRushes", [esLit(rushesBin())]).then(function (r) {
      busy(btn, false);
      if (!r.ok) { log(r.error, r.error.indexOf("annulé") >= 0 ? "" : "err"); return; }
      log("✓ " + r.data.imported + " média(s) importé(s) dans « " + (r.data.bin || r.data.folder) + " ».", "ok");
      refreshInfo();
    });
  }

  function attachProxies() {
    var btn = $("btn-proxy");
    busy(btn, true, "Attache…");
    callHost("attachProxies", []).then(function (r) {
      busy(btn, false);
      if (!r.ok) { log(r.error, r.error.indexOf("annul") >= 0 ? "" : "err"); return; }
      log("✓ " + r.data.attached + " proxy(s) attaché(s)" + (r.data.nomatch ? " · " + r.data.nomatch + " sans correspondance." : "."), "ok");
    });
  }

  function checkMissing() {
    var btn = $("btn-missing");
    busy(btn, true, "Vérif…");
    callHost("missingMedia", []).then(function (r) {
      busy(btn, false);
      var el = $("missing-list");
      if (!r.ok) { log(r.error, "err"); return; }
      if (!r.data.missing.length) {
        el.innerHTML = '<div class="miss-ok">✓ Aucun média manquant (' + r.data.total + " vérifiés).</div>";
      } else {
        el.innerHTML = '<div class="miss-item">⚠ ' + r.data.missing.length + " média(s) hors-ligne :</div>" +
          r.data.missing.map(function (n) { return '<div class="miss-item">• ' + n + "</div>"; }).join("");
      }
      log("", "");
    });
  }

  /* ---- Init ---- */
  function init() {
    $("host-badge").textContent = hostLabel;
    renderTemplateOptions();
    $("btn-refresh").addEventListener("click", refreshInfo);
    $("btn-bins").addEventListener("click", createStructure);
    $("btn-import").addEventListener("click", importRushes);
    $("btn-proxy").addEventListener("click", attachProxies);
    $("btn-missing").addEventListener("click", checkMissing);
    refreshInfo();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
