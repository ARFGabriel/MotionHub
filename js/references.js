/* =========================================================
   HUB DE RÉFÉRENCES (multi-logiciels)
   Raccourcis clavier · Snippets · Specs & codecs
   100% web (aucune dépendance desktop).
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;

  MH.references = { init: init };

  function init() {
    initShortcuts();
    initSnippets();
    initSpecs();
  }

  /* ---- Raccourcis ---- */
  function initShortcuts() {
    var appsBar = utils.$("#sc-apps");
    var list = utils.$("#sc-list");
    var search = utils.$("#sc-search");
    if (!appsBar || !list) return;

    var noteEl = utils.$("#sc-note");
    if (noteEl && MH.shortcutsNote) {
      noteEl.innerHTML = '<i class="fas fa-keyboard"></i> ' + utils.escapeHtml(MH.shortcutsNote);
    }

    var apps = Object.keys(MH.shortcuts);
    var current = apps[0];
    var query = "";

    apps.forEach(function (app) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "exp-filter-btn" + (app === current ? " active" : "");
      btn.textContent = app;
      btn.addEventListener("click", function () {
        current = app;
        utils.$$(".exp-filter-btn", appsBar).forEach(function (b) { b.classList.toggle("active", b === btn); });
        renderList();
      });
      appsBar.appendChild(btn);
    });

    if (search) {
      search.addEventListener("input", function () {
        query = search.value.trim().toLowerCase();
        renderList();
      });
    }

    function renderList() {
      var items = (MH.shortcuts[current] || []).filter(function (s) {
        return !query || s.action.toLowerCase().indexOf(query) !== -1 || s.keys.toLowerCase().indexOf(query) !== -1;
      });
      list.innerHTML = "";
      if (!items.length) {
        list.innerHTML = '<p class="muted">Aucun raccourci ne correspond.</p>';
        return;
      }
      items.forEach(function (s) {
        var row = document.createElement("div");
        row.className = "shortcut-row";
        row.innerHTML =
          '<span class="shortcut-action">' + utils.escapeHtml(s.action) + "</span>" +
          '<span class="shortcut-keys">' + renderKeys(s.keys) + "</span>";
        list.appendChild(row);
      });
    }

    renderList();
  }

  function renderKeys(keys) {
    // Met chaque touche dans un <kbd>, en gardant les séparateurs + et /.
    return keys
      .split(/(\s\+\s|\s\/\s)/)
      .map(function (part) {
        if (part === " + " || part === " / ") return '<span class="kbd-sep">' + part.trim() + "</span>";
        return "<kbd>" + utils.escapeHtml(part) + "</kbd>";
      })
      .join(" ");
  }

  /* ---- Snippets ---- */
  function initSnippets() {
    var grid = utils.$("#snippet-grid");
    var filters = utils.$("#snip-filters");
    if (!grid) return;

    var cats = ["Tous"].concat(uniqueCategories(MH.snippets));
    var current = "Tous";

    filters.innerHTML = "";
    cats.forEach(function (cat) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "exp-filter-btn" + (cat === current ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", function () {
        current = cat;
        utils.$$(".exp-filter-btn", filters).forEach(function (b) { b.classList.toggle("active", b === btn); });
        renderGrid();
      });
      filters.appendChild(btn);
    });

    function renderGrid() {
      grid.innerHTML = "";
      MH.snippets
        .filter(function (s) { return current === "Tous" || s.category === current; })
        .forEach(function (snip) {
          var card = document.createElement("button");
          card.type = "button";
          card.className = "card exp-card";
          card.innerHTML =
            "<div>" +
            '<span class="exp-cat">' + utils.escapeHtml(snip.category) + "</span>" +
            '<div class="exp-title">' + utils.escapeHtml(snip.title) + "</div>" +
            '<div class="exp-desc-short">' + utils.escapeHtml(snip.desc) + "</div>" +
            "</div>" +
            '<i class="fas fa-terminal exp-icon"></i>';
          card.addEventListener("click", function () {
            if (MH.showDetail) MH.showDetail(snip);
          });
          grid.appendChild(card);
        });
    }

    renderGrid();
  }

  function uniqueCategories(arr) {
    var seen = {};
    var out = [];
    arr.forEach(function (x) {
      if (!seen[x.category]) { seen[x.category] = true; out.push(x.category); }
    });
    return out;
  }

  /* ---- Specs & codecs (tables) ---- */
  function initSpecs() {
    table("#spec-delivery", ["Plateforme", "Résolution", "FPS", "Codec", "Conteneur", "Bitrate"], MH.deliverySpecs,
      function (r) { return [r.platform, r.res, r.fps, r.codec, r.container, r.bitrate]; });

    table("#spec-codecs", ["Codec", "Usage", "Montage", "Poids"], MH.codecTable,
      function (r) { return [r.name, r.usage, r.editFriendly, r.weight]; });

    table("#spec-colors", ["Espace", "Usage"], MH.colorSpaces,
      function (r) { return [r.name, r.usage]; });

    table("#spec-res", ["Nom", "Dimensions"], MH.resolutions,
      function (r) { return [r.name, r.dims]; });
  }

  function table(sel, headers, rows, mapFn) {
    var el = utils.$(sel);
    if (!el || !rows) return;
    var thead = "<thead><tr>" + headers.map(function (h) { return "<th>" + utils.escapeHtml(h) + "</th>"; }).join("") + "</tr></thead>";
    var tbody = "<tbody>" + rows.map(function (r) {
      return "<tr>" + mapFn(r).map(function (c) { return "<td>" + utils.escapeHtml(String(c)) + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody>";
    el.innerHTML = thead + tbody;
  }
})(window.MH = window.MH || {});
