/* =========================================================
   EXTRACTEUR DE PALETTE
   Couleurs dominantes d'une image (ou frame vidéo).
   Analyse via canvas — fonctionne en web et en desktop.
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var desktop = typeof window.motionHub !== "undefined" && window.motionHub.isDesktop;

  MH.palette = { init: init };

  function init() {
    var fileInput = utils.$("#pal-file");
    if (!fileInput) return;

    utils.$("#pal-image-btn").addEventListener("click", function () {
      fileInput.click();
    });
    fileInput.addEventListener("change", function () {
      if (fileInput.files && fileInput.files[0]) {
        loadFromUrl(URL.createObjectURL(fileInput.files[0]));
      }
    });

    var videoBtn = utils.$("#pal-video-btn");
    if (desktop && videoBtn) {
      videoBtn.hidden = false;
      videoBtn.addEventListener("click", function () {
        window.motionHub.pickVideos().then(function (files) {
          if (!files || !files.length) return;
          window.motionHub.media.thumbnail(files[0]).then(loadFromUrl);
        });
      });
    }
  }

  function loadFromUrl(url) {
    var img = new Image();
    img.onload = function () {
      showPreview(url);
      renderSwatches(extract(img));
    };
    img.onerror = function () {
      utils.toast("Image illisible.", "error");
    };
    img.src = url;
  }

  function showPreview(url) {
    var p = utils.$("#pal-preview");
    if (p) {
      p.hidden = false;
      p.style.backgroundImage = "url('" + url + "')";
    }
  }

  function extract(img) {
    var c = utils.$("#pal-canvas");
    var w = 140, h = 140;
    c.width = w;
    c.height = h;
    var ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    var data = ctx.getImageData(0, 0, w, h).data;

    var buckets = {};
    for (var i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue; // transparent
      var r = data[i], g = data[i + 1], b = data[i + 2];
      var key = (r >> 5) + "," + (g >> 5) + "," + (b >> 5); // 8 niveaux/canal
      if (!buckets[key]) buckets[key] = { r: 0, g: 0, b: 0, n: 0 };
      var bk = buckets[key];
      bk.r += r; bk.g += g; bk.b += b; bk.n++;
    }
    return Object.keys(buckets)
      .map(function (k) { return buckets[k]; })
      .sort(function (a, b) { return b.n - a.n; })
      .slice(0, 6)
      .map(function (bk) {
        return { r: Math.round(bk.r / bk.n), g: Math.round(bk.g / bk.n), b: Math.round(bk.b / bk.n) };
      });
  }

  function toHex(c) {
    var arr = [c.r, c.g, c.b].map(function (v) {
      var s = v.toString(16);
      return s.length === 1 ? "0" + s : s;
    });
    return "#" + arr.join("").toUpperCase();
  }

  function renderSwatches(colors) {
    var el = utils.$("#pal-swatches");
    el.innerHTML = "";
    colors.forEach(function (c) {
      var hex = toHex(c);
      var sw = document.createElement("button");
      sw.className = "swatch";
      sw.style.background = "rgb(" + c.r + "," + c.g + "," + c.b + ")";
      sw.innerHTML = '<span class="swatch-hex">' + hex + "</span>";
      sw.addEventListener("click", function () {
        utils.copy(hex).then(function () { utils.toast(hex + " copié !", "success"); });
      });
      el.appendChild(sw);
    });
  }
})(window.MH = window.MH || {});
