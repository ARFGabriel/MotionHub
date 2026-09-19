/* =========================================================
   OUTILS DE TOURNAGE
   Shot list · Matériel · Calculatrices · Caméra · Clap
   100% web (localStorage + calculs). Aucune dépendance desktop.
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var CoC = 0.03; // cercle de confusion plein format (mm)

  MH.shoot = { init: init };

  function init() {
    if (!utils.$("#shoot")) return;
    initShotlist();
    initGear();
    initCalculators();
    initCamera();
    initSlate();
  }

  function lsGet(key, def) {
    try { return JSON.parse(localStorage.getItem(key)) || def; } catch (e) { return def; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* ---------------- SHOT LIST ---------------- */
  function initShotlist() {
    var shots = lsGet("mh:shotlist", []);

    utils.$("#shot-add").addEventListener("click", function () {
      var desc = utils.$("#shot-desc").value.trim();
      if (!desc) { utils.toast("Décris le plan.", "warn"); return; }
      shots.push({
        id: "s" + Date.now(),
        desc: desc,
        frame: utils.$("#shot-frame").value,
        move: utils.$("#shot-move").value,
        lens: utils.$("#shot-lens").value.trim(),
        done: false,
      });
      lsSet("mh:shotlist", shots);
      utils.$("#shot-desc").value = "";
      utils.$("#shot-lens").value = "";
      renderShots();
    });

    function renderShots() {
      var el = utils.$("#shotlist-items");
      if (!shots.length) { el.innerHTML = '<p class="muted">Aucun plan pour l\'instant.</p>'; return; }
      var doneCount = shots.filter(function (s) { return s.done; }).length;
      el.innerHTML = '<div class="shotlist-head muted">' + doneCount + " / " + shots.length + " plans tournés</div>";
      shots.forEach(function (s, i) {
        var row = document.createElement("div");
        row.className = "shot-row card" + (s.done ? " shot-row--done" : "");
        row.innerHTML =
          '<input type="checkbox"' + (s.done ? " checked" : "") + ">" +
          '<span class="shot-num">#' + (i + 1) + "</span>" +
          '<div class="shot-main"><div class="shot-desc">' + utils.escapeHtml(s.desc) + "</div>" +
          '<div class="shot-tags"><span>' + utils.escapeHtml(s.frame) + "</span><span>" + utils.escapeHtml(s.move) + "</span>" +
          (s.lens ? "<span>" + utils.escapeHtml(s.lens) + "</span>" : "") + "</div></div>" +
          '<button class="shot-del" title="Supprimer"><i class="fas fa-xmark"></i></button>';
        row.querySelector("input").addEventListener("change", function (e) {
          shots[i].done = e.target.checked;
          lsSet("mh:shotlist", shots);
          renderShots();
        });
        row.querySelector(".shot-del").addEventListener("click", function () {
          shots.splice(i, 1);
          lsSet("mh:shotlist", shots);
          renderShots();
        });
        el.appendChild(row);
      });
    }
    renderShots();
  }

  /* ---------------- MATÉRIEL ---------------- */
  function initGear() {
    var state = lsGet("mh:gear", { checked: {}, custom: [] });
    var catSel = utils.$("#gear-cat");
    (MH.gearDefault || []).forEach(function (g) {
      var o = document.createElement("option"); o.value = g.cat; o.textContent = g.cat; catSel.appendChild(o);
    });

    utils.$("#gear-add").addEventListener("click", function () {
      var name = utils.$("#gear-new").value.trim();
      if (!name) return;
      state.custom.push({ cat: catSel.value, name: name });
      lsSet("mh:gear", state);
      utils.$("#gear-new").value = "";
      render();
    });
    utils.$("#gear-reset").addEventListener("click", function () {
      state.checked = {};
      lsSet("mh:gear", state);
      render();
    });

    function render() {
      var el = utils.$("#gear-container");
      el.innerHTML = "";
      (MH.gearDefault || []).forEach(function (g) {
        var items = g.items.map(function (n) { return { name: n, custom: false }; });
        state.custom.filter(function (c) { return c.cat === g.cat; }).forEach(function (c) { items.push({ name: c.name, custom: true }); });
        el.appendChild(gearGroup(g.cat, items));
      });
    }

    function gearGroup(cat, items) {
      var card = document.createElement("div");
      card.className = "card gear-group";
      card.innerHTML = "<h3>" + utils.escapeHtml(cat) + "</h3>";
      items.forEach(function (it) {
        var key = cat + "::" + it.name;
        var row = document.createElement("label");
        row.className = "gear-item" + (state.checked[key] ? " checked" : "");
        row.innerHTML = '<input type="checkbox"' + (state.checked[key] ? " checked" : "") + "><span>" + utils.escapeHtml(it.name) + "</span>" +
          (it.custom ? '<button class="gear-del" title="Retirer"><i class="fas fa-xmark"></i></button>' : "");
        row.querySelector("input").addEventListener("change", function (e) {
          state.checked[key] = e.target.checked;
          lsSet("mh:gear", state);
          row.classList.toggle("checked", e.target.checked);
        });
        if (it.custom) {
          row.querySelector(".gear-del").addEventListener("click", function (e) {
            e.preventDefault();
            state.custom = state.custom.filter(function (c) { return !(c.cat === cat && c.name === it.name); });
            lsSet("mh:gear", state);
            render();
          });
        }
        card.appendChild(row);
      });
      return card;
    }
    render();
  }

  /* ---------------- CALCULATRICES ---------------- */
  function initCalculators() {
    // Remplissage des selects
    var ndLight = utils.$("#nd-light");
    (MH.shootLighting || []).forEach(function (l) {
      var o = document.createElement("option"); o.value = l.ev; o.textContent = l.label; ndLight.appendChild(o);
    });
    var cardMode = utils.$("#card-mode");
    (MH.recordModes || []).forEach(function (m) {
      var o = document.createElement("option"); o.value = m.mbps; o.textContent = m.label; cardMode.appendChild(o);
    });

    // --- DoF ---
    function dof() {
      var f = parseFloat(utils.$("#dof-focal").value) || 50;
      var N = parseFloat(utils.$("#dof-aperture").value) || 2.8;
      var s = (parseFloat(utils.$("#dof-distance").value) || 3) * 1000; // mm
      var H = (f * f) / (N * CoC) + f;
      var Dn = (s * (H - f)) / (H + s - 2 * f);
      var farDen = H - s;
      var Df = farDen <= 0 ? Infinity : (s * (H - f)) / farDen;
      var dofTot = Df === Infinity ? Infinity : Df - Dn;
      utils.$("#dof-result").innerHTML =
        row("Zone nette avant", (Dn / 1000).toFixed(2) + " m") +
        row("Zone nette arrière", Df === Infinity ? "∞" : (Df / 1000).toFixed(2) + " m") +
        row("Profondeur de champ", dofTot === Infinity ? "∞" : (dofTot / 1000).toFixed(2) + " m") +
        row("Hyperfocale", (H / 1000).toFixed(2) + " m");
    }
    bind(["#dof-focal", "#dof-aperture", "#dof-distance"], dof); dof();

    // --- Angle de champ ---
    function aov() {
      var f = parseFloat(utils.$("#aov-focal").value) || 35;
      var h = deg(2 * Math.atan(36 / (2 * f)));
      var v = deg(2 * Math.atan(24 / (2 * f)));
      var d = deg(2 * Math.atan(43.27 / (2 * f)));
      utils.$("#aov-result").innerHTML =
        row("Horizontal", h.toFixed(1) + "°") + row("Vertical", v.toFixed(1) + "°") + row("Diagonal", d.toFixed(1) + "°");
    }
    bind(["#aov-focal"], aov); aov();

    // --- Règle 180° ---
    function shutter() {
      var fps = parseFloat(utils.$("#sh-fps").value) || 25;
      var denom = Math.round(2 * fps);
      utils.$("#sh-result").innerHTML =
        row("Obturation idéale", "1/" + denom + " s") +
        row("Réglage boîtier proche", "1/" + nearestShutter(denom) + " s");
    }
    utils.$("#sh-fps").addEventListener("change", shutter); shutter();

    // --- Filtre ND ---
    function nd() {
      var Lv = parseFloat(utils.$("#nd-light").value) || 15;
      var fps = parseFloat(utils.$("#nd-fps").value) || 25;
      var N = parseFloat(utils.$("#nd-aperture").value) || 2.8;
      var iso = parseFloat(utils.$("#nd-iso").value) || 800;
      var camEV = Math.log2((N * N) * (2 * fps)); // 1/t = 2*fps
      var need = Lv + Math.log2(iso / 100);
      var stops = need - camEV;
      var out;
      if (stops <= 0.5) out = row("Filtre ND", "Aucun nécessaire");
      else {
        var r = Math.round(stops);
        out = row("Sur-exposition", "+" + stops.toFixed(1) + " IL") +
          row("ND conseillé", ndName(r) + " (" + r + " IL)") +
          row("Densité optique", (r * 0.3).toFixed(1));
      }
      utils.$("#nd-result").innerHTML = out;
    }
    bind(["#nd-aperture", "#nd-iso"], nd);
    utils.$("#nd-light").addEventListener("change", nd);
    utils.$("#nd-fps").addEventListener("change", nd);
    nd();

    // --- Autonomie carte ---
    function card() {
      var gb = parseFloat(utils.$("#card-size").value) || 128;
      var mbps = parseFloat(utils.$("#card-mode").value) || 100;
      var minutes = (gb * 1000 * 8) / mbps / 60; // Go→Mb / (Mb/s) → s → min
      var h = Math.floor(minutes / 60);
      var m = Math.round(minutes % 60);
      utils.$("#card-result").innerHTML =
        row("Durée d'enregistrement", (h > 0 ? h + " h " : "") + m + " min") +
        row("≈ minutes", Math.round(minutes) + " min");
    }
    utils.$("#card-size").addEventListener("input", card);
    utils.$("#card-mode").addEventListener("change", card);
    card();

    // --- Golden hour ---
    var dateInput = utils.$("#sun-date");
    dateInput.value = new Date().toISOString().slice(0, 10);
    utils.$("#sun-calc").addEventListener("click", function () {
      var lat = parseFloat(utils.$("#sun-lat").value);
      var lng = parseFloat(utils.$("#sun-lng").value);
      var d = new Date(dateInput.value + "T12:00:00");
      var t = sunTimes(lat, lng, d);
      var el = utils.$("#sun-result");
      if (t.polarDay) { el.innerHTML = row("Info", "Jour polaire (soleil permanent)"); return; }
      if (t.polarNight) { el.innerHTML = row("Info", "Nuit polaire (pas de lever)"); return; }
      var hm = function (dt) { return dt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); };
      var off = function (dt, min) { return new Date(dt.getTime() + min * 60000); };
      el.innerHTML =
        row("Heure bleue (matin)", hm(off(t.sunrise, -30)) + " – " + hm(t.sunrise)) +
        row("Lever du soleil", hm(t.sunrise)) +
        row("Golden hour (matin)", hm(t.sunrise) + " – " + hm(off(t.sunrise, 60))) +
        row("Golden hour (soir)", hm(off(t.sunset, -60)) + " – " + hm(t.sunset)) +
        row("Coucher du soleil", hm(t.sunset)) +
        row("Heure bleue (soir)", hm(t.sunset) + " – " + hm(off(t.sunset, 30)));
    });
    utils.$("#sun-calc").click();
  }

  function row(k, v) {
    return '<div class="media-info__row"><span>' + k + "</span><strong>" + utils.escapeHtml(String(v)) + "</strong></div>";
  }
  function deg(rad) { return (rad * 180) / Math.PI; }
  function bind(sels, fn) { sels.forEach(function (s) { utils.$(s).addEventListener("input", fn); }); }
  function nearestShutter(d) {
    var std = [24, 30, 40, 48, 50, 60, 100, 120, 200, 240, 250, 500];
    return std.reduce(function (a, b) { return Math.abs(b - d) < Math.abs(a - d) ? b : a; });
  }
  function ndName(stops) {
    var map = { 1: "ND2", 2: "ND4", 3: "ND8", 4: "ND16", 5: "ND32", 6: "ND64", 7: "ND128", 8: "ND256", 9: "ND512", 10: "ND1000" };
    return map[stops] || ("ND ~" + Math.pow(2, stops).toFixed(0));
  }

  // Équation du lever/coucher du soleil (approx. NOAA simplifiée)
  function sunTimes(lat, lng, date) {
    var rad = Math.PI / 180;
    var jd = date.getTime() / 86400000 + 2440587.5;
    var n = Math.round(jd - 2451545.0 + 0.0008);
    var Jstar = n - lng / 360;
    var M = (357.5291 + 0.98560028 * Jstar) % 360;
    var C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad);
    var lambda = (M + C + 180 + 102.9372) % 360;
    var Jtransit = 2451545.0 + Jstar + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * lambda * rad);
    var delta = Math.asin(Math.sin(lambda * rad) * Math.sin(23.44 * rad)) / rad;
    var cosO = (Math.sin(-0.833 * rad) - Math.sin(lat * rad) * Math.sin(delta * rad)) / (Math.cos(lat * rad) * Math.cos(delta * rad));
    if (cosO > 1) return { polarNight: true };
    if (cosO < -1) return { polarDay: true };
    var omega = Math.acos(cosO) / rad;
    var Jrise = Jtransit - omega / 360;
    var Jset = Jtransit + omega / 360;
    return {
      sunrise: new Date((Jrise - 2440587.5) * 86400000),
      sunset: new Date((Jset - 2440587.5) * 86400000),
    };
  }

  /* ---------------- CAMÉRA ---------------- */
  function initCamera() {
    var spec = MH.cameraSpec;
    var specEl = utils.$("#camera-spec");
    if (spec) {
      var html = "<h3><i class='fas fa-camera'></i> " + utils.escapeHtml(spec.name) + "</h3>";
      spec.sections.forEach(function (sec) {
        html += '<div class="spec-block"><h4 class="spec-sub">' + utils.escapeHtml(sec.h) + "</h4><div class='media-info'>";
        sec.rows.forEach(function (r) { html += row(r[0], r[1]); });
        html += "</div></div>";
      });
      specEl.innerHTML = html;
    }
    var presetsEl = utils.$("#camera-presets");
    (MH.cameraPresets || []).forEach(function (p) {
      var card = document.createElement("div");
      card.className = "card";
      var rows = p.settings.map(function (s) { return row(s[0], s[1]); }).join("");
      card.innerHTML =
        "<h3><i class='fas " + p.icon + "'></i> " + utils.escapeHtml(p.situation) + "</h3>" +
        "<div class='media-info'>" + rows + "</div>" +
        "<p class='card-hint' style='margin-top:12px'>" + utils.escapeHtml(p.note) + "</p>";
      presetsEl.appendChild(card);
    });
  }

  /* ---------------- CLAP ---------------- */
  function initSlate() {
    var fields = ["prod", "date", "scene", "shot", "take", "dir", "fps"];
    var saved = lsGet("mh:slate", null);
    if (!saved) saved = { date: new Date().toLocaleDateString("fr-FR"), scene: "1", shot: "1", take: "1", fps: "25" };

    fields.forEach(function (f) {
      var el = utils.$("#slate-" + f);
      if (saved[f] != null) el.value = saved[f];
      el.addEventListener("input", persist);
    });
    function persist() {
      var o = {}; fields.forEach(function (f) { o[f] = utils.$("#slate-" + f).value; });
      lsSet("mh:slate", o);
    }
    function bump(id, resetTake) {
      var el = utils.$("#slate-" + id);
      el.value = (parseInt(el.value, 10) || 0) + 1;
      if (resetTake) utils.$("#slate-take").value = "1";
      persist();
    }
    utils.$("#slate-take-plus").addEventListener("click", function () { bump("take", false); });
    utils.$("#slate-shot-plus").addEventListener("click", function () { bump("shot", true); });
    utils.$("#slate-scene-plus").addEventListener("click", function () { bump("scene", true); });
  }
})(window.MH = window.MH || {});
