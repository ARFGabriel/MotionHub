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

    var realApps = Object.keys(MH.shortcuts);
    var apps = ["Tous"].concat(realApps);
    var current = "Tous";
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

    // Renvoie les lignes filtrées sous forme [{app, action, keys}].
    function currentRows() {
      var out = [];
      var appsToShow = current === "Tous" ? realApps : [current];
      appsToShow.forEach(function (app) {
        (MH.shortcuts[app] || []).forEach(function (s) {
          if (!query || s.action.toLowerCase().indexOf(query) !== -1 || s.keys.toLowerCase().indexOf(query) !== -1) {
            out.push({ app: app, action: s.action, keys: s.keys });
          }
        });
      });
      return out;
    }

    function renderList() {
      var appsToShow = current === "Tous" ? realApps : [current];
      list.innerHTML = "";
      var total = 0;
      appsToShow.forEach(function (app) {
        var items = (MH.shortcuts[app] || []).filter(function (s) {
          return !query || s.action.toLowerCase().indexOf(query) !== -1 || s.keys.toLowerCase().indexOf(query) !== -1;
        });
        if (!items.length) return;
        total += items.length;
        if (current === "Tous") {
          var h = document.createElement("div");
          h.className = "sc-group-head";
          h.textContent = app;
          list.appendChild(h);
        }
        items.forEach(function (s) {
          var row = document.createElement("div");
          row.className = "shortcut-row";
          row.innerHTML =
            '<span class="shortcut-action">' + utils.escapeHtml(s.action) + "</span>" +
            '<span class="shortcut-keys">' + renderKeys(s.keys) + "</span>";
          list.appendChild(row);
        });
      });
      if (!total) list.innerHTML = '<p class="muted">Aucun raccourci ne correspond.</p>';
    }

    var csvBtn = utils.$("#sc-export-csv");
    if (csvBtn) csvBtn.addEventListener("click", function () {
      var rows = currentRows();
      if (!rows.length) { utils.toast("Rien à exporter.", "warn"); return; }
      function q(s) { return '"' + String(s == null ? "" : s).replace(/"/g, '""') + '"'; }
      var lines = [["Logiciel", "Action", "Raccourci"].map(q).join(";")];
      rows.forEach(function (r) { lines.push([r.app, r.action, r.keys].map(q).join(";")); });
      utils.download("raccourcis_" + (current === "Tous" ? "tous" : current).replace(/[^\w-]+/g, "_") + ".csv", "﻿" + lines.join("\r\n"));
      utils.toast("Raccourcis exportés (CSV).", "success");
    });

    var printBtn = utils.$("#sc-print");
    if (printBtn) printBtn.addEventListener("click", function () {
      var rows = currentRows();
      if (!rows.length) { utils.toast("Rien à imprimer.", "warn"); return; }
      var note = MH.shortcutsNote ? "<p style='font-size:12px;color:#555'>" + esc(MH.shortcutsNote) + "</p>" : "";
      var body = rows.map(function (r) {
        return "<tr><td>" + esc(r.app) + "</td><td>" + esc(r.action) + "</td><td><b>" + esc(r.keys) + "</b></td></tr>";
      }).join("");
      var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Fiche Stream Deck</title><style>" +
        "body{font-family:Arial,sans-serif;margin:22px;color:#111}h1{font-size:18px;margin-bottom:2px}" +
        "table{border-collapse:collapse;width:100%;font-size:12px;margin-top:10px}th,td{border:1px solid #999;padding:6px 8px;text-align:left}th{background:#eee}" +
        "</style></head><body><h1>Fiche de programmation Stream Deck</h1>" +
        "<p style='font-size:12px;color:#555'>Pour chaque bouton Stream Deck, ajoute une action « Raccourci / Hotkey » et saisis la combinaison ci-dessous.</p>" +
        note +
        "<table><thead><tr><th>Logiciel</th><th>Action</th><th>Raccourci</th></tr></thead><tbody>" + body + "</tbody></table></body></html>";
      var w = window.open("", "_blank");
      if (!w) { utils.toast("Autorise les pop-ups pour l'impression.", "warn"); return; }
      w.document.write(html); w.document.close();
      setTimeout(function () { w.print(); }, 300);
    });

    renderList();
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>]/g, function (c) {
      return c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;";
    });
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

    table("#spec-audio", ["Usage", "Taux / niveau", "Bits", "Note"], MH.audioSpecs,
      function (r) { return [r.usage, r.taux, r.bits, r.note]; });
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
