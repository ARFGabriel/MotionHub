/* =========================================================
   DONNÉES DE TOURNAGE
   Fiche caméra, presets de réglages, matériel par défaut,
   modes d'enregistrement (débits) pour l'autonomie carte.
   ========================================================= */
(function (MH) {
  "use strict";

  /* --- Fiche technique Sony FX3 --- */
  MH.cameraSpec = {
    name: "Sony FX3 (ILME-FX3)",
    sections: [
      {
        h: "Capteur",
        rows: [
          ["Type", "Plein format (35 mm) rétroéclairé Exmor R"],
          ["Définition", "~10,2 Mpx (vidéo) / 12,1 Mpx (photo)"],
          ["Cercle de confusion (PdC)", "≈ 0,030 mm"],
          ["Monture", "Sony E"],
        ],
      },
      {
        h: "Vidéo",
        rows: [
          ["4K (QFHD)", "jusqu'à 120p"],
          ["Full HD", "jusqu'à 240p"],
          ["Échantillonnage", "4:2:2 10 bits (interne)"],
          ["Codecs", "XAVC S, XAVC S-I, XAVC HS"],
          ["RAW", "16 bits en sortie HDMI (enregistreur externe)"],
        ],
      },
      {
        h: "Sensibilité & profils",
        rows: [
          ["Dual Base ISO (S-Log3)", "800 et 12 800"],
          ["Plage ISO", "80 – 102 400 (extensible)"],
          ["Profils", "S-Log3, S-Cinetone, HLG, Rec.709"],
          ["Gamut", "S-Gamut3 / S-Gamut3.Cine"],
        ],
      },
      {
        h: "Divers",
        rows: [
          ["Stabilisation", "IBIS 5 axes + Active"],
          ["Refroidissement", "Ventilateur intégré (tournage long)"],
          ["Audio", "Griffe multi-interface numérique (XLR via poignée)"],
          ["Stockage", "2 slots CFexpress Type A / SD UHS-II"],
        ],
      },
    ],
  };

  /* --- Presets de réglages par situation --- */
  MH.cameraPresets = [
    {
      situation: "Interview",
      icon: "fa-comments",
      settings: [
        ["Résolution / FPS", "4K 25p"],
        ["Obturation", "1/50"],
        ["Profil", "S-Log3 (LUT de monitoring)"],
        ["ISO", "800 (base)"],
        ["Ouverture", "f/2.8 – f/4"],
        ["Mise au point", "AF Visage/Œil + suivi"],
      ],
      note: "Sujet détaché du fond, lumière douce à 45°. Cravate ou canon sur perche.",
    },
    {
      situation: "Gimbal / Run & Gun",
      icon: "fa-person-running",
      settings: [
        ["Résolution / FPS", "4K 25p (ou 50p)"],
        ["Obturation", "1/50 (1/100 en 50p)"],
        ["Profil", "S-Cinetone (rapide) ou S-Log3"],
        ["ISO", "Auto plafonné ou base 800"],
        ["Stabilisation", "Active (ou off si gimbal)"],
        ["Mise au point", "AF continu, vitesse modérée"],
      ],
      note: "S-Cinetone évite l'étalonnage si le temps manque. Filtre ND variable conseillé.",
    },
    {
      situation: "Basse lumière",
      icon: "fa-moon",
      settings: [
        ["Résolution / FPS", "4K 25p"],
        ["Obturation", "1/50"],
        ["Profil", "S-Log3"],
        ["ISO", "12 800 (2e base ISO)"],
        ["Ouverture", "la plus grande (f/1.4 – f/2)"],
        ["Réduction bruit", "en post (Neat/Resolve)"],
      ],
      note: "La 2e base ISO (12 800) est plus propre que de pousser depuis 800.",
    },
    {
      situation: "Ralenti (slow-mo)",
      icon: "fa-gauge-high",
      settings: [
        ["Résolution / FPS", "4K 120p (ou FHD 240p)"],
        ["Obturation", "1/240 (2×120)"],
        ["Profil", "S-Log3 ou S-Cinetone"],
        ["ISO", "monte vite → prévoir de la lumière"],
        ["Timeline", "monter en 24/25p pour le ralenti"],
      ],
      note: "Le 120p demande beaucoup de lumière (obturation rapide). Idéal en extérieur.",
    },
  ];

  /* --- Modes d'enregistrement (débits approx.) pour l'autonomie carte --- */
  MH.recordModes = [
    { label: "XAVC S 4K 25p (100 Mb/s)", mbps: 100 },
    { label: "XAVC S 4K 25p (150 Mb/s)", mbps: 150 },
    { label: "XAVC S-I 4K 25p (~500 Mb/s)", mbps: 500 },
    { label: "XAVC S 4K 120p (280 Mb/s)", mbps: 280 },
    { label: "XAVC S-I 4K 120p (~1200 Mb/s)", mbps: 1200 },
    { label: "XAVC S HD 25p (50 Mb/s)", mbps: 50 },
  ];

  /* --- Matériel par défaut (checklist) --- */
  MH.gearDefault = [
    { cat: "Caméra & optiques", items: ["Boîtier", "Objectif(s)", "Batteries chargées", "Filtres ND", "Pare-soleil", "Chiffon microfibre"] },
    { cat: "Stockage", items: ["Cartes mémoire (formatées)", "Lecteur de cartes", "Disque de sauvegarde"] },
    { cat: "Énergie", items: ["Chargeur", "Batteries de rechange", "Powerbank / secteur"] },
    { cat: "Son", items: ["Micro (canon / cravate)", "Enregistreur", "Casque", "Bonnette anti-vent", "Piles micro"] },
    { cat: "Support & stabilisation", items: ["Trépied", "Gimbal (chargé)", "Rotule fluide", "Épaule / cage"] },
    { cat: "Lumière", items: ["Projecteur LED", "Réflecteur", "Diffuseur", "Pieds d'éclairage", "Gels"] },
    { cat: "Divers", items: ["Clap / ardoise", "Gaffer", "Multiprise / rallonge", "Sacs & protections", "Autorisations / repérages"] },
  ];

  /* --- Options pour les calculatrices --- */
  MH.shootLighting = [
    { label: "Plein soleil", ev: 15 },
    { label: "Soleil voilé", ev: 14 },
    { label: "Nuageux clair", ev: 13 },
    { label: "Couvert", ev: 12 },
    { label: "Ombre / crépuscule", ev: 11 },
    { label: "Intérieur lumineux", ev: 9 },
  ];
})(window.MH = window.MH || {});
