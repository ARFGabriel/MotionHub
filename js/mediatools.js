/* =========================================================
   BOÎTE À OUTILS MÉDIA (desktop / Electron + ffmpeg)
   Media Info · Transcodeur · Séquence→vidéo · Extraction frames
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var desktop = typeof window.motionHub !== "undefined" && window.motionHub.isDesktop;
  var jobSeq = 0;
  var jobEls = {};
  var mediaJobsEl = null;

  MH.mediatools = { init: init, run: run };

  function fileName(p) {
    return p.split(/[\\/]/).pop();
  }

  function init() {
    var tools = utils.$("#media-tools");
    if (!tools) return;
    var webNotice = utils.$("#media-web-notice");

    if (!desktop) {
      if (webNotice) webNotice.hidden = false;
      return;
    }
    tools.hidden = false;

    var jobsEl = utils.$("#media-jobs");
    mediaJobsEl = jobsEl;
    window.motionHub.media.onProgress(function (data) {
      var el = jobEls[data.jobId];
      if (el) setProgress(el, data.percent);
    });

    initMediaInfo();
    initTranscode(jobsEl);
    initSequence(jobsEl);
    initFrames();
  }

  // Lanceur de job partagé (utilisé aussi par la bibliothèque de LUTs).
  function run(label, icon, starter) {
    runJob(mediaJobsEl || utils.$("#media-jobs"), label, icon, starter);
  }

  /* ---- Media Info ---- */
  function initMediaInfo() {
    utils.$("#mi-pick-btn").addEventListener("click", function () {
      window.motionHub.pickVideos().then(function (files) {
        if (!files || !files.length) return;
        var res = utils.$("#mi-result");
        res.hidden = false;
        res.innerHTML = '<p class="muted">Analyse…</p>';
        window.motionHub.media
          .probe(files[0])
          .then(function (m) {
            res.innerHTML = infoRow("Fichier", fileName(files[0])) +
              infoRow("Résolution", m.width && m.height ? m.width + " × " + m.height : "—") +
              infoRow("Codec", m.codec || "—") +
              infoRow("FPS", m.fps || "—") +
              infoRow("Durée", formatDuration(m.duration)) +
              infoRow("Poids", utils.formatSize(m.size));
          })
          .catch(function (err) {
            res.innerHTML = '<p class="muted">Erreur : ' + utils.escapeHtml(err.message) + "</p>";
          });
      });
    });
  }

  function infoRow(k, v) {
    return '<div class="media-info__row"><span>' + k + "</span><strong>" + utils.escapeHtml(String(v)) + "</strong></div>";
  }

  /* ---- Transcodeur (presets intégrés + personnalisés) ---- */
  function initTranscode(jobsEl) {
    var sel = utils.$("#tc-preset");

    function populate() {
      window.motionHub.media.presets().then(function (builtin) {
        sel.innerHTML = "";
        builtin.forEach(function (p) {
          var o = document.createElement("option");
          o.value = p.id;
          o.textContent = p.label;
          sel.appendChild(o);
        });
        var customs = MH.presets ? MH.presets.list() : [];
        if (customs.length) {
          var grp = document.createElement("optgroup");
          grp.label = "Mes presets";
          customs.forEach(function (c) {
            var o = document.createElement("option");
            o.value = "custom:" + c.id;
            o.textContent = c.name;
            grp.appendChild(o);
          });
          sel.appendChild(grp);
        }
      });
    }
    populate();
    if (MH.presets && MH.presets.onChange) MH.presets.onChange(populate);

    utils.$("#tc-pick-btn").addEventListener("click", function () {
      window.motionHub.pickVideos().then(function (files) {
        if (!files || !files.length) return;
        var val = sel.value;
        files.forEach(function (file) {
          runJob(jobsEl, fileName(file), "fa-right-left", function (jobId) {
            if (val.indexOf("custom:") === 0) {
              var id = val.slice(7);
              var spec = MH.presets.list().filter(function (p) { return p.id === id; })[0] || {};
              return window.motionHub.media.transcodeCustom(jobId, file, spec);
            }
            return window.motionHub.media.transcode(jobId, file, val);
          });
        });
      });
    });
  }

  /* ---- Séquence d'images → vidéo ---- */
  function initSequence(jobsEl) {
    utils.$("#seq-pick-btn").addEventListener("click", function () {
      window.motionHub.media.pickImage().then(function (first) {
        if (!first) return;
        var info = utils.$("#seq-info");
        window.motionHub.media.detectSequence(first).then(function (seq) {
          if (!seq) {
            info.hidden = false;
            info.innerHTML = '<p class="muted">Aucune numérotation détectée dans ce fichier.</p>';
            return;
          }
          info.hidden = false;
          info.innerHTML = infoRow("Motif", seq.pattern) + infoRow("Images", seq.count);
          var opts = { fps: parseInt(utils.$("#seq-fps").value, 10), format: utils.$("#seq-fmt").value };
          runJob(jobsEl, seq.pattern, "fa-images", function (jobId) {
            return window.motionHub.media.renderSequence(jobId, first, opts);
          });
        });
      });
    });
  }

  /* ---- Extraction de frames ---- */
  function initFrames() {
    utils.$("#fr-pick-btn").addEventListener("click", function () {
      window.motionHub.pickVideos().then(function (files) {
        if (!files || !files.length) return;
        var every = parseFloat(utils.$("#fr-every").value) || 5;
        var jobsEl = utils.$("#media-jobs");
        files.forEach(function (file) {
          var el = createJobEl(jobsEl, fileName(file), "fa-film");
          setStatus(el, "Extraction…");
          setProgress(el, 50);
          window.motionHub.media
            .extractFrames(file, { every: every })
            .then(function (r) {
              setProgress(el, 100);
              setStatus(el, r.count + " images extraites", "done");
              addOpenAction(el, r.dir);
              utils.toast(r.count + " images extraites.", "success");
              if (MH.activity) MH.activity.log({ type: "Frames", label: r.count + " images — " + fileName(file), output: r.dir });
            })
            .catch(function (err) {
              setStatus(el, "Erreur : " + err.message, "error");
              el.classList.add("proxy-job--error");
            });
        });
      });
    });
  }

  /* ---- Helpers de job (barre de progression réutilisée) ---- */
  function runJob(container, label, icon, starter) {
    var jobId = "mjob-" + ++jobSeq;
    var el = createJobEl(container, label, icon);
    jobEls[jobId] = el;
    setStatus(el, "En cours…");
    starter(jobId)
      .then(function (res) {
        setProgress(el, 100);
        setStatus(el, "Terminé · " + utils.formatSize(res.size), "done");
        addOpenAction(el, res.output);
        utils.toast("Terminé : " + fileName(res.output), "success");
        if (MH.activity) MH.activity.log({ type: "Média", label: fileName(res.output), output: res.output });
      })
      .catch(function (err) {
        setStatus(el, "Erreur : " + err.message, "error");
        el.classList.add("proxy-job--error");
      });
  }

  function createJobEl(container, label, icon) {
    var el = document.createElement("div");
    el.className = "card proxy-job";
    el.innerHTML =
      '<div class="proxy-job__head">' +
      '<i class="fas ' + icon + '"></i>' +
      '<span class="proxy-job__name">' + utils.escapeHtml(label) + "</span>" +
      '<span class="proxy-job__status">…</span>' +
      "</div>" +
      '<div class="progress"><div class="progress__bar" style="width:0%"></div></div>' +
      '<div class="proxy-job__actions" hidden>' +
      '<button class="mini-btn" data-act="open"><i class="fas fa-folder-open"></i> Ouvrir le dossier</button>' +
      "</div>";
    container.prepend(el);
    return el;
  }

  function addOpenAction(el, targetPath) {
    var actions = el.querySelector(".proxy-job__actions");
    actions.hidden = false;
    actions.querySelector('[data-act="open"]').addEventListener("click", function () {
      window.motionHub.shell.reveal(targetPath);
    });
  }

  function setProgress(el, pct) {
    var bar = el.querySelector(".progress__bar");
    if (bar) bar.style.width = pct + "%";
    if (pct < 100) setStatus(el, "En cours… " + pct + "%");
  }

  function setStatus(el, text, state) {
    var s = el.querySelector(".proxy-job__status");
    if (s) {
      s.textContent = text;
      s.className = "proxy-job__status" + (state ? " proxy-job__status--" + state : "");
    }
  }

  function formatDuration(sec) {
    if (!sec) return "—";
    var m = Math.floor(sec / 60);
    var s = Math.round(sec % 60);
    return (m > 0 ? m + " min " : "") + s + " s";
  }
})(window.MH = window.MH || {});
