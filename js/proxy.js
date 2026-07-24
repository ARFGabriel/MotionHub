/* =========================================================
   GÉNÉRATION DE PROXYS (mode desktop / Electron + ffmpeg)
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var desktop = typeof window.motionHub !== "undefined" && window.motionHub.isDesktop;
  var jobSeq = 0;
  var jobEls = {}; // jobId -> élément DOM

  MH.proxy = { init: init };

  function init() {
    var pickBtn = utils.$("#proxy-pick-btn");
    if (!pickBtn) return;
    // Les proxys partagent la liste de jobs de la boîte à outils média.
    var jobsEl = utils.$("#media-jobs");

    if (!desktop) {
      pickBtn.disabled = true;
      return;
    }

    // Un seul abonnement aux événements de progression.
    window.motionHub.proxy.onProgress(function (data) {
      var el = jobEls[data.jobId];
      if (el) setProgress(el, data.percent);
    });

    pickBtn.addEventListener("click", function () {
      window.motionHub.pickVideos().then(function (files) {
        if (!files || !files.length) return;
        var opts = {
          format: utils.$("#proxy-fmt").value,
          scale: parseFloat(utils.$("#proxy-scale").value),
        };
        files.forEach(function (file) {
          queueJob(file, opts, jobsEl);
        });
      });
    });
  }

  function fileName(p) {
    return p.split(/[\\/]/).pop();
  }

  function queueJob(input, opts, container) {
    var jobId = "job-" + ++jobSeq;
    var el = document.createElement("div");
    el.className = "card proxy-job";
    el.innerHTML =
      '<div class="proxy-job__head">' +
      '<i class="fas fa-film"></i>' +
      '<span class="proxy-job__name">' + utils.escapeHtml(fileName(input)) + "</span>" +
      '<span class="proxy-job__status">En attente…</span>' +
      "</div>" +
      '<div class="progress"><div class="progress__bar" style="width:0%"></div></div>' +
      '<div class="proxy-job__actions" hidden>' +
      '<button class="mini-btn" data-act="open"><i class="fas fa-up-right-from-square"></i> Ouvrir le dossier</button>' +
      "</div>";
    container.prepend(el);
    jobEls[jobId] = el;

    setStatus(el, "Encodage…");
    window.motionHub.proxy
      .generate(jobId, input, opts)
      .then(function (res) {
        setProgress(el, 100);
        setStatus(el, "Terminé · " + utils.formatSize(res.size), "done");
        var actions = el.querySelector(".proxy-job__actions");
        actions.hidden = false;
        actions.querySelector('[data-act="open"]').addEventListener("click", function () {
          window.motionHub.shell.reveal(res.output);
        });
        utils.toast("Proxy créé : " + fileName(res.output), "success");
        if (MH.activity) MH.activity.log({ type: "Proxy", label: fileName(res.output), output: res.output });
      })
      .catch(function (err) {
        setStatus(el, "Erreur : " + err.message, "error");
        el.classList.add("proxy-job--error");
      });
  }

  function setProgress(el, pct) {
    var bar = el.querySelector(".progress__bar");
    if (bar) bar.style.width = pct + "%";
    if (pct < 100) setStatus(el, "Encodage… " + pct + "%");
  }

  function setStatus(el, text, state) {
    var s = el.querySelector(".proxy-job__status");
    if (s) {
      s.textContent = text;
      s.className = "proxy-job__status" + (state ? " proxy-job__status--" + state : "");
    }
  }
})(window.MH = window.MH || {});
