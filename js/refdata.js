/* =========================================================
   DONNÉES DE RÉFÉRENCE (multi-logiciels)
   Raccourcis clavier · Snippets de scripting · Specs & codecs
   Facilement extensible : ajoute des entrées aux tableaux.
   ========================================================= */
(function (MH) {
  "use strict";

  /* --- Raccourcis clavier (configurations par défaut) --- */
  MH.shortcuts = {
    "After Effects": [
      { action: "Nouvelle composition", keys: "Ctrl + N" },
      { action: "Précomposer les calques", keys: "Ctrl + Shift + C" },
      { action: "Découper le calque à la tête de lecture", keys: "Ctrl + Shift + D" },
      { action: "Dupliquer", keys: "Ctrl + D" },
      { action: "Position / Rotation / Échelle / Opacité", keys: "P / R / S / T" },
      { action: "Afficher les keyframes du calque", keys: "U" },
      { action: "Afficher les propriétés modifiées", keys: "UU" },
      { action: "Easy Ease sur les clés", keys: "F9" },
      { action: "Éditeur d'expression", keys: "Alt + clic sur le chrono" },
      { action: "Prévisualisation RAM", keys: "Barre d'espace / 0 (pavé num.)" },
      { action: "Définir zone de travail (début/fin)", keys: "B / N" },
      { action: "Rogner comp à la zone de travail", keys: "Ctrl + Shift + X" },
      { action: "Aller au début / à la fin", keys: "Début / Fin" },
      { action: "Zoom timeline avant / arrière", keys: "= / -" },
    ],
    "Premiere Pro": [
      { action: "Outil Sélection", keys: "V" },
      { action: "Outil Rasoir (couper)", keys: "C" },
      { action: "Ajouter une coupe à la tête de lecture", keys: "Ctrl + K" },
      { action: "Supprimer avec ripple", keys: "Maj + Suppr" },
      { action: "Marquer entrée / sortie", keys: "I / O" },
      { action: "Insérer / Recouvrir", keys: ", / ." },
      { action: "Lecture / Pause", keys: "Barre d'espace" },
      { action: "Vitesse / Durée du clip", keys: "Ctrl + R" },
      { action: "Exporter (Media Encoder)", keys: "Ctrl + M" },
      { action: "Zoom timeline avant / arrière", keys: "= / -" },
      { action: "Enregistrer", keys: "Ctrl + S" },
    ],
    "DaVinci Resolve": [
      { action: "Lecture / Pause", keys: "Barre d'espace" },
      { action: "Lecture arrière / stop / avant (JKL)", keys: "J / K / L" },
      { action: "Marquer entrée / sortie", keys: "I / O" },
      { action: "Lame (couper le clip)", keys: "Ctrl + B" },
      { action: "Mode Sélection / Lame", keys: "A / B" },
      { action: "Supprimer (ripple)", keys: "Retour arrière" },
      { action: "Plein écran visionneuse", keys: "Ctrl + F" },
      { action: "Ajouter un nœud série (Color)", keys: "Alt + S" },
      { action: "Page Cut / Edit / Color", keys: "Maj + 3 / 4 / 6" },
      { action: "Annuler / Rétablir", keys: "Ctrl + Z / Ctrl + Maj + Z" },
    ],
    Blender: [
      { action: "Déplacer / Rotation / Échelle", keys: "G / R / S" },
      { action: "Contraindre à un axe", keys: "G puis X / Y / Z" },
      { action: "Basculer Objet / Édition", keys: "Tab" },
      { action: "Ajouter un objet", keys: "Maj + A" },
      { action: "Dupliquer", keys: "Maj + D" },
      { action: "Extruder (mode édition)", keys: "E" },
      { action: "Insérer un keyframe", keys: "I" },
      { action: "Rendu image / animation", keys: "F12 / Ctrl + F12" },
      { action: "Vue caméra", keys: "Pavé num. 0" },
      { action: "Cadrer la sélection", keys: "Pavé num. ." },
      { action: "Recherche d'opérateur", keys: "F3" },
      { action: "Plein écran de la zone", keys: "Ctrl + Barre d'espace" },
    ],
    "Cinema 4D": [
      { action: "Déplacer / Rotation / Échelle", keys: "E / R / T" },
      { action: "Rendre la vue", keys: "Ctrl + R" },
      { action: "Rendre dans la Picture Viewer", keys: "Maj + R" },
      { action: "Cadrer la sélection", keys: "S / O" },
      { action: "Lecture de l'animation", keys: "F8" },
      { action: "Nouveau document", keys: "Ctrl + N" },
      { action: "Annuler", keys: "Ctrl + Z" },
    ],
  };

  /* --- Snippets de scripting (schéma identique aux expressions) --- */
  MH.snippets = [
    {
      id: "bl_render_settings",
      title: "Régler la sortie de rendu",
      category: "Blender",
      desc: "Configure par script la résolution, le fps, le format et le chemin de sortie d'un rendu Blender.",
      where: "Éditeur de script (onglet Scripting) ou console Python de Blender.",
      how: "Exécute dans Blender. Adapte les valeurs à ton projet, puis lance le rendu (F12 ou bpy.ops.render.render).",
      params: [
        { name: "resolution_x/y", desc: "Dimensions en pixels." },
        { name: "fps", desc: "Images par seconde." },
        { name: "file_format", desc: "PNG, OPEN_EXR, FFMPEG, etc." },
      ],
      code: [
        "import bpy",
        "scene = bpy.context.scene",
        "scene.render.resolution_x = 1920",
        "scene.render.resolution_y = 1080",
        "scene.render.fps = 25",
        "scene.render.image_settings.file_format = 'PNG'",
        "scene.render.filepath = '//renders/frame_'",
      ].join("\n"),
    },
    {
      id: "bl_driver",
      title: "Driver (expression) simple",
      category: "Blender",
      desc: "Les drivers sont l'équivalent Blender des expressions AE : ils pilotent une propriété par une formule. Ex : faire tourner une roue selon un déplacement.",
      where: "Clic droit sur une propriété → « Add Driver », puis dans l'éditeur de drivers.",
      how: "Ajoute un driver, choisis le type « Scripted Expression », crée une variable 'var' pointant vers la propriété source, puis écris la formule.",
      params: [{ name: "var", desc: "La variable liée à une propriété source (à définir dans le driver)." }],
      code: "# Expression du driver (champ Expression) :\nvar * 2\n\n# Exemple roue : rotation = position_x / rayon\nvar / 0.5",
    },
    {
      id: "bl_img_sequence",
      title: "Importer une séquence d'images",
      category: "Blender",
      desc: "Charge une séquence d'images numérotées comme un plan image dans la scène.",
      where: "Éditeur de script Blender.",
      how: "Renseigne le chemin du 1er fichier ; Blender détecte la séquence.",
      params: [{ name: "filepath", desc: "Chemin de la première image de la séquence." }],
      code: [
        "import bpy",
        "img = bpy.data.images.load('//seq/frame_0001.png')",
        "img.source = 'SEQUENCE'",
        "print('Séquence chargée :', img.name)",
      ].join("\n"),
    },
    {
      id: "dr_connect",
      title: "Se connecter au projet courant",
      category: "DaVinci Resolve",
      desc: "Point d'entrée de tout script Resolve : récupère l'application, le projet et la timeline actifs.",
      where: "Console (Workspace → Console) ou script dans le dossier Scripts de Resolve.",
      how: "Base de tous les autres scripts Resolve. resolve est fourni automatiquement dans la console.",
      params: [],
      code: [
        "resolve = app.GetResolve()",
        "pm = resolve.GetProjectManager()",
        "project = pm.GetCurrentProject()",
        "timeline = project.GetCurrentTimeline()",
        "print('Projet :', project.GetName())",
      ].join("\n"),
    },
    {
      id: "dr_markers",
      title: "Ajouter des marqueurs sur la timeline",
      category: "DaVinci Resolve",
      desc: "Place des marqueurs colorés à des images précises de la timeline (repères de montage, notes client).",
      where: "Script Resolve (après connexion au projet).",
      how: "frameId est en images depuis le début. Change la couleur et le texte selon le besoin.",
      params: [
        { name: "frameId", desc: "Position du marqueur, en images." },
        { name: "color", desc: "Blue, Red, Green, Yellow, etc." },
      ],
      code: [
        "timeline = project.GetCurrentTimeline()",
        "timeline.AddMarker(100, 'Blue', 'Intro', 'Note ici', 1)",
        "timeline.AddMarker(250, 'Red', 'Coupe', '', 1)",
      ].join("\n"),
    },
    {
      id: "dr_render",
      title: "Ajouter à la file de rendu et lancer",
      category: "DaVinci Resolve",
      desc: "Automatise l'export : applique un preset de rendu, ajoute le job et démarre l'encodage.",
      where: "Script Resolve.",
      how: "Le preset doit exister dans la page Deliver. Adapte le dossier et le nom de sortie.",
      params: [
        { name: "TargetDir", desc: "Dossier de sortie." },
        { name: "CustomName", desc: "Nom du fichier exporté." },
      ],
      code: [
        "project.LoadRenderPreset('YouTube 1080p')",
        "project.SetRenderSettings({'TargetDir': 'D:/Exports', 'CustomName': 'export_v1'})",
        "job = project.AddRenderJob()",
        "project.StartRendering(job)",
      ].join("\n"),
    },
    {
      id: "c4d_iterate",
      title: "Parcourir tous les objets de la scène",
      category: "Cinema 4D",
      desc: "Boucle sur toute la hiérarchie de la scène : base de tout script d'automatisation C4D.",
      where: "Script Manager (Extensions → Script Manager) en Python.",
      how: "Exécute pour lister ou modifier les objets. Décommente pour aller dans les enfants.",
      params: [],
      code: [
        "import c4d",
        "def main():",
        "    obj = doc.GetFirstObject()",
        "    while obj:",
        "        print(obj.GetName())",
        "        obj = obj.GetNext()",
        "",
        "main()",
      ].join("\n"),
    },
    {
      id: "c4d_create",
      title: "Créer un objet et l'ajouter",
      category: "Cinema 4D",
      desc: "Génère un objet (ici un cube) et l'insère dans la scène par script.",
      where: "Script Manager Python de C4D.",
      how: "Change c4d.Ocube par un autre ID d'objet (Osphere, Ocone…). N'oublie pas EventAdd() pour rafraîchir.",
      params: [{ name: "c4d.Ocube", desc: "Type de l'objet à créer." }],
      code: [
        "import c4d",
        "def main():",
        "    cube = c4d.BaseObject(c4d.Ocube)",
        "    cube.SetName('MonCube')",
        "    doc.InsertObject(cube)",
        "    c4d.EventAdd()",
        "",
        "main()",
      ].join("\n"),
    },
  ];

  /* --- Specs de livraison & codecs --- */
  MH.deliverySpecs = [
    { platform: "YouTube 1080p", res: "1920 × 1080", fps: "24–60", codec: "H.264 High", container: "MP4", bitrate: "8–12 Mb/s" },
    { platform: "YouTube 4K", res: "3840 × 2160", fps: "24–60", codec: "H.264 / HEVC", container: "MP4", bitrate: "35–68 Mb/s" },
    { platform: "Instagram Feed", res: "1080 × 1350", fps: "30", codec: "H.264", container: "MP4", bitrate: "5–8 Mb/s" },
    { platform: "Reels / TikTok", res: "1080 × 1920", fps: "30–60", codec: "H.264", container: "MP4", bitrate: "6–10 Mb/s" },
    { platform: "Master ProRes", res: "selon source", fps: "source", codec: "ProRes 422 HQ", container: "MOV", bitrate: "~176 Mb/s (1080p)" },
    { platform: "Livraison Broadcast", res: "1920 × 1080", fps: "25 (PAL)", codec: "XDCAM / DNxHD", container: "MXF / MOV", bitrate: "50–185 Mb/s" },
  ];

  MH.codecTable = [
    { name: "H.264 / AVC", usage: "Diffusion web, livraison légère", editFriendly: "Moyen", weight: "Faible" },
    { name: "H.265 / HEVC", usage: "4K/HDR, poids réduit", editFriendly: "Faible", weight: "Très faible" },
    { name: "ProRes 422 HQ", usage: "Master, montage, VFX", editFriendly: "Excellent", weight: "Élevé" },
    { name: "ProRes 4444", usage: "Master + alpha (transparence)", editFriendly: "Excellent", weight: "Très élevé" },
    { name: "DNxHR / DNxHD", usage: "Montage Avid / Resolve", editFriendly: "Excellent", weight: "Élevé" },
    { name: "Séquence PNG/EXR", usage: "Rendus 3D, compositing", editFriendly: "Excellent", weight: "Très élevé" },
  ];

  MH.colorSpaces = [
    { name: "Rec.709", usage: "Standard HD / SDR — la référence pour la plupart des livraisons vidéo." },
    { name: "sRGB", usage: "Web, graphisme, écrans — proche de Rec.709 mais gamma différent." },
    { name: "Rec.2020", usage: "UHD / HDR — large gamut pour la 4K haut de gamme." },
    { name: "DCI-P3", usage: "Cinéma numérique et écrans Apple." },
    { name: "ACES", usage: "Pipeline VFX/étalonnage neutre, gamut très large pour le travail intermédiaire." },
  ];

  MH.resolutions = [
    { name: "SD", dims: "720 × 576" },
    { name: "HD", dims: "1280 × 720" },
    { name: "Full HD", dims: "1920 × 1080" },
    { name: "2K DCI", dims: "2048 × 1080" },
    { name: "UHD 4K", dims: "3840 × 2160" },
    { name: "4K DCI", dims: "4096 × 2160" },
    { name: "8K UHD", dims: "7680 × 4320" },
  ];
})(window.MH = window.MH || {});
