/* =========================================================
   GÉNÉRATEUR D'ARBORESCENCE DE PROJET (desktop)
   Crée en un clic tous les dossiers d'une production à partir
   d'un modèle. Structure éditable (indentation = sous-dossier).
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var desktop = typeof window.motionHub !== "undefined" && window.motionHub.isDesktop;
  var parentPath = null;

  MH.scaffold = { init: init };

  var TEMPLATES = {
    "Montage vidéo":
      "01_RUSHES\n  A_CAM\n  B_CAM\n  DRONE\n02_AUDIO\n  MUSIQUE\n  VOIX\n  SFX\n" +
      "03_PROJET\n  AE\n  PREMIERE\n  RESOLVE\n04_GRAPHISME\n  LOGOS\n  TITRAGE\n" +
      "05_EXPORTS\n  PROXYS\n  MASTERS\n  LIVRAISON\n06_DOCS",
    "Tournage":
      "01_PREPRODUCTION\n  SCENARIO\n  STORYBOARD\n  DECOUPAGE\n  REPERAGES\n  PLANNING\n" +
      "02_RUSHES\n  JOUR_01\n  JOUR_02\n03_SON\n04_PHOTOS\n05_PROJET\n06_EXPORTS\n" +
      "07_ADMIN\n  DEVIS\n  CONTRATS",
    "Motion design":
      "01_BRIEF\n02_ASSETS\n  AI\n  PSD\n  3D\n  FOOTAGE\n  FONTS\n" +
      "03_PROJET\n  AE\n  C4D\n  BLENDER\n04_RENDERS\n  PREVIEW\n  FINAL\n05_EXPORTS\n06_DOCS",
    "Photo":
      "01_IMPORT\n  RAW\n  JPEG\n02_SELECTION\n03_RETOUCHE\n  PSD\n  LIGHTROOM\n" +
      "04_EXPORTS\n  WEB\n  PRINT\n05_LIVRAISON",
    "Vierge": "01_\n02_\n03_",
  };

  function parseStructure(text) {
    var lines = (text || "").split(/\r?\n/);
    var paths = [];
    var stack = [];
    lines.forEach(function (raw) {
      if (!raw.trim()) return;
      var m = raw.match(/^(\s*)(.*)$/);
      var indent = m[1].replace(/\t/g, "  ").length;
      var level = Math.floor(indent / 2);
      var name = m[2].trim().replace(/[\/\\]/g, "");
      if (!name) return;
      stack = stack.slice(0, level);
      stack[level] = name;
      paths.push(stack.slice(0, level + 1).join("/"));
    });
    return paths;
  }

  function updateCount() {
    var n = parseStructure(utils.$("#scaffold-struct").value).length;
    utils.$("#scaffold-count").textContent = n + " dossier" + (n > 1 ? "s" : "") + " à créer";
  }

  function init() {
    var struct = utils.$("#scaffold-struct");
    if (!struct) return;

    // Chips de modèles
    var tplBar = utils.$("#scaffold-templates");
    var names = Object.keys(TEMPLATES);
    tplBar.innerHTML = "";
    names.forEach(function (name, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "exp-filter-btn" + (i === 0 ? " active" : "");
      btn.textContent = name;
      btn.addEventListener("click", function () {
        struct.value = TEMPLATES[name];
        utils.$$(".exp-filter-btn", tplBar).forEach(function (b) { b.classList.toggle("active", b === btn); });
        updateCount();
      });
      tplBar.appendChild(btn);
    });
    struct.value = TEMPLATES[names[0]];
    updateCount();
    struct.addEventListener("input", updateCount);

    // Création = desktop uniquement
    if (!desktop) {
      utils.$("#scaffold-web").hidden = false;
      utils.$("#scaffold-parent").disabled = true;
      utils.$("#scaffold-create").disabled = true;
      return;
    }

    utils.$("#scaffold-parent").addEventListener("click", function () {
      window.motionHub.pickFolder().then(function (folder) {
        if (!folder) return;
        parentPath = folder;
        utils.$("#scaffold-parent-path").textContent = folder;
      });
    });

    utils.$("#scaffold-create").addEventListener("click", function () {
      var name = utils.$("#scaffold-name").value.trim();
      if (!name) { utils.toast("Donne un nom de projet.", "warn"); return; }
      if (!parentPath) { utils.toast("Choisis le dossier parent.", "warn"); return; }
      var folders = parseStructure(struct.value);
      var btn = utils.$("#scaffold-create");
      btn.disabled = true;
      window.motionHub.projects.scaffold(parentPath, name, folders)
        .then(function (res) {
          btn.disabled = false;
          utils.toast(res.created + " dossiers créés.", "success");
          if (MH.activity) MH.activity.log({ type: "Arborescence", label: name, output: res.root });
          if (window.confirm("Arborescence créée dans :\n" + res.root + "\n\nOuvrir le dossier ?")) {
            window.motionHub.shell.open(res.root);
          }
        })
        .catch(function (err) {
          btn.disabled = false;
          utils.toast("Erreur : " + err.message, "error");
        });
    });
  }
})(window.MH = window.MH || {});
