/* =========================================================
   MISES À JOUR (desktop / electron-updater)
   Affiche la version, vérifie, télécharge, installe.
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var desktop = typeof window.motionHub !== "undefined" && window.motionHub.isDesktop;

  MH.updater = { init: init };

  function init() {
    var card = utils.$("#update-card");
    if (!card) return;

    var versionEl = utils.$("#update-version");
    var statusEl = utils.$("#update-status");
    var progress = utils.$("#update-progress");
    var bar = progress.querySelector(".progress__bar");
    var checkBtn = utils.$("#update-check-btn");
    var installBtn = utils.$("#update-install-btn");

    if (!desktop) {
      statusEl.textContent = "Disponible uniquement dans l'application desktop.";
      checkBtn.disabled = true;
      return;
    }

    window.motionHub.update.version().then(function (v) {
      versionEl.textContent = "v" + v;
    });

    function setStatus(text) {
      statusEl.textContent = text;
    }

    window.motionHub.update.onStatus(function (data) {
      switch (data.state) {
        case "checking":
          setStatus("Recherche de mises à jour…");
          break;
        case "available":
          setStatus("Mise à jour " + data.version + " trouvée — téléchargement…");
          progress.hidden = false;
          break;
        case "downloading":
          progress.hidden = false;
          bar.style.width = data.percent + "%";
          setStatus("Téléchargement… " + data.percent + "%");
          break;
        case "downloaded":
          progress.hidden = true;
          setStatus("Mise à jour " + data.version + " prête à installer.");
          installBtn.hidden = false;
          break;
        case "none":
          setStatus("Tu es à jour.");
          break;
        case "error":
          setStatus("Erreur : " + data.message);
          break;
      }
    });

    checkBtn.addEventListener("click", function () {
      setStatus("Recherche…");
      window.motionHub.update.check().then(function (res) {
        if (res && res.state === "dev") setStatus("Indisponible en mode développement (teste sur la version installée).");
        else if (res && res.state === "error") setStatus("Erreur : " + res.message);
      });
    });

    installBtn.addEventListener("click", function () {
      window.motionHub.update.install();
    });
  }
})(window.MH = window.MH || {});
