/* =========================================================
   AUTOMATISATION — Surveillance de dossiers (desktop)
   Watch-folder : auto-proxy ou moniteur de rendu (notifications).
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var desktop = typeof window.motionHub !== "undefined" && window.motionHub.isDesktop;
  var seq = 0;

  MH.automation = { init: init };

  function init() {
    var listEl = utils.$("#watch-list");
    if (!listEl) return;
    var webNotice = utils.$("#watch-web-notice");

    if (!desktop) {
      if (webNotice) webNotice.hidden = false;
      var addDisabled = utils.$("#watch-add-btn");
      if (addDisabled) addDisabled.disabled = true;
      return;
    }

    utils.$("#watch-config").hidden = false;
    var modeSel = utils.$("#watch-mode");
    var scaleWrap = utils.$("#watch-scale-wrap");
    var tcWrap = utils.$("#watch-tc-wrap");

    // Préréglages de transcodage
    window.motionHub.media.presets().then(function (presets) {
      var sel = utils.$("#watch-tc-preset");
      sel.innerHTML = "";
      presets.forEach(function (p) {
        var o = document.createElement("option");
        o.value = p.id;
        o.textContent = p.label;
        sel.appendChild(o);
      });
    });

    function syncMode() {
      scaleWrap.hidden = modeSel.value !== "proxy";
      tcWrap.hidden = modeSel.value !== "transcode";
    }
    modeSel.addEventListener("change", syncMode);
    syncMode();

    // Un seul abonnement aux événements de surveillance.
    window.motionHub.watch.onEvent(handleEvent);

    // Restaure les surveillances persistées.
    window.motionHub.watch.list().then(function (watches) {
      (watches || []).forEach(addWatchRow);
      if (watches && watches.length) log("info", watches.length + " surveillance(s) restaurée(s).");
    });

    utils.$("#watch-add-btn").addEventListener("click", function () {
      window.motionHub.pickFolder().then(function (folder) {
        if (!folder) return;
        var mode = modeSel.value;
        var options = {};
        if (mode === "proxy") options.scale = parseFloat(utils.$("#watch-scale").value);
        else if (mode === "transcode") options.presetId = utils.$("#watch-tc-preset").value;
        var id = "watch-" + Date.now();
        window.motionHub.watch
          .start(id, folder, mode, options)
          .then(function (info) {
            addWatchRow(info);
            log("info", "Surveillance démarrée : " + folder + " (" + modeLabel(mode) + ")");
            utils.toast("Surveillance active.", "success");
          })
          .catch(function (err) {
            utils.toast("Erreur : " + err.message, "error");
          });
      });
    });
  }

  function modeLabel(mode) {
    if (mode === "proxy") return "auto-proxy";
    if (mode === "transcode") return "auto-transcode";
    return "notification";
  }

  function addWatchRow(info) {
    var listEl = utils.$("#watch-list");
    var row = document.createElement("div");
    row.className = "card watch-item";
    row.dataset.watchId = info.id;
    row.innerHTML =
      '<div class="watch-item__info">' +
      '<i class="fas fa-eye"></i>' +
      '<div><div class="watch-item__folder">' + utils.escapeHtml(info.folder) + "</div>" +
      '<div class="watch-item__mode">' + modeLabel(info.mode) + "</div></div>" +
      "</div>" +
      '<button class="mini-btn mini-btn--danger" data-act="stop"><i class="fas fa-stop"></i> Arrêter</button>';
    row.querySelector('[data-act="stop"]').addEventListener("click", function () {
      window.motionHub.watch.stop(info.id).then(function () {
        row.remove();
        log("info", "Surveillance arrêtée : " + info.folder);
      });
    });
    listEl.prepend(row);
  }

  function handleEvent(data) {
    if (data.type === "detected") {
      log("detect", "Détecté : " + data.name);
    } else if (data.type === "processing") {
      log("work", "Traitement : " + data.name + "…");
    } else if (data.type === "done") {
      log("done", (data.message || "Terminé") + " : " + data.name);
      if (data.output) utils.toast("Proxy créé : " + data.name, "success");
      if (MH.activity) MH.activity.log({ type: "Surveillance", label: (data.message || "Détecté") + " : " + data.name, output: data.output || null });
    } else if (data.type === "error") {
      log("error", "Erreur (" + data.name + ") : " + data.message);
    }
  }

  function log(kind, text) {
    var card = utils.$("#watch-log-card");
    var logEl = utils.$("#watch-log");
    if (!logEl) return;
    card.hidden = false;
    var line = document.createElement("div");
    line.className = "log-line log-line--" + kind;
    var time = new Date().toLocaleTimeString();
    line.innerHTML = '<span class="log-time">' + time + "</span> " + utils.escapeHtml(text);
    logEl.prepend(line);
  }
})(window.MH = window.MH || {});
