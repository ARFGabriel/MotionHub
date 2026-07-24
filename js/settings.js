/* =========================================================
   RÉGLAGES
   Préférences persistantes (localStorage) : thème, valeurs
   par défaut. Applique le thème le plus tôt possible.
   ========================================================= */
(function (MH) {
  "use strict";

  var KEY = "mh:settings";
  var defaults = { theme: "dark", fps: "25", proxyScale: "0.5" };

  var data = load();
  applyTheme(); // Appliqué dès le chargement du script (limite le flash).

  function load() {
    try {
      return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || "{}"));
    } catch (e) {
      return Object.assign({}, defaults);
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function get(key) {
    return data[key];
  }

  function set(key, val) {
    data[key] = val;
    save();
    if (key === "theme") applyTheme();
  }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", data.theme === "light" ? "light" : "dark");
  }

  function init() {
    var utils = MH.utils;

    // Thème
    utils.$$("#set-theme .seg-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.theme === data.theme);
      btn.addEventListener("click", function () {
        set("theme", btn.dataset.theme);
        utils.$$("#set-theme .seg-btn").forEach(function (b) { b.classList.toggle("active", b === btn); });
      });
    });

    // FPS par défaut
    var fpsSel = utils.$("#set-fps");
    if (fpsSel) {
      fpsSel.value = data.fps;
      fpsSel.addEventListener("change", function () {
        set("fps", fpsSel.value);
        applyDefaults();
      });
    }

    // Échelle proxy par défaut
    var scaleSel = utils.$("#set-proxy-scale");
    if (scaleSel) {
      scaleSel.value = data.proxyScale;
      scaleSel.addEventListener("change", function () {
        set("proxyScale", scaleSel.value);
        applyDefaults();
      });
    }

    applyDefaults();
  }

  // Propage les valeurs par défaut aux contrôles concernés.
  function applyDefaults() {
    var utils = MH.utils;
    [ "#calc-fps", "#seq-fps" ].forEach(function (sel) {
      var el = utils.$(sel);
      if (el) el.value = data.fps;
    });
    [ "#proxy-scale", "#watch-scale" ].forEach(function (sel) {
      var el = utils.$(sel);
      if (el) el.value = data.proxyScale;
    });
  }

  MH.settings = { init: init, get: get, set: set };
})(window.MH = window.MH || {});
