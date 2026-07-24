/* =========================================================
   UTILITAIRES PARTAGÉS
   Petites fonctions réutilisables : DOM, presse-papiers,
   téléchargement, formatage, notifications toast.
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = {};

  /** Sélecteur court. */
  utils.$ = function (selector, root) {
    return (root || document).querySelector(selector);
  };
  utils.$$ = function (selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  };

  /** Copie du texte dans le presse-papiers avec repli si l'API échoue. */
  utils.copy = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Repli (contexte non sécurisé / file://)
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  };

  /** Déclenche le téléchargement d'un fichier texte généré. */
  utils.download = function (filename, content) {
    var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /** Formate une taille en octets vers une chaîne lisible (Ko, Mo, Go). */
  utils.formatSize = function (bytes) {
    if (bytes === 0 || bytes == null) return "0 o";
    var units = ["o", "Ko", "Mo", "Go", "To"];
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    i = Math.min(i, units.length - 1);
    return (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1) + " " + units[i];
  };

  /** Échappe le HTML pour éviter toute injection dans innerHTML. */
  utils.escapeHtml = function (str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  };

  /** Affiche une notification temporaire (remplace alert()). */
  var toastTimer = null;
  utils.toast = function (message, type) {
    var el = utils.$("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.className = "toast show" + (type ? " toast--" + type : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.className = "toast";
    }, 2600);
  };

  MH.utils = utils;
})(window.MH = window.MH || {});
