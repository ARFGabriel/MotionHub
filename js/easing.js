/* =========================================================
   ÉDITEUR DE COURBES D'EASING (cubic-bezier)
   Poignées glissables, presets, aperçu animé, copie CSS.
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var PAD = 20, SIZE = 180; // repère SVG

  var presets = [
    { name: "ease", v: [0.25, 0.1, 0.25, 1] },
    { name: "linear", v: [0, 0, 1, 1] },
    { name: "ease-in", v: [0.42, 0, 1, 1] },
    { name: "ease-out", v: [0, 0, 0.58, 1] },
    { name: "ease-in-out", v: [0.42, 0, 0.58, 1] },
    { name: "in-out cubic", v: [0.65, 0, 0.35, 1] },
    { name: "out back", v: [0.34, 1.56, 0.64, 1] },
    { name: "in-out expo", v: [0.87, 0, 0.13, 1] },
  ];

  var p1 = [0.25, 0.1], p2 = [0.25, 1];
  var svg, dragging = null;

  MH.easing = { init: init };

  function init() {
    svg = utils.$("#ease-svg");
    if (!svg) return;

    var bar = utils.$("#ease-presets");
    presets.forEach(function (pr) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "exp-filter-btn";
      btn.textContent = pr.name;
      btn.addEventListener("click", function () {
        p1 = [pr.v[0], pr.v[1]];
        p2 = [pr.v[2], pr.v[3]];
        draw();
      });
      bar.appendChild(btn);
    });

    ["ease-p1", "ease-p2"].forEach(function (id) {
      var h = utils.$("#" + id);
      h.addEventListener("pointerdown", function (e) {
        dragging = id === "ease-p1" ? 1 : 2;
        h.setPointerCapture(e.pointerId);
      });
      h.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        var pt = toCurve(e);
        if (dragging === 1) p1 = pt;
        else p2 = pt;
        draw();
      });
      h.addEventListener("pointerup", function () { dragging = null; });
    });

    utils.$("#ease-copy-css").addEventListener("click", function () {
      utils.copy("cubic-bezier(" + vals() + ")").then(function () {
        utils.toast("cubic-bezier copié !", "success");
      });
    });
    utils.$("#ease-play").addEventListener("click", play);

    draw();
  }

  function toCurve(e) {
    var rect = svg.getBoundingClientRect();
    var sx = ((e.clientX - rect.left) / rect.width) * 220;
    var sy = ((e.clientY - rect.top) / rect.height) * 220;
    var x = clamp((sx - PAD) / SIZE, 0, 1);
    var y = clamp((200 - sy) / SIZE, -0.4, 1.4);
    return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function sx(x) { return PAD + x * SIZE; }
  function sy(y) { return 200 - y * SIZE; }
  function vals() { return [p1[0], p1[1], p2[0], p2[1]].join(", "); }

  function draw() {
    var x1 = sx(p1[0]), y1 = sy(p1[1]), x2 = sx(p2[0]), y2 = sy(p2[1]);
    utils.$("#ease-curve").setAttribute("d", "M20,200 C" + x1 + "," + y1 + " " + x2 + "," + y2 + " 200,20");
    setLine("#ease-l1", 20, 200, x1, y1);
    setLine("#ease-l2", 200, 20, x2, y2);
    setC("#ease-p1", x1, y1);
    setC("#ease-p2", x2, y2);
    utils.$("#ease-vals").textContent = vals();
  }

  function setC(sel, x, y) {
    var el = utils.$(sel);
    el.setAttribute("cx", x);
    el.setAttribute("cy", y);
  }
  function setLine(sel, x1, y1, x2, y2) {
    var el = utils.$(sel);
    el.setAttribute("x1", x1); el.setAttribute("y1", y1);
    el.setAttribute("x2", x2); el.setAttribute("y2", y2);
  }

  function play() {
    var ball = utils.$("#ease-ball");
    ball.style.transition = "none";
    ball.style.transform = "translateX(0)";
    void ball.offsetWidth; // reflow
    ball.style.transition = "transform 1.1s cubic-bezier(" + vals() + ")";
    ball.style.transform = "translateX(calc(100% - 22px))";
  }
})(window.MH = window.MH || {});
