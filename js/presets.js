/* =========================================================
   PRESETS DE TRANSCODAGE PERSONNALISÉS
   Stockés en localStorage, gérés dans Réglages, utilisés
   dans la boîte à outils média.
   ========================================================= */
(function (MH) {
  "use strict";

  var KEY = "mh:presets";
  var utils = MH.utils;
  var listeners = [];

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function save(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {}
    listeners.forEach(function (cb) { try { cb(list); } catch (e) {} });
  }

  function list() {
    return load();
  }
  function add(preset) {
    var l = load();
    preset.id = "p" + Date.now();
    l.push(preset);
    save(l);
    return preset;
  }
  function remove(id) {
    save(load().filter(function (p) { return p.id !== id; }));
  }
  function onChange(cb) {
    listeners.push(cb);
  }

  function init() {
    var addBtn = utils.$("#preset-add");
    if (!addBtn) return;

    addBtn.addEventListener("click", function () {
      var name = (utils.$("#preset-name").value || "").trim();
      if (!name) {
        utils.toast("Donne un nom au preset.", "warn");
        return;
      }
      add({
        name: name,
        codec: utils.$("#preset-codec").value,
        scale: utils.$("#preset-scale").value,
        quality: utils.$("#preset-quality").value,
        audio: utils.$("#preset-audio").value,
      });
      utils.$("#preset-name").value = "";
      renderList();
      utils.toast("Preset ajouté.", "success");
    });

    renderList();
  }

  function renderList() {
    var el = utils.$("#preset-list");
    if (!el) return;
    var presets = load();
    if (!presets.length) {
      el.innerHTML = '<p class="muted mini">Aucun preset personnalisé.</p>';
      return;
    }
    el.innerHTML = "";
    presets.forEach(function (p) {
      var row = document.createElement("div");
      row.className = "preset-row";
      row.innerHTML =
        '<span class="preset-row__name">' + utils.escapeHtml(p.name) + "</span>" +
        '<span class="preset-row__spec">' + p.codec.toUpperCase() + " · " + Math.round(parseFloat(p.scale) * 100) + "% · " + p.quality + "</span>" +
        '<button class="mini-btn mini-btn--danger" data-id="' + p.id + '"><i class="fas fa-xmark"></i></button>';
      row.querySelector("button").addEventListener("click", function () {
        remove(p.id);
        renderList();
      });
      el.appendChild(row);
    });
  }

  MH.presets = { init: init, list: list, add: add, remove: remove, onChange: onChange };
})(window.MH = window.MH || {});
