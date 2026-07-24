/* =========================================================
   PALETTE DE COMMANDES (Ctrl/Cmd + K)
   Recherche globale : onglets, sous-onglets, actions,
   expressions et snippets — navigation instantanée.
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var overlay, input, results;
  var filtered = [];
  var selected = 0;

  function init() {
    build();
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape" && overlay.classList.contains("open")) {
        close();
      }
    });
  }

  function build() {
    overlay = document.createElement("div");
    overlay.id = "cmdk";
    overlay.className = "cmdk-overlay";
    overlay.innerHTML =
      '<div class="cmdk-box">' +
      '<div class="cmdk-search"><i class="fas fa-magnifying-glass"></i>' +
      '<input class="cmdk-input" type="text" placeholder="Rechercher un outil, une action, une expression…"></div>' +
      '<div class="cmdk-results"></div>' +
      '<div class="cmdk-hint"><kbd>↑</kbd><kbd>↓</kbd> naviguer · <kbd>↵</kbd> ouvrir · <kbd>Échap</kbd> fermer</div>' +
      "</div>";
    document.body.appendChild(overlay);
    input = overlay.querySelector(".cmdk-input");
    results = overlay.querySelector(".cmdk-results");

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    input.addEventListener("input", function () {
      render(input.value);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") { e.preventDefault(); run(filtered[selected]); }
    });
  }

  function toggle() {
    overlay.classList.contains("open") ? close() : open();
  }

  function open() {
    overlay.classList.add("open");
    input.value = "";
    render("");
    setTimeout(function () { input.focus(); }, 30);
  }

  function close() {
    overlay.classList.remove("open");
  }

  /* ---- Construction de la liste de commandes ---- */
  function commands() {
    var cmds = [];
    var tools = [
      ["dashboard", "Accueil", "fa-gauge-high"],
      ["projects", "Projets", "fa-clapperboard"],
      ["media", "Média", "fa-wand-magic-sparkles"],
      ["code", "Expressions & Scripts", "fa-code"],
      ["utils", "Utilitaires", "fa-toolbox"],
      ["references", "Références", "fa-book"],
      ["automation-watch", "Automatisation", "fa-eye"],
      ["settings", "Réglages", "fa-gear"],
    ];
    tools.forEach(function (t) {
      cmds.push({ label: t[1], hint: "Onglet", icon: t[2], run: function () { MH.showTool(t[0]); } });
    });

    // Sous-onglets
    [
      ["code", "code-snippets", "Snippets"],
      ["code", "code-scripts", "Scripts AE"],
      ["utils", "utils-checklist", "Checklist"],
      ["utils", "utils-calc", "Calculatrice frames / temps"],
      ["references", "ref-specs", "Specs & Codecs"],
    ].forEach(function (s) {
      cmds.push({ label: s[2], hint: "Section", icon: "fa-diagram-project", run: function () { MH.showTool(s[0]); clickSub(s[1]); } });
    });

    // Actions
    cmds.push({ label: "Ajouter un projet", hint: "Action", icon: "fa-folder-plus", run: function () { MH.showTool("projects"); clickIf("#add-project-btn"); } });
    cmds.push({ label: "Générer un proxy", hint: "Action", icon: "fa-compress", run: function () { MH.showTool("media"); } });
    cmds.push({ label: "Transcoder une vidéo", hint: "Action", icon: "fa-right-left", run: function () { MH.showTool("media"); } });
    cmds.push({ label: "Surveiller un dossier", hint: "Action", icon: "fa-eye", run: function () { MH.showTool("automation-watch"); clickIf("#watch-add-btn"); } });

    // Expressions & snippets
    (MH.expressions || []).forEach(function (e) {
      cmds.push({ label: e.title, hint: "Expression · " + e.category, icon: "fa-bolt", run: function () { if (MH.showDetail) MH.showDetail(e); } });
    });
    (MH.snippets || []).forEach(function (s) {
      cmds.push({ label: s.title, hint: "Snippet · " + s.category, icon: "fa-terminal", run: function () { if (MH.showDetail) MH.showDetail(s); } });
    });

    return cmds;
  }

  function clickSub(panelId) {
    var btn = utils.$('[data-subtab="' + panelId + '"]');
    if (btn) btn.click();
  }
  function clickIf(sel) {
    var b = utils.$(sel);
    if (b && !b.disabled) b.click();
  }

  /* ---- Rendu / filtrage ---- */
  function render(query) {
    query = (query || "").trim().toLowerCase();
    var all = commands();
    filtered = query
      ? all.filter(function (c) { return (c.label + " " + c.hint).toLowerCase().indexOf(query) !== -1; })
      : all;
    filtered = filtered.slice(0, 40);
    selected = 0;
    draw();
  }

  function draw() {
    if (!filtered.length) {
      results.innerHTML = '<div class="cmdk-empty">Aucun résultat</div>';
      return;
    }
    results.innerHTML = filtered
      .map(function (c, i) {
        return (
          '<button class="cmdk-item' + (i === selected ? " selected" : "") + '" data-i="' + i + '">' +
          '<i class="fas ' + c.icon + '"></i>' +
          '<span class="cmdk-label">' + utils.escapeHtml(c.label) + "</span>" +
          '<span class="cmdk-tag">' + utils.escapeHtml(c.hint) + "</span>" +
          "</button>"
        );
      })
      .join("");
    utils.$$(".cmdk-item", results).forEach(function (el) {
      el.addEventListener("click", function () { run(filtered[parseInt(el.dataset.i, 10)]); });
      el.addEventListener("mousemove", function () {
        selected = parseInt(el.dataset.i, 10);
        highlight();
      });
    });
  }

  function move(delta) {
    if (!filtered.length) return;
    selected = (selected + delta + filtered.length) % filtered.length;
    highlight();
  }

  function highlight() {
    utils.$$(".cmdk-item", results).forEach(function (el, i) {
      el.classList.toggle("selected", i === selected);
      if (i === selected) el.scrollIntoView({ block: "nearest" });
    });
  }

  function run(cmd) {
    if (!cmd) return;
    close();
    cmd.run();
  }

  MH.commandPalette = { init: init, open: open };
})(window.MH = window.MH || {});
