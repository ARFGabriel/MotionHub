/* =========================================================
   APPLICATION — Slate
   Logique principale : navigation, inspecteur, expressions,
   nomenclature, checklist, calculatrices, génération de scripts.
   Aucun handler inline : tout est branché ici.
   ========================================================= */
(function (MH) {
  "use strict";

  var $ = MH.utils.$;
  var $$ = MH.utils.$$;

  /* ---------------------------------------------------------
     1. NAVIGATION
     --------------------------------------------------------- */
  function showTool(id) {
    $$(".tool-section").forEach(function (el) {
      el.classList.toggle("visible", el.id === id);
    });
    $$(".nav-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.tool === id);
    });
    if (id === "dashboard" && MH.dashboard && MH.dashboard.refresh) MH.dashboard.refresh();
    // Mémorise le dernier outil ouvert.
    try {
      localStorage.setItem("mh:lastTool", id);
    } catch (e) {}
  }
  MH.showTool = showTool;

  // Sous-onglets internes à une section (.subtabs > button[data-subtab]).
  function initSubtabs() {
    $$(".subtabs").forEach(function (bar) {
      var buttons = $$("button", bar);
      var section = bar.closest(".tool-section");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          $$(".subpanel", section).forEach(function (p) {
            p.classList.toggle("active", p.id === btn.dataset.subtab);
          });
          buttons.forEach(function (b) {
            b.classList.toggle("active", b === btn);
          });
        });
      });
    });
  }

  function initNavigation() {
    $$(".nav-btn").forEach(function (btn) {
      if (!btn.dataset.tool) return; // ex : bouton « Commandes »
      btn.addEventListener("click", function () {
        showTool(btn.dataset.tool);
      });
    });
    // Restaure le dernier outil, sinon le dashboard.
    var last = null;
    try {
      last = localStorage.getItem("mh:lastTool");
    } catch (e) {}
    showTool(last && $("#" + last) ? last : "dashboard");
  }

  /* ---------------------------------------------------------
     2. INSPECTEUR (arbre de fichiers par glisser-déposer)
     --------------------------------------------------------- */
  var inspector = {
    dropZone: null,
    treeRoot: null,
    statsDiv: null,
    stats: null,
  };

  function resetStats() {
    inspector.stats = { ae: 0, pr: 0, ps: 0, ai: 0, c4d: 0, aud: 0, vid: 0, img: 0, total: 0, size: 0 };
  }

  function matchFileType(ext) {
    for (var i = 0; i < MH.fileTypes.length; i++) {
      if (MH.fileTypes[i].exts.indexOf(ext) !== -1) return MH.fileTypes[i];
    }
    return { icon: "fa-file", cls: "", stat: null, label: "Fichier" };
  }

  function updateStatsUI() {
    var s = inspector.stats;
    inspector.statsDiv.innerHTML =
      '<span class="stat-badge ae-file">AE ' + s.ae + "</span>" +
      '<span class="stat-badge pr-file">PR ' + s.pr + "</span>" +
      '<span class="stat-badge ai-file">AI ' + s.ai + "</span>" +
      '<span class="stat-badge c4d-file">3D ' + s.c4d + "</span>" +
      '<span class="stat-badge">Fichiers ' + s.total + "</span>" +
      '<span class="stat-badge stat-badge--size">' + MH.utils.formatSize(s.size) + "</span>";
  }

  function addFileNode(entry, container) {
    // Récupère le File pour connaître la taille réelle (asynchrone).
    entry.file(function (file) {
      var ext = (file.name.split(".").pop() || "").toLowerCase();
      var type = matchFileType(ext);

      inspector.stats.total++;
      inspector.stats.size += file.size;
      if (type.stat) inspector.stats[type.stat]++;

      var node = document.createElement("div");
      node.className = "file-item " + type.cls;
      node.innerHTML =
        '<i class="fas ' + type.icon + '"></i>' +
        '<span class="file-name">' + MH.utils.escapeHtml(file.name) + "</span>" +
        '<span class="file-size">' + MH.utils.formatSize(file.size) + "</span>";
      container.appendChild(node);
      updateStatsUI();
    });
  }

  function traverseTree(entry, container) {
    if (entry.isFile) {
      addFileNode(entry, container);
    } else if (entry.isDirectory) {
      var details = document.createElement("details");
      details.open = true;
      var summary = document.createElement("summary");
      summary.innerHTML = '<i class="fas fa-folder"></i> ' + MH.utils.escapeHtml(entry.name);
      details.appendChild(summary);
      container.appendChild(details);

      var reader = entry.createReader();
      var readBatch = function () {
        reader.readEntries(
          function (entries) {
            if (entries.length > 0) {
              entries.sort(function (a, b) {
                if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
                return a.isDirectory ? -1 : 1;
              });
              entries.forEach(function (child) {
                traverseTree(child, details);
              });
              readBatch(); // Le reader ne renvoie pas tout d'un coup.
            }
          },
          function (err) {
            console.error("Lecture du dossier impossible :", err);
          }
        );
      };
      readBatch();
    }
  }

  function initInspector() {
    inspector.dropZone = $("#drop-zone");
    inspector.treeRoot = $("#tree-root");
    inspector.statsDiv = $("#inspector-stats");
    if (!inspector.dropZone) return;
    resetStats();

    inspector.dropZone.addEventListener("dragover", function (e) {
      e.preventDefault();
      inspector.dropZone.classList.add("hover");
    });
    inspector.dropZone.addEventListener("dragleave", function () {
      inspector.dropZone.classList.remove("hover");
    });
    inspector.dropZone.addEventListener("drop", function (e) {
      e.preventDefault();
      inspector.dropZone.classList.remove("hover");
      inspector.treeRoot.innerHTML = "";
      resetStats();
      updateStatsUI();

      var items = e.dataTransfer.items;
      var found = false;
      for (var i = 0; i < items.length; i++) {
        var entry = items[i].webkitGetAsEntry && items[i].webkitGetAsEntry();
        if (entry) {
          found = true;
          traverseTree(entry, inspector.treeRoot);
        }
      }
      if (!found) {
        MH.utils.toast("Glisse un dossier (pas seulement des fichiers).", "warn");
      }
    });
  }

  /* ---------------------------------------------------------
     3. BIBLIOTHÈQUE D'EXPRESSIONS + MODAL
     --------------------------------------------------------- */
  var modal = {};
  var expFilter = { category: "Toutes", query: "" };

  function openExpression(id) {
    var exp = MH.expressions.find(function (e) {
      return e.id === id;
    });
    if (exp) showDetail(exp);
  }

  // Ouvre le modal détaillé pour n'importe quel objet { title, category,
  // desc, where, how, params[], code } — partagé par expressions et snippets.
  function showDetail(exp) {
    if (!exp || !modal.overlay) return;
    modal.title.textContent = exp.title;
    modal.context.textContent = exp.category || "Extrait";
    modal.desc.textContent = exp.desc;

    setField(modal.whereWrap, modal.where, exp.where);
    setField(modal.howWrap, modal.how, exp.how);

    // Paramètres modifiables
    modal.params.innerHTML = "";
    var hasParams = exp.params && exp.params.length;
    modal.paramsWrap.hidden = !hasParams;
    if (hasParams) {
      exp.params.forEach(function (p) {
        var li = document.createElement("li");
        li.innerHTML =
          '<code class="param-name">' + MH.utils.escapeHtml(p.name) + "</code>" +
          '<span class="param-desc">' + MH.utils.escapeHtml(p.desc) + "</span>";
        modal.params.appendChild(li);
      });
    }

    modal.code.textContent = exp.code;
    modal.overlay.classList.add("active");
  }

  MH.showDetail = showDetail;

  function setField(wrap, valueEl, text) {
    if (!wrap) return;
    if (text) {
      valueEl.textContent = text;
      wrap.hidden = false;
    } else {
      wrap.hidden = true;
    }
  }

  function closeExpression() {
    modal.overlay.classList.remove("active");
  }

  function matchesFilter(exp) {
    if (expFilter.category !== "Toutes" && exp.category !== expFilter.category) return false;
    if (expFilter.query) {
      var hay = (exp.title + " " + exp.desc + " " + (exp.where || "") + " " + (exp.category || "")).toLowerCase();
      if (hay.indexOf(expFilter.query) === -1) return false;
    }
    return true;
  }

  function renderExpressions() {
    var grid = $("#expression-grid");
    if (!grid) return;
    grid.innerHTML = "";
    var count = 0;

    MH.expressions.forEach(function (exp) {
      if (!matchesFilter(exp)) return;
      count++;
      var card = document.createElement("button");
      card.type = "button";
      card.className = "card exp-card";
      card.innerHTML =
        "<div>" +
        '<span class="exp-cat">' + MH.utils.escapeHtml(exp.category || "") + "</span>" +
        '<div class="exp-title">' + MH.utils.escapeHtml(exp.title) + "</div>" +
        '<div class="exp-desc-short">' + MH.utils.escapeHtml(exp.desc) + "</div>" +
        "</div>" +
        '<i class="fas fa-bolt exp-icon"></i>';
      card.addEventListener("click", function () {
        openExpression(exp.id);
      });
      grid.appendChild(card);
    });

    var empty = $("#exp-empty");
    if (empty) empty.hidden = count > 0;
  }

  function buildFilters() {
    var bar = $("#exp-filters");
    if (!bar) return;
    var cats = ["Toutes"].concat(MH.expressionCategories || []);
    bar.innerHTML = "";
    cats.forEach(function (cat) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "exp-filter-btn" + (cat === expFilter.category ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", function () {
        expFilter.category = cat;
        MH.utils.$$(".exp-filter-btn", bar).forEach(function (b) {
          b.classList.toggle("active", b === btn);
        });
        renderExpressions();
      });
      bar.appendChild(btn);
    });
  }

  function initExpressions() {
    buildFilters();
    renderExpressions();

    var search = $("#exp-search");
    if (search) {
      search.addEventListener("input", function () {
        expFilter.query = search.value.trim().toLowerCase();
        renderExpressions();
      });
    }

    modal.overlay = $("#modal-overlay");
    if (!modal.overlay) return;
    modal.title = $("#modal-title");
    modal.context = $("#modal-context");
    modal.desc = $("#modal-desc");
    modal.where = $("#modal-where");
    modal.whereWrap = $("#modal-where-wrap");
    modal.how = $("#modal-how");
    modal.howWrap = $("#modal-how-wrap");
    modal.params = $("#modal-params");
    modal.paramsWrap = $("#modal-params-wrap");
    modal.code = $("#modal-code");

    modal.overlay.addEventListener("click", function (e) {
      if (e.target === modal.overlay) closeExpression();
    });
    $(".close-modal").addEventListener("click", closeExpression);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeExpression();
    });
    $(".copy-modal-btn").addEventListener("click", function () {
      MH.utils.copy(modal.code.textContent).then(function () {
        MH.utils.toast("Expression copiée !", "success");
      });
    });
  }

  /* ---------------------------------------------------------
     4. NOMENCLATURE
     --------------------------------------------------------- */
  var NAMING_KEY = "mh:naming";
  var defaultTemplate = "{date}_{client}_{projet}_{version}.{ext}";

  function updateName() {
    var date = ($("#name-date").value || "DATE").trim();
    var client = ($("#name-client").value || "CLI").toUpperCase().trim();
    var project = ($("#name-project").value || "Projet").trim().replace(/\s+/g, "");
    var version = $("#name-version").value;
    var tpl = $("#name-template").value || defaultTemplate;
    var out = tpl
      .replace(/{date}/g, date)
      .replace(/{client}/g, client)
      .replace(/{projet}/g, project)
      .replace(/{version}/g, version)
      .replace(/{ext}/g, "mp4");
    $("#final-name").textContent = out;
  }

  function initNaming() {
    if (!$("#name-date")) return;
    // Date du jour au format AAMMJJ.
    var d = new Date();
    var iso = d.toISOString().slice(2, 10).replace(/-/g, "");
    $("#name-date").value = iso;

    // Modèle personnalisable (persisté).
    var saved = defaultTemplate;
    try { saved = localStorage.getItem(NAMING_KEY) || defaultTemplate; } catch (e) {}
    $("#name-template").value = saved;
    $("#name-template").addEventListener("input", function () {
      try { localStorage.setItem(NAMING_KEY, $("#name-template").value); } catch (e) {}
      updateName();
    });

    ["#name-date", "#name-client", "#name-project"].forEach(function (sel) {
      $(sel).addEventListener("input", updateName);
    });
    $("#name-version").addEventListener("change", updateName);
    $("#copy-name-btn").addEventListener("click", function () {
      MH.utils.copy($("#final-name").textContent).then(function () {
        MH.utils.toast("Nom copié !", "success");
      });
    });
    updateName();
  }

  /* ---------------------------------------------------------
     5. CHECKLIST (avec persistance)
     --------------------------------------------------------- */
  function saveChecklist() {
    var state = $$(".checklist-item").map(function (item) {
      return item.classList.contains("checked");
    });
    try {
      localStorage.setItem("mh:checklist", JSON.stringify(state));
    } catch (e) {}
  }

  function setChecked(item, checked) {
    item.classList.toggle("checked", checked);
    var box = item.querySelector('input[type="checkbox"]');
    if (box) box.checked = checked;
  }

  function initChecklist() {
    var items = $$(".checklist-item");
    if (!items.length) return;

    var saved = null;
    try {
      saved = JSON.parse(localStorage.getItem("mh:checklist") || "null");
    } catch (e) {}

    items.forEach(function (item, i) {
      if (saved && typeof saved[i] === "boolean") setChecked(item, saved[i]);
      item.addEventListener("click", function () {
        setChecked(item, !item.classList.contains("checked"));
        saveChecklist();
      });
    });

    var resetBtn = $("#checklist-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        items.forEach(function (item) {
          setChecked(item, false);
        });
        saveChecklist();
      });
    }
  }

  /* ---------------------------------------------------------
     6. CALCULATRICES (frames/temps + poids)
     --------------------------------------------------------- */
  function initCalculators() {
    var fpsEl = $("#calc-fps");
    if (fpsEl) {
      var framesEl = $("#calc-frames");
      var secEl = $("#calc-seconds");
      var recompute = function (source) {
        var fps = parseFloat(fpsEl.value) || 25;
        if (source === "frames") {
          secEl.value = framesEl.value === "" ? "" : (parseFloat(framesEl.value) / fps).toFixed(2);
        } else {
          framesEl.value = secEl.value === "" ? "" : Math.round(parseFloat(secEl.value) * fps);
        }
      };
      framesEl.addEventListener("input", function () {
        recompute("frames");
      });
      secEl.addEventListener("input", function () {
        recompute("seconds");
      });
      fpsEl.addEventListener("change", function () {
        recompute("frames");
      });
    }

    var sizeBtn = $("#fs-calc-btn");
    if (sizeBtn) {
      sizeBtn.addEventListener("click", function () {
        var minutes = parseFloat($("#fs-min").value) || 0;
        var bitrate = parseFloat($("#fs-bitrate").value); // Mb/s
        // Go = (Mb/s * secondes / 8 bits) / 1000
        var go = (bitrate * (minutes * 60)) / 8 / 1000;
        $("#fs-result").textContent = "Estimation : " + go.toFixed(2) + " Go";
      });
    }
  }

  /* ---------------------------------------------------------
     7. GÉNÉRATION DE SCRIPTS AE (.jsx)
     --------------------------------------------------------- */
  function generateScript(name) {
    var factory = MH.scripts[name];
    if (!factory) return;

    var opts = {};
    if (name === "proxy") {
      opts.format = $("#proxy-format").value;
      opts.res = $("#proxy-res").value;
    } else if (name === "sequencer") {
      var frames = prompt("Décalage en frames entre chaque calque ?", "5");
      if (frames === null) return; // Annulé
      opts.frames = parseInt(frames, 10) || 5;
    }

    var out = factory(opts);
    MH.utils.download(out.filename, out.content);
    MH.utils.toast("Script « " + out.filename + " » téléchargé.", "success");
  }

  function initAutomation() {
    $$("[data-script]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        generateScript(btn.dataset.script);
      });
    });
  }

  /* ---------------------------------------------------------
     INITIALISATION
     --------------------------------------------------------- */
  function init() {
    initNavigation();
    initSubtabs();
    initInspector();
    initExpressions();
    initNaming();
    initChecklist();
    initCalculators();
    initAutomation();
    if (MH.projects && MH.projects.init) MH.projects.init();
    if (MH.proxy && MH.proxy.init) MH.proxy.init();
    if (MH.mediatools && MH.mediatools.init) MH.mediatools.init();
    if (MH.references && MH.references.init) MH.references.init();
    if (MH.learn && MH.learn.init) MH.learn.init();
    if (MH.automation && MH.automation.init) MH.automation.init();
    if (MH.luts && MH.luts.init) MH.luts.init();
    if (MH.palette && MH.palette.init) MH.palette.init();
    if (MH.easing && MH.easing.init) MH.easing.init();
    if (MH.settings && MH.settings.init) MH.settings.init();
    if (MH.presets && MH.presets.init) MH.presets.init();
    if (MH.updater && MH.updater.init) MH.updater.init();
    if (MH.commandPalette && MH.commandPalette.init) MH.commandPalette.init();
    if (MH.dashboard && MH.dashboard.init) MH.dashboard.init();

    var cmdkBtn = $("#open-cmdk");
    if (cmdkBtn && MH.commandPalette) cmdkBtn.addEventListener("click", MH.commandPalette.open);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window.MH = window.MH || {});
