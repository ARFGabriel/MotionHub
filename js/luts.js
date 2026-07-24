/* =========================================================
   BIBLIOTHÈQUE DE LUTs (desktop)
   Enregistre des .cube, favoris, applique à une vidéo (ffmpeg).
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var desktop = typeof window.motionHub !== "undefined" && window.motionHub.isDesktop;
  var KEY = "mh:luts";
  var selectedId = null;

  MH.luts = { init: init };

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  function init() {
    var listEl = utils.$("#lut-list");
    if (!listEl) return;
    var addBtn = utils.$("#lut-add-btn");
    var applyBtn = utils.$("#lut-apply-btn");

    if (!desktop) {
      addBtn.disabled = true;
      applyBtn.disabled = true;
      listEl.innerHTML = '<p class="muted mini">Disponible dans l\'app desktop.</p>';
      return;
    }

    addBtn.addEventListener("click", function () {
      window.motionHub.media.pickLut().then(function (path) {
        if (!path) return;
        var list = load();
        if (list.some(function (l) { return l.path === path; })) {
          utils.toast("LUT déjà dans la bibliothèque.", "warn");
          return;
        }
        list.push({ id: "l" + Date.now(), name: path.split(/[\\/]/).pop(), path: path, fav: false });
        save(list);
        render();
      });
    });

    applyBtn.addEventListener("click", function () {
      var lut = load().filter(function (l) { return l.id === selectedId; })[0];
      if (!lut) return;
      window.motionHub.pickVideos().then(function (files) {
        if (!files || !files.length) return;
        files.forEach(function (file) {
          var label = file.split(/[\\/]/).pop() + " + " + lut.name;
          MH.mediatools.run(label, "fa-palette", function (jobId) {
            return window.motionHub.media.applyLut(jobId, file, lut.path);
          });
        });
        MH.showTool("media");
      });
    });

    render();
  }

  function render() {
    var listEl = utils.$("#lut-list");
    var applyBtn = utils.$("#lut-apply-btn");
    var list = load().sort(function (a, b) { return (b.fav ? 1 : 0) - (a.fav ? 1 : 0); });

    if (!list.length) {
      listEl.innerHTML = '<p class="muted mini">Aucune LUT enregistrée.</p>';
      applyBtn.disabled = true;
      return;
    }
    listEl.innerHTML = "";
    list.forEach(function (l) {
      var row = document.createElement("div");
      row.className = "lut-row" + (l.id === selectedId ? " selected" : "");
      row.innerHTML =
        '<button class="lut-fav' + (l.fav ? " on" : "") + '" title="Favori"><i class="fas fa-star"></i></button>' +
        '<span class="lut-name">' + utils.escapeHtml(l.name) + "</span>" +
        '<button class="lut-del" title="Retirer"><i class="fas fa-xmark"></i></button>';

      row.querySelector(".lut-name").addEventListener("click", function () {
        selectedId = l.id;
        applyBtn.disabled = false;
        render();
      });
      row.querySelector(".lut-fav").addEventListener("click", function () {
        var all = load();
        var t = all.filter(function (x) { return x.id === l.id; })[0];
        if (t) t.fav = !t.fav;
        save(all);
        render();
      });
      row.querySelector(".lut-del").addEventListener("click", function () {
        save(load().filter(function (x) { return x.id !== l.id; }));
        if (selectedId === l.id) { selectedId = null; applyBtn.disabled = true; }
        render();
      });
      listEl.appendChild(row);
    });
  }
})(window.MH = window.MH || {});
