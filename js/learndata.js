/* =========================================================
   BIBLIOTHÈQUE DE CONNAISSANCES (« Apprendre »)
   Contenu data-driven, facilement extensible.
   Bloc article : { h } titre, { p } paragraphe, { ul } liste,
   { tip } encadré conseil.
   ========================================================= */
(function (MH) {
  "use strict";

  MH.learnCategories = [
    { id: "photo", label: "Photographie", icon: "fa-camera" },
    { id: "tournage", label: "Vidéo & prise de vue", icon: "fa-video" },
    { id: "materiel", label: "Matériel", icon: "fa-screwdriver-wrench" },
    { id: "son", label: "Son", icon: "fa-microphone" },
    { id: "lumiere", label: "Lumière", icon: "fa-lightbulb" },
    { id: "realisation", label: "Réalisation", icon: "fa-clapperboard" },
    { id: "cadrage", label: "Cadrage", icon: "fa-crop-simple" },
    { id: "montage", label: "Montage", icon: "fa-scissors" },
    { id: "etalonnage", label: "Étalonnage", icon: "fa-palette" },
    { id: "vfx", label: "VFX & compositing", icon: "fa-wand-magic-sparkles" },
    { id: "motion", label: "Motion design", icon: "fa-bezier-curve" },
    { id: "logiciels", label: "Logiciels", icon: "fa-desktop" },
    { id: "livraison", label: "Livraison", icon: "fa-truck-fast" },
  ];

  MH.learnArticles = [
    /* ===================== PHOTOGRAPHIE ===================== */
    {
      id: "expo-triangle",
      category: "photo",
      title: "Le triangle d'exposition",
      summary: "ISO, ouverture et vitesse : les trois réglages qui déterminent la luminosité et le rendu.",
      body: [
        { p: "L'exposition d'une image dépend de trois réglages liés. Modifier l'un oblige souvent à compenser avec un autre pour garder la même luminosité." },
        { h: "Ouverture (f/)" },
        { p: "Mesurée en f/ (f/1.8, f/5.6, f/16…). Plus le chiffre est petit, plus l'ouverture est grande : plus de lumière entre et la profondeur de champ est faible (arrière-plan flou). Plus le chiffre est grand, plus l'image est nette de près comme de loin." },
        { h: "Vitesse d'obturation" },
        { p: "Durée pendant laquelle le capteur reçoit la lumière (1/1000 s, 1/50 s, 1 s…). Rapide = fige le mouvement ; lente = filé de mouvement et risque de flou de bougé." },
        { h: "ISO (sensibilité)" },
        { p: "Amplifie le signal du capteur. ISO bas (100–800) = image propre ; ISO élevé = plus lumineux mais plus de bruit numérique." },
        { tip: "Règle de départ : privilégie l'ISO le plus bas possible, choisis l'ouverture selon le flou d'arrière-plan voulu, et ajuste la vitesse en dernier (en vidéo, la vitesse est contrainte par la règle du 180°)." },
      ],
    },
    {
      id: "profondeur-champ",
      category: "photo",
      title: "La profondeur de champ",
      summary: "Ce qui rend l'arrière-plan flou ou net, et comment la contrôler.",
      body: [
        { p: "La profondeur de champ (PdC) est la zone de netteté autour du point de mise au point. Une PdC faible isole le sujet ; une PdC large garde toute la scène nette." },
        { h: "Ce qui réduit la profondeur de champ (plus de flou)" },
        { ul: ["Grande ouverture (petit f/, ex. f/1.4)", "Longue focale (85 mm, 135 mm…)", "Sujet proche de l'objectif", "Grand capteur (le plein format de la FX3 donne plus de flou qu'un APS-C à cadrage égal)"] },
        { h: "Ce qui l'augmente (plus de netteté partout)" },
        { ul: ["Petite ouverture (grand f/, ex. f/11)", "Focale courte (grand-angle)", "Sujet éloigné"] },
        { tip: "Pour un portrait cinéma : 50–85 mm à f/1.8–f/2.8. Pour un paysage net partout : f/8–f/11." },
      ],
    },
    {
      id: "focales",
      category: "photo",
      title: "Focales et angles de champ",
      summary: "Grand-angle, standard, téléobjectif : ce que change la focale sur le cadrage et la perception.",
      body: [
        { p: "La focale (en mm) détermine l'angle de champ et la façon dont les distances sont perçues. Les valeurs ci-dessous sont pour un capteur plein format (24×36), comme la FX3." },
        { ul: [
          "14–24 mm (ultra grand-angle) : très large, accentue les perspectives, utile en paysage et intérieur exigu.",
          "35 mm : reportage, plans immersifs proches du regard humain.",
          "50 mm : « standard », rendu naturel, polyvalent.",
          "85 mm : portrait, joli flou, compression légère des traits.",
          "135 mm et + (télé) : compresse l'arrière-plan, isole le sujet à distance.",
        ] },
        { h: "Compression et distorsion" },
        { p: "Un grand-angle éloigne visuellement les plans et peut déformer les visages de près. Un téléobjectif rapproche les plans (effet de compression) et aplatit la perspective." },
        { tip: "Sur APS-C, multiplie la focale par ~1,5 pour connaître l'équivalent plein format (un 35 mm cadre comme un ~50 mm)." },
      ],
    },
    {
      id: "composition",
      category: "photo",
      title: "Les bases de la composition",
      summary: "Règle des tiers, lignes directrices, équilibre : structurer le regard.",
      body: [
        { h: "Règle des tiers" },
        { p: "Divise l'image en 3×3. Place les éléments importants sur les lignes ou leurs intersections plutôt qu'au centre : le cadrage respire et guide l'œil." },
        { h: "Lignes directrices" },
        { p: "Routes, rambardes, ombres… ces lignes conduisent naturellement le regard vers le sujet." },
        { h: "Espace négatif & air de tête" },
        { p: "Laisse de l'espace dans la direction du regard ou du mouvement du sujet. En portrait, garde un peu d'« air » au-dessus de la tête, mais pas trop." },
        { h: "Premier plan / arrière-plan" },
        { p: "Ajouter un élément au premier plan crée de la profondeur et une composition en couches." },
        { tip: "Ces règles se transgressent : un cadrage centré et symétrique peut être très fort. Connais-les pour mieux choisir quand les casser." },
      ],
    },
    {
      id: "raw-histogramme",
      category: "photo",
      title: "RAW, JPEG et histogramme",
      summary: "Pourquoi shooter en RAW et comment lire l'exposition avec l'histogramme.",
      body: [
        { h: "RAW vs JPEG" },
        { p: "Le RAW enregistre toutes les données du capteur : énorme latitude en post (récupération des hautes lumières/ombres, balance des blancs libre). Le JPEG est compressé et « développé » par l'appareil : plus léger, mais peu de marge de retouche." },
        { h: "L'histogramme" },
        { p: "Graphe de répartition des tons, des ombres (gauche) aux hautes lumières (droite). Il est plus fiable que l'écran pour juger l'exposition." },
        { ul: [
          "Pic collé à gauche : image sous-exposée, ombres bouchées.",
          "Pic collé à droite : hautes lumières « cramées » (irrécupérables).",
          "Répartition étalée sans écrêtage : exposition saine.",
        ] },
        { tip: "En photo, exposer « à droite » (ETTR) sans cramer maximise le rapport signal/bruit. Tu rabaisses ensuite en post." },
      ],
    },

    /* ===================== VIDÉO / PRISE DE VUE ===================== */
    {
      id: "framerates",
      category: "tournage",
      title: "Les framerates (images/seconde)",
      summary: "24, 25, 30, 50, 60, 120 fps : lequel choisir et pourquoi.",
      body: [
        { ul: [
          "24 fps : le standard cinéma, rendu « filmique ».",
          "25 fps : standard TV/PAL (Europe). Souvent utilisé en France pour éviter le scintillement sous éclairage 50 Hz.",
          "30 fps : standard NTSC, réseaux sociaux.",
          "50 / 60 fps : mouvement très fluide, ou pour un ralenti ×2 monté en 25/30.",
          "120 fps : ralenti marqué (×5 en 24 fps). La FX3 fait du 4K120.",
        ] },
        { h: "Ralenti (slow motion)" },
        { p: "Tourne à un framerate élevé et monte dans une timeline à framerate bas : 60 fps interprété en 24 fps donne un ralenti fluide à 40 % de vitesse." },
        { tip: "Garde un framerate de projet cohérent. Choisis-le avant de tourner en fonction de la livraison finale." },
      ],
    },
    {
      id: "regle-180",
      category: "tournage",
      title: "La règle du 180° (vitesse d'obturation)",
      summary: "Régler la vitesse pour un flou de mouvement naturel en vidéo.",
      body: [
        { p: "En vidéo, la vitesse d'obturation contrôle le flou de mouvement, essentiel au rendu naturel. La règle du 180° : vitesse ≈ 1 / (2 × framerate)." },
        { ul: [
          "24 fps → 1/48 s (souvent 1/50 sur les boîtiers)",
          "25 fps → 1/50 s",
          "30 fps → 1/60 s",
          "60 fps → 1/120 s",
        ] },
        { p: "Vitesse trop rapide (1/500) : mouvement saccadé, effet « Il faut sauver le soldat Ryan ». Trop lente : flou excessif." },
        { tip: "En plein soleil, garder 1/50 impose un filtre ND pour ne pas surexposer — voir le calculateur ND dans les outils de tournage." },
      ],
    },
    {
      id: "codecs-video",
      category: "tournage",
      title: "Résolutions, codecs et bitrate",
      summary: "4K, 6K, XAVC, ProRes, RAW : ce qu'ils changent au tournage.",
      body: [
        { h: "Résolution" },
        { p: "Tourner en 4K pour livrer en 1080p offre du recadrage et une image plus nette une fois réduite. La FX3 monte à 4K120." },
        { h: "Codecs d'acquisition" },
        { ul: [
          "XAVC S / HS (H.264/H.265) : fichiers légers, pratiques, mais compressés.",
          "XAVC S-I (Intra) : chaque image compressée indépendamment, plus robuste au montage.",
          "ProRes RAW (via enregistreur externe) : latitude maximale, fichiers lourds.",
        ] },
        { h: "Bitrate" },
        { p: "Plus le débit (Mb/s) est élevé, plus l'image conserve de détails, surtout dans les mouvements et dégradés — au prix de la taille." },
        { tip: "Pour du montage fluide sur une machine modeste, crée des proxys (outil Média de Slate) et remonte les fichiers d'origine à l'export." },
      ],
    },
    {
      id: "log-slog3",
      category: "tournage",
      title: "Les profils log (S-Log3)",
      summary: "Pourquoi filmer en log, et comment l'exposer correctement.",
      body: [
        { p: "Un profil log (S-Log3 sur Sony, C-Log, V-Log…) enregistre une plage dynamique très large en aplatissant l'image (délavée, peu contrastée). On retrouve contraste et couleurs à l'étalonnage : latitude maximale." },
        { h: "Dual base ISO (FX3)" },
        { p: "La FX3 a deux ISO natifs en S-Log3 : ~800 et ~12800. En basse lumière, monter à l'ISO natif haut donne une image plus propre que de pousser progressivement." },
        { h: "Exposer le log" },
        { p: "Le log se sous-expose facilement, ce qui fait ressortir le bruit dans les ombres. Beaucoup exposent volontairement « à droite » (+1 à +1,7 IL) puis ramènent en post." },
        { tip: "Charge une LUT de monitoring (S-Log3 → Rec.709) sur l'écran pour juger l'image pendant le tournage, tout en enregistrant le log." },
      ],
    },
    {
      id: "expo-outils",
      category: "tournage",
      title: "Outils d'exposition : zebras, waveform, false color",
      summary: "Juger l'exposition objectivement plutôt qu'à l'œil sur un écran.",
      body: [
        { h: "Zebras" },
        { p: "Hachures qui apparaissent sur les zones dépassant un seuil de luminosité. Réglés à ~94–100 %, elles alertent sur les hautes lumières cramées. Réglés à ~70 %, elles aident à exposer la peau." },
        { h: "Waveform" },
        { p: "Graphe de la luminance de gauche à droite de l'image (0 = noir, 100 = blanc). Idéal pour vérifier qu'on ne cogne ni le bas ni le haut." },
        { h: "False color" },
        { p: "Colore l'image selon les niveaux d'exposition (ex. peau claire ≈ vert/rose selon la charte). Le plus précis pour exposer la peau de façon constante." },
        { tip: "La peau caucasienne se situe souvent vers 55–70 % sur la waveform ; adapte selon le teint et l'intention." },
      ],
    },
    {
      id: "son-tournage",
      category: "tournage",
      title: "Le son au tournage",
      summary: "Niveaux, types de micros et bonnes pratiques d'enregistrement.",
      body: [
        { h: "Niveaux" },
        { p: "Vise des pics autour de -12 dB (dialogue), avec une marge sous 0 dB pour éviter la saturation (irrécupérable). Mieux vaut un peu bas et remonter en post." },
        { h: "Types de micros" },
        { ul: [
          "Canon (shotgun) : directionnel, sur perche ou caméra, capte de face.",
          "Cravate (lavalier) : proche de la bouche, discret, idéal interview.",
          "Enregistreur dédié : meilleure qualité que l'entrée caméra.",
        ] },
        { h: "Bonnes pratiques" },
        { ul: ["Rapproche le micro de la source (la distance tue le son)", "Enregistre 30 s d'ambiance (room tone) pour le montage", "Surveille au casque en permanence", "Coupe les sources de bruit (frigo, clim…)"] },
        { tip: "Le son médiocre se pardonne moins qu'une image imparfaite : soigne-le dès le tournage." },
      ],
    },

    /* ===================== LUMIÈRE ===================== */
    {
      id: "3-points",
      category: "lumiere",
      title: "L'éclairage 3 points",
      summary: "Key, fill et back light : la base de tout éclairage de sujet.",
      body: [
        { h: "Key light (lumière principale)" },
        { p: "Source dominante, placée à ~45° du sujet. Elle définit l'exposition et le modelé du visage." },
        { h: "Fill light (lumière d'appoint)" },
        { p: "Adoucit les ombres créées par la key, du côté opposé, à intensité plus faible. Le rapport key/fill contrôle le contraste (dramatique si fort, doux si faible)." },
        { h: "Back light (contre-jour)" },
        { p: "Placée derrière le sujet, elle dessine un liseré lumineux qui le détache de l'arrière-plan et ajoute de la profondeur." },
        { svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
            '<defs><marker id="l3arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--text-dim)"/></marker></defs>' +
            '<circle cx="200" cy="155" r="22" fill="none" stroke="var(--text-main)" stroke-width="2"/>' +
            '<circle cx="200" cy="155" r="8" fill="var(--text-main)"/>' +
            '<text x="200" y="195" fill="var(--text-dim)" font-size="12" text-anchor="middle">SUJET</text>' +
            '<rect x="186" y="258" width="28" height="18" rx="3" fill="none" stroke="var(--text-main)" stroke-width="2"/>' +
            '<path d="M214,262 l12,-6 v24 l-12,-6 z" fill="var(--text-main)"/>' +
            '<text x="200" y="292" fill="var(--text-dim)" font-size="11" text-anchor="middle">CAMERA</text>' +
            '<line x1="200" y1="258" x2="200" y2="180" stroke="var(--text-dim)" stroke-dasharray="3 3"/>' +
            '<circle cx="80" cy="80" r="13" fill="var(--primary)"/>' +
            '<line x1="92" y1="92" x2="182" y2="142" stroke="var(--text-dim)" stroke-width="2" marker-end="url(#l3arr)"/>' +
            '<text x="80" y="60" fill="var(--text-main)" font-size="12" text-anchor="middle" font-weight="bold">KEY 45</text>' +
            '<circle cx="330" cy="165" r="10" fill="var(--primary)" opacity="0.45"/>' +
            '<line x1="320" y1="163" x2="224" y2="157" stroke="var(--text-dim)" stroke-width="2" marker-end="url(#l3arr)"/>' +
            '<text x="330" y="145" fill="var(--text-dim)" font-size="12" text-anchor="middle">FILL (faible)</text>' +
            '<circle cx="270" cy="55" r="11" fill="var(--secondary)"/>' +
            '<line x1="262" y1="66" x2="214" y2="140" stroke="var(--text-dim)" stroke-width="2" marker-end="url(#l3arr)"/>' +
            '<text x="300" y="50" fill="var(--secondary)" font-size="12" text-anchor="middle">CONTRE</text>' +
            '</svg>',
          caption: "Vu de dessus : la key a 45 degres, le fill adouci a l oppose, le contre derriere le sujet." },
        { tip: "Tu n'as pas toujours besoin des trois : une belle key douce + un contre suffisent souvent. Ajoute le fill seulement si les ombres sont trop marquées." },
      ],
    },
    {
      id: "qualite-lumiere",
      category: "lumiere",
      title: "Qualité de lumière : dure vs douce",
      summary: "Ce qui rend une lumière flatteuse ou dramatique.",
      body: [
        { p: "La « dureté » dépend de la taille apparente de la source par rapport au sujet." },
        { ul: [
          "Lumière dure : petite source (soleil nu, spot). Ombres nettes, contraste fort, texture accentuée. Dramatique.",
          "Lumière douce : grande source (ciel couvert, softbox, mur qui rebondit). Ombres progressives, rendu flatteur pour la peau.",
        ] },
        { h: "Adoucir une source" },
        { ul: ["Rapproche-la du sujet (elle devient plus grande relativement)", "Diffuse-la (softbox, drap, calque)", "Fais-la rebondir sur une surface blanche"] },
        { tip: "Plus la source est proche, plus elle est douce ET plus la chute de lumière est rapide (le fond s'assombrit vite)." },
      ],
    },
    {
      id: "temperature-couleur",
      category: "lumiere",
      title: "Température de couleur & mélange de sources",
      summary: "Kelvin, balance des blancs et gestion des lumières mixtes.",
      body: [
        { p: "La température de couleur se mesure en Kelvin (K) : bas = chaud (orangé), haut = froid (bleuté)." },
        { ul: [
          "~1900 K : bougie",
          "~3200 K : lampe tungstène (chaud)",
          "~5600 K : lumière du jour",
          "~7000 K+ : ombre, ciel couvert (froid)",
        ] },
        { h: "Balance des blancs" },
        { p: "Régler la BdB indique à la caméra ce qui doit paraître blanc. En RAW/log tu peux l'ajuster en post, mais viser juste au tournage aide au monitoring." },
        { h: "Sources mixtes" },
        { p: "Mélanger jour (bleu) et tungstène (orange) crée des dominantes disgracieuses. Uniformise avec des gels (CTO/CTB) ou des LED réglables en Kelvin." },
        { tip: "Un léger déséquilibre chaud/froid est esthétique (peau chaude sur fond froid) — c'est différent d'un vrai conflit de sources." },
      ],
    },
    {
      id: "schemas-portrait",
      category: "lumiere",
      title: "Schémas d'éclairage portrait",
      summary: "Rembrandt, papillon, split, boucle : nommer et reproduire les rendus.",
      body: [
        { ul: [
          "Papillon (butterfly) : key haute et de face, petite ombre sous le nez. Glamour, beauté.",
          "Boucle (loop) : key à ~45°, petite ombre de nez « en boucle ». Le plus courant, flatteur.",
          "Rembrandt : key plus latérale, triangle de lumière sous l'œil dans l'ombre. Dramatique, pictural.",
          "Split : key à 90°, moitié du visage éclairée, moitié dans l'ombre. Très contrasté.",
        ] },
        { h: "Rapport de contraste" },
        { p: "Le ratio entre côté éclairé et côté ombre (key/fill) définit l'ambiance : 2:1 doux, 8:1 très dramatique." },
        { tip: "Fais tourner la key autour du sujet en observant l'ombre du nez : tu passes de papillon à boucle puis Rembrandt." },
      ],
    },

    /* ===================== MONTAGE ===================== */
    {
      id: "rythme",
      category: "montage",
      title: "Rythme et tempo du montage",
      summary: "Doser la durée des plans pour créer de l'émotion et de l'énergie.",
      body: [
        { p: "Le rythme naît de la durée des plans et de leur enchaînement. Plans courts = énergie, tension, dynamisme. Plans longs = calme, contemplation, gravité." },
        { h: "Couper au bon moment" },
        { p: "Coupe quand l'information d'un plan est délivrée, ou sur un mouvement/action (un « raccord dans le mouvement » masque la coupe). Évite de laisser traîner un plan une fois son intérêt épuisé." },
        { h: "Musique et rythme" },
        { p: "Monter sur le tempo (les temps forts) donne une sensation de fluidité. Mais varier volontairement évite l'effet mécanique." },
        { tip: "Regarde ton montage sans le son : si l'énergie visuelle fonctionne seule, le rythme est bon." },
      ],
    },
    {
      id: "continuite",
      category: "montage",
      title: "La continuité et la règle des 180°",
      summary: "Garder une cohérence spatiale pour ne pas perdre le spectateur.",
      body: [
        { h: "La règle des 180° (montage)" },
        { p: "Garde la caméra du même côté d'une ligne imaginaire entre deux sujets. Franchir cette ligne inverse les positions à l'écran et désoriente (sauf effet voulu)." },
        { h: "Raccords" },
        { ul: [
          "Raccord regard : un personnage regarde hors champ, le plan suivant montre ce qu'il voit.",
          "Raccord dans le mouvement : couper pendant une action pour la prolonger sur le plan suivant.",
          "Raccord de position : conserver la place des éléments d'un plan à l'autre.",
        ] },
        { h: "Faux raccords" },
        { p: "Objet qui saute, accessoire qui change de main, lumière incohérente : ils cassent l'immersion. Surveille-les au tournage (script) et au montage." },
      ],
    },
    {
      id: "types-coupes",
      category: "montage",
      title: "Les types de coupes",
      summary: "Cut franc, J-cut, L-cut, match cut, jump cut : le vocabulaire essentiel.",
      body: [
        { ul: [
          "Cut franc : coupe nette d'un plan au suivant, la plus courante.",
          "J-cut : le son du plan suivant démarre avant l'image (on entend avant de voir).",
          "L-cut : le son du plan actuel continue sur l'image suivante. J/L-cuts fluidifient les dialogues.",
          "Match cut : transition entre deux plans visuellement ou thématiquement similaires (forme, mouvement).",
          "Jump cut : coupe dans le même plan qui fait « sauter » le sujet — effet volontaire de vlog/ellipse.",
          "Cutaway (plan de coupe) : plan d'insert (mains, détail) qui masque une ellipse ou enrichit la scène.",
        ] },
        { tip: "Les J/L-cuts sont l'outil n°1 pour rendre un dialogue naturel : décale systématiquement l'audio et l'image de quelques images." },
      ],
    },
    {
      id: "derushage",
      category: "montage",
      title: "Dérushage et organisation",
      summary: "Trier et nommer ses médias pour monter vite et sereinement.",
      body: [
        { h: "Structure de dossiers" },
        { p: "Adopte une arborescence constante par projet : rushes, audio, musiques, assets, exports, projet. Slate peut la surveiller et la gérer." },
        { h: "Sélection" },
        { p: "Visionne, marque les meilleures prises (favoris, notes de prise), écarte le reste. Un bon dérushage fait gagner des heures de montage." },
        { h: "Nomenclature" },
        { p: "Nomme exports et versions de façon cohérente (date, client, projet, version) — voir le générateur de nomenclature de Slate." },
        { tip: "Sauvegarde selon la règle 3-2-1 : 3 copies, sur 2 supports, dont 1 hors site. L'outil de sauvegarde de Slate aide pour la copie sur disque externe." },
      ],
    },

    /* ===================== ÉTALONNAGE ===================== */
    {
      id: "primaire-secondaire",
      category: "etalonnage",
      title: "Correction primaire vs secondaire",
      summary: "Les deux étapes de tout étalonnage.",
      body: [
        { h: "Correction primaire" },
        { p: "Ajustements globaux sur toute l'image : exposition, contraste, balance des blancs, saturation. On équilibre d'abord chaque plan pour une base neutre et homogène." },
        { h: "Correction secondaire" },
        { p: "Ajustements ciblés sur une zone ou une couleur : isoler la peau, désaturer un fond, rehausser un ciel. On utilise masques, fenêtres (power windows), tracking et qualification par couleur (HSL)." },
        { h: "Ordre de travail" },
        { p: "1) Équilibrer (primaire) → 2) Faire correspondre les plans entre eux (match) → 3) Créer le look → 4) Retouches locales (secondaire)." },
        { tip: "Avant de « faire joli », rends l'image neutre et cohérente : un look posé sur une base bancale ne tiendra pas." },
      ],
    },
    {
      id: "scopes",
      category: "etalonnage",
      title: "Lire les scopes",
      summary: "Waveform, vecteurscope et parade RGB : juger l'image sans se fier à l'écran.",
      body: [
        { h: "Waveform" },
        { p: "Affiche la luminance de 0 (noir) à 100 (blanc). Vérifie que les noirs touchent ~0 sans écraser et que les blancs approchent 100 sans cramer." },
        { h: "Parade RGB" },
        { p: "Trois waveforms (rouge, vert, bleu). Aligner le bas et le haut des trois canaux neutralise les dominantes de couleur (utile pour la balance des blancs)." },
        { h: "Vecteurscope" },
        { p: "Représente la teinte (angle) et la saturation (distance au centre). La « skin tone line » indique la teinte de peau naturelle, quel que soit le teint." },
        { tip: "Un écran non calibré ment. Les scopes, eux, sont objectifs : apprends à étalonner en les regardant autant que l'image." },
      ],
    },
    {
      id: "roues-courbes",
      category: "etalonnage",
      title: "Roues chromatiques et courbes",
      summary: "Lift / gamma / gain, offset et courbes : les outils de base.",
      body: [
        { h: "Lift / Gamma / Gain" },
        { ul: [
          "Lift : agit sur les ombres (les noirs).",
          "Gamma : agit sur les tons moyens.",
          "Gain : agit sur les hautes lumières.",
        ] },
        { p: "Chaque roue déplace aussi la teinte de sa plage : pousser le lift vers le bleu refroidit les ombres, par exemple." },
        { h: "Offset" },
        { p: "Décale toute l'image à la fois — pratique pour la balance des blancs globale." },
        { h: "Courbes" },
        { p: "La courbe de luminance crée le contraste (forme en S = plus de punch). Les courbes par canal ou Teinte/Saturation permettent des ajustements très fins." },
        { tip: "Un contraste en S léger sur la courbe donne instantanément une image plus « pro » à partir d'un log plat." },
      ],
    },
    {
      id: "color-management",
      category: "etalonnage",
      title: "Color management & espaces",
      summary: "Rec.709, transformation du log à l'affichage, ACES.",
      body: [
        { p: "Le color management garantit que les couleurs sont interprétées correctement de la caméra à l'écran final." },
        { ul: [
          "Rec.709 : espace standard pour la vidéo SDR (le plus courant en livraison).",
          "Transformer le log : une LUT ou un color space transform convertit le S-Log3 vers Rec.709 pour l'affichage.",
          "HDR (Rec.2020/PQ) : plus large plage dynamique et gamut, pour les livraisons HDR.",
          "ACES : pipeline neutre standardisé, utile en VFX et projets multi-caméras.",
        ] },
        { h: "Dans DaVinci Resolve" },
        { p: "Le « DaVinci YRGB Color Managed » (DRCM) ou l'ACES gèrent automatiquement les conversions d'espace : tu poses l'espace d'entrée (S-Log3/S-Gamut3) et de sortie (Rec.709), Resolve fait le reste." },
        { tip: "Un color management propre évite d'appliquer une LUT « au pif » et de galérer ensuite avec des couleurs qui débordent." },
      ],
    },
    {
      id: "creer-look",
      category: "etalonnage",
      title: "Créer un look",
      summary: "Du plan neutre à une identité visuelle cohérente.",
      body: [
        { p: "Une fois l'image équilibrée, le look donne l'ambiance : teal & orange, désaturé froid, pastel chaud, contrasté argentique…" },
        { h: "Ingrédients d'un look" },
        { ul: [
          "Contraste et point noir (un noir légèrement relevé = rendu « film »).",
          "Balance chaud/froid entre ombres et hautes lumières (split toning).",
          "Saturation ciblée (souvent baisser certaines couleurs plutôt que tout monter).",
          "Grain et vignettage subtils.",
        ] },
        { h: "Cohérence" },
        { p: "Applique le look sur un plan de référence, puis étends-le. Vérifie qu'il tient sur les peaux, les ciels et la nuit." },
        { tip: "Crée ton look sur un nœud dédié à la fin de la chaîne : tu peux le désactiver/copier facilement. Sauvegarde-le en LUT dans la bibliothèque de Slate." },
      ],
    },

    /* ===================== VFX ===================== */
    {
      id: "keying",
      category: "vfx",
      title: "Le keying (fond vert)",
      summary: "Détourer un sujet filmé sur fond uni pour l'incruster.",
      body: [
        { p: "Le keying supprime une couleur de fond (vert ou bleu) pour rendre le sujet détourable et l'incruster sur un autre arrière-plan." },
        { h: "Réussir dès le tournage" },
        { ul: [
          "Fond éclairé uniformément, sans plis ni ombres.",
          "Sépare le sujet du fond (2–3 m) pour éviter le « spill » (débord vert sur la peau).",
          "Évite le vert sur le sujet, et les vêtements brillants/transparents.",
        ] },
        { h: "En post" },
        { p: "Un keyer (Keylight dans After Effects, le node Delta Keyer dans Resolve Fusion) extrait la couleur. On affine ensuite le masque (matte), on supprime le spill et on intègre par l'étalonnage et les ombres." },
        { tip: "80 % d'un bon key se joue au tournage. Un fond mal éclairé se paie très cher en post." },
      ],
    },
    {
      id: "tracking",
      category: "vfx",
      title: "Le tracking",
      summary: "Suivre le mouvement pour accrocher des éléments à l'image.",
      body: [
        { ul: [
          "Point / 2 points : suit position, échelle et rotation d'une zone (ex. accrocher un texte à un objet).",
          "Planar tracking (Mocha) : suit une surface plane (écran de téléphone, panneau) même en perspective.",
          "Camera tracking (3D) : reconstitue le mouvement de la caméra pour intégrer des éléments 3D dans un plan réel.",
        ] },
        { h: "Bons repères" },
        { p: "Le tracking a besoin de points contrastés et stables. Sur un tournage VFX, on ajoute parfois des marqueurs (points de tracking) à effacer ensuite." },
        { tip: "Plus l'image est nette et peu compressée, meilleur est le tracking : c'est un argument de plus pour éviter les codecs trop compressés." },
      ],
    },
    {
      id: "roto-masques",
      category: "vfx",
      title: "Rotoscopie et masques",
      summary: "Isoler un élément sans fond vert.",
      body: [
        { p: "La rotoscopie consiste à dessiner un masque autour d'un sujet, image par image (ou avec l'aide de l'IA/tracking), pour l'isoler quand il n'y a pas de fond vert." },
        { h: "Usages" },
        { ul: ["Séparer un sujet pour l'étalonner à part", "Intégrer un élément derrière un personnage", "Nettoyer/effacer un objet indésirable"] },
        { h: "Outils" },
        { p: "After Effects (Roto Brush), Mocha (masques trackés), Resolve (Magic Mask basé IA). La Magic Mask de Resolve accélère énormément l'isolation de personnes/objets." },
        { tip: "Anime les masques par grandes étapes puis corrige entre les keyframes : plus rapide que de tracer chaque image." },
      ],
    },
    {
      id: "multipasses",
      category: "vfx",
      title: "Compositing multi-passes (3D)",
      summary: "Recomposer un rendu 3D à partir de ses couches.",
      body: [
        { p: "Un rendu 3D (Blender, C4D) peut être exporté en plusieurs passes séparées, recombinées en compositing pour un contrôle total sans re-rendre." },
        { ul: [
          "Beauty : l'image finale combinée.",
          "Passes de lumière : diffuse, spéculaire, réflexions, ombres.",
          "Passes utilitaires : Z-depth (profondeur, pour le flou), normales, cryptomatte (sélection par objet/matériau), motion vectors.",
        ] },
        { h: "Format" },
        { p: "On travaille en EXR multicouche (32 bits, linéaire) pour préserver toute l'information. Slate convertit tes séquences EXR/PNG en vidéo de prévisualisation." },
        { tip: "Le Z-depth permet d'ajouter la profondeur de champ en post ; le cryptomatte permet de ré-étalonner un objet précis sans re-rendre la scène." },
      ],
    },

    /* ===================== MOTION DESIGN ===================== */
    {
      id: "12-principes",
      category: "motion",
      title: "Les 12 principes de l'animation",
      summary: "Les fondamentaux Disney appliqués au motion design.",
      body: [
        { p: "Formulés par Disney, ces principes rendent toute animation crédible et vivante — y compris le motion graphics abstrait." },
        { ul: [
          "Squash & stretch : déformation qui donne poids et souplesse.",
          "Anticipation : petit mouvement inverse avant l'action principale.",
          "Mise en scène (staging) : diriger le regard.",
          "Pose à pose / straight ahead : deux méthodes de construction.",
          "Suivi & chevauchement (follow through / overlap) : les parties s'arrêtent en décalé.",
          "Slow in / slow out (easing) : accélérations et décélérations naturelles.",
          "Arcs : les mouvements suivent des courbes, pas des lignes droites.",
          "Action secondaire : mouvements d'accompagnement.",
          "Timing : nombre d'images = vitesse et poids.",
          "Exagération : pousser le trait pour l'impact.",
          "Dessin solide : volume et équilibre.",
          "Appeal (charisme) : rendre l'élément intéressant.",
        ] },
        { tip: "Pour du motion UI/graphique, les plus utiles au quotidien sont : easing, anticipation, overlap et timing." },
      ],
    },
    {
      id: "easing-motion",
      category: "motion",
      title: "Easing et courbes de vitesse",
      summary: "Pourquoi rien ne bouge à vitesse constante dans une bonne animation.",
      body: [
        { p: "L'easing décrit comment une valeur accélère et décélère entre deux keyframes. Un mouvement linéaire paraît mécanique ; un mouvement avec ease-in/ease-out paraît naturel." },
        { ul: [
          "Ease out : démarre vite, ralentit — idéal pour un élément qui entre et se pose.",
          "Ease in : part lentement, accélère — pour une sortie.",
          "Ease in-out : les deux, mouvement fluide et élégant.",
          "Overshoot : dépasse la cible puis revient — donne du ressort et de la vie.",
        ] },
        { h: "Éditeur de courbes" },
        { p: "Dans After Effects, l'éditeur de graphe permet de sculpter la vitesse. Slate inclut un éditeur de courbes cubic-bezier pour générer et copier des easings." },
        { tip: "Une règle simple et efficace : presque tout devrait être en ease-out. Ajoute un léger overshoot pour un rendu plus dynamique." },
      ],
    },
    {
      id: "keyframes-interp",
      category: "motion",
      title: "Keyframes et interpolation",
      summary: "Le socle de toute animation temporelle.",
      body: [
        { p: "Une keyframe fixe la valeur d'une propriété à un instant. Le logiciel calcule les images intermédiaires : c'est l'interpolation." },
        { h: "Interpolation temporelle" },
        { p: "Comment la valeur évolue dans le temps (linéaire, easy ease, maintien). C'est là qu'agit l'easing." },
        { h: "Interpolation spatiale" },
        { p: "Pour la position, la trajectoire entre keyframes peut être une droite ou une courbe (Bézier). Les mouvements en arc sont plus naturels." },
        { tip: "Moins de keyframes = animation plus propre. Commence par les poses clés, ajoute des intermédiaires seulement si nécessaire." },
      ],
    },
    {
      id: "expressions-intro",
      category: "motion",
      title: "Les expressions (introduction)",
      summary: "Automatiser et lier des animations avec du code.",
      body: [
        { p: "Les expressions (JavaScript dans After Effects) pilotent une propriété par une formule plutôt que par des keyframes : animations procédurales, liaisons entre calques, automatisations." },
        { ul: [
          "wiggle(freq, amp) : agitation aléatoire fluide.",
          "loopOut() : boucler des keyframes à l'infini.",
          "time * n : mouvement continu (rotation d'une roue).",
          "linear()/ease() : remapper une valeur vers une autre.",
        ] },
        { p: "Avantages : modifiable en un instant, réutilisable, non destructif. Slate propose une bibliothèque d'expressions prêtes à copier avec leur mode d'emploi." },
        { tip: "Relie une propriété à un curseur (Slider Control) pour garder des expressions réglables sans toucher au code." },
      ],
    },

    /* ===================== LOGICIELS ===================== */
    {
      id: "sw-ae",
      category: "logiciels",
      title: "After Effects",
      summary: "Le logiciel de motion design et de compositing d'Adobe.",
      body: [
        { p: "After Effects (AE) travaille image par image sur des compositions : animation, motion graphics, titrage, compositing VFX, effets." },
        { h: "Points forts" },
        { ul: ["Motion design et animation graphique", "Compositing, keying, tracking", "Expressions (automatisation)", "Écosystème de plugins et de scripts .jsx"] },
        { h: "À savoir" },
        { p: "AE n'est pas fait pour le montage long : on y crée des plans/séquences qu'on intègre ensuite dans Premiere ou Resolve. Le rendu peut être lourd : proxys et pré-rendus aident." },
        { tip: "Slate génère des scripts .jsx (proxys, structure, marqueurs, easing…) et propose une bibliothèque d'expressions pour AE." },
      ],
    },
    {
      id: "sw-premiere",
      category: "logiciels",
      title: "Premiere Pro",
      summary: "Le logiciel de montage vidéo d'Adobe.",
      body: [
        { p: "Premiere Pro est un monteur non linéaire polyvalent, très intégré à l'écosystème Adobe (Dynamic Link avec After Effects, Audition)." },
        { h: "Points forts" },
        { ul: ["Montage rapide et flexible", "Intégration After Effects / Audition", "Bonne gestion des formats variés", "Flux proxys intégré"] },
        { h: "À savoir" },
        { p: "L'étalonnage (Lumetri) est correct mais moins poussé que Resolve. Beaucoup montent dans Premiere puis étalonnent dans Resolve." },
        { tip: "Le Dynamic Link évite les rendus intermédiaires entre Premiere et After Effects, mais peut alourdir la lecture." },
      ],
    },
    {
      id: "sw-resolve",
      category: "logiciels",
      title: "DaVinci Resolve",
      summary: "Montage, étalonnage, son et VFX dans un seul logiciel.",
      body: [
        { p: "DaVinci Resolve (Blackmagic) réunit montage, étalonnage de référence, audio (Fairlight) et VFX/motion (Fusion). Une version gratuite très complète existe." },
        { h: "Les pages" },
        { ul: [
          "Media : import et organisation.",
          "Cut / Edit : montage (Cut = rapide, Edit = complet).",
          "Fusion : compositing et motion par nœuds.",
          "Color : étalonnage par nœuds, la référence du marché.",
          "Fairlight : mixage audio.",
          "Deliver : export.",
        ] },
        { tip: "Resolve est scriptable en Python (import de médias, marqueurs, file de rendu) — Slate fournit des snippets pour ça." },
      ],
    },
    {
      id: "sw-blender",
      category: "logiciels",
      title: "Blender",
      summary: "La suite 3D libre et complète.",
      body: [
        { p: "Blender est un logiciel 3D gratuit et open source : modélisation, animation, rendu, simulation, et même montage et compositing." },
        { h: "Points forts" },
        { ul: ["Rendu Cycles (photoréaliste) et Eevee (temps réel)", "Modélisation, sculpt, rigging, simulations", "Compositing par nœuds intégré", "Gratuit, communauté immense"] },
        { h: "Pour la vidéo" },
        { p: "On exporte souvent des séquences d'images (PNG/EXR) plutôt qu'une vidéo directe, pour la qualité et la reprise en cas d'interruption." },
        { tip: "Slate convertit tes séquences de rendu Blender en vidéo de prévisualisation, et propose des snippets Python (réglages de sortie, drivers)." },
      ],
    },
    {
      id: "sw-c4d",
      category: "logiciels",
      title: "Cinema 4D",
      summary: "La 3D de référence pour le motion design.",
      body: [
        { p: "Cinema 4D (Maxon) est réputé pour son ergonomie et son intégration au motion design, notamment avec After Effects." },
        { h: "Points forts" },
        { ul: ["Prise en main réputée accessible", "MoGraph : outils dédiés au motion design (clonage, effecteurs)", "Bon écosystème de rendu (Redshift)", "Ponts avec After Effects (Cineware)"] },
        { tip: "Comme pour Blender, exporte en séquence d'images pour la qualité et la reprise ; Slate les recompose en vidéo." },
      ],
    },

    /* ===================== LIVRAISON ===================== */
    {
      id: "choix-codec-export",
      category: "livraison",
      title: "Choisir son codec d'export",
      summary: "Master, diffusion, montage : à chaque usage son codec.",
      body: [
        { ul: [
          "Master / archive : ProRes 422 HQ ou 4444 (qualité maximale, fichiers lourds).",
          "Diffusion web (YouTube, réseaux) : H.264 ou H.265 (léger, compatible).",
          "Montage / échange pro : DNxHR (Avid, Resolve).",
          "Transparence (alpha) : ProRes 4444 ou PNG/QuickTime avec alpha.",
        ] },
        { h: "Principe" },
        { p: "Livre en H.264/H.265 pour le web, mais garde un master de haute qualité (ProRes) pour ré-exporter plus tard sans perte cumulée." },
        { tip: "Slate propose des préréglages de transcodage (YouTube, vertical, ProRes, DNxHR…) et permet de créer les tiens." },
      ],
    },
    {
      id: "specs-plateformes",
      category: "livraison",
      title: "Specs par plateforme",
      summary: "Résolutions, ratios et framerates attendus par les principales plateformes.",
      body: [
        { ul: [
          "YouTube : 1920×1080 ou 3840×2160, 16:9, 24–60 fps, H.264/H.265.",
          "Instagram feed : 1080×1350 (4:5), 30 fps.",
          "Reels / TikTok / Shorts : 1080×1920 (9:16), 30–60 fps.",
          "Cinéma / broadcast : selon cahier des charges (souvent ProRes/DNxHD, 25 fps en France).",
        ] },
        { h: "Sécurité des bords (title safe)" },
        { p: "Garde le texte important à l'intérieur des zones de sécurité, surtout en vertical où l'interface des apps recouvre les bords." },
        { tip: "Consulte l'onglet Références → Specs & Codecs de Slate pour les tableaux détaillés." },
      ],
    },
    {
      id: "compression-bitrate",
      category: "livraison",
      title: "Compression et bitrate",
      summary: "Trouver l'équilibre qualité / poids à l'export.",
      body: [
        { p: "La compression réduit le poids en supprimant de l'information. Le bitrate (Mb/s) est le principal levier de qualité sur un codec donné." },
        { ul: [
          "CBR (débit constant) : régulier, prévisible.",
          "VBR (débit variable) : alloue plus de débit aux scènes complexes — meilleure qualité à taille égale.",
          "CRF (H.264/H.265) : vise une qualité constante, le débit s'adapte.",
        ] },
        { h: "Repères YouTube (1080p)" },
        { p: "~8–12 Mb/s en SDR ; la 4K monte à ~35–68 Mb/s. Au-delà, le gain est invisible après la ré-compression de la plateforme." },
        { tip: "Exporte à un débit un peu supérieur à la cible de la plateforme : elle re-compressera de toute façon, autant lui donner une bonne source." },
      ],
    },
    {
      id: "archivage",
      category: "livraison",
      title: "Archivage et sauvegarde",
      summary: "Protéger ses projets sur le long terme.",
      body: [
        { h: "La règle 3-2-1" },
        { p: "3 copies des données, sur 2 types de supports différents, dont 1 conservée hors site (cloud ou disque déporté). C'est la base contre la perte." },
        { h: "Quoi archiver" },
        { ul: ["Les rushes originaux (irremplaçables)", "Le projet et ses assets", "Le master d'export", "Éventuellement un « collect/consolidate » regroupant tout"] },
        { h: "Supports" },
        { p: "Disques durs pour l'actif, disques déportés/LTO ou cloud pour l'archive longue. Vérifie périodiquement que les sauvegardes se relisent." },
        { tip: "L'outil de sauvegarde de Slate copie un projet vers un autre disque en un clic — pratique pour la copie hors site." },
      ],
    },

    /* ============ ENRICHISSEMENT — PHOTO ============ */
    {
      id: "photo-modes",
      category: "photo",
      title: "Les modes de prise de vue (P/A/S/M)",
      summary: "Comprendre les modes du boîtier pour reprendre le contrôle.",
      body: [
        { ul: [
          "P (Programme) : l'appareil choisit ouverture et vitesse, tu gardes la main sur ISO et corrections. Pratique en dépannage.",
          "A / Av (priorité ouverture) : tu fixes l'ouverture (donc la profondeur de champ), l'appareil ajuste la vitesse. Le plus utile en photo.",
          "S / Tv (priorité vitesse) : tu fixes la vitesse (figer/filer le mouvement), l'appareil ajuste l'ouverture. Sport, action.",
          "M (manuel) : tu contrôles tout. Indispensable en vidéo et en lumière constante (studio).",
        ] },
        { tip: "En vidéo, travaille quasi toujours en M : la vitesse est imposée par la règle du 180°, et l'auto-exposition qui pompe est disgracieuse." },
      ],
    },
    {
      id: "photo-mesure",
      category: "photo",
      title: "Les modes de mesure de la lumière",
      summary: "Comment l'appareil évalue l'exposition, et quand le corriger.",
      body: [
        { ul: [
          "Matricielle / évaluative : analyse toute la scène. Polyvalente, par défaut.",
          "Pondérée centrale : privilégie le centre du cadre.",
          "Spot : mesure une toute petite zone — idéale pour exposer précisément un visage à contre-jour.",
        ] },
        { h: "Correction d'exposition" },
        { p: "En modes semi-auto (P/A/S), la molette de correction (+/- IL) force l'image plus claire ou plus sombre quand la mesure se trompe (neige = sous-exposée par défaut, il faut +1 IL)." },
        { tip: "Fie-toi à l'histogramme plutôt qu'à la cellule : la mesure vise un gris moyen qui n'est pas toujours pertinent." },
      ],
    },
    {
      id: "photo-map",
      category: "photo",
      title: "La mise au point",
      summary: "AF, mise au point manuelle et hyperfocale.",
      body: [
        { h: "Autofocus" },
        { ul: ["AF ponctuel (AF-S) : sujet immobile.", "AF continu (AF-C) : sujet en mouvement.", "Détection œil/visage : redoutable en portrait et interview."] },
        { h: "Mise au point manuelle" },
        { p: "Indispensable en vidéo pour les points de netteté (focus pull). Utilise le focus peaking (surbrillance des contours nets) et le zoom de contrôle." },
        { h: "Hyperfocale" },
        { p: "Distance de mise au point qui rend net de la moitié de cette distance jusqu'à l'infini — précieux en paysage. Le calculateur de profondeur de champ de Slate la donne." },
      ],
    },
    {
      id: "photo-filtres",
      category: "photo",
      title: "Les filtres (polarisant, ND, dégradé)",
      summary: "Des effets impossibles à recréer en post.",
      body: [
        { ul: [
          "Polarisant (CPL) : supprime les reflets (eau, vitres), assombrit et sature le ciel. Effet non reproductible en post.",
          "ND (densité neutre) : réduit la lumière sans changer les couleurs — garder une grande ouverture ou l'obturation ciné en plein jour.",
          "ND dégradé : sombre en haut, clair en bas — équilibrer un ciel trop lumineux par rapport au sol.",
          "ND variable : deux polarisants, densité réglable — pratique en vidéo run & gun (attention à la croix noire aux fortes densités).",
        ] },
        { tip: "Pour la vidéo à la FX3 en extérieur, un ND (fixe ou variable) est quasi obligatoire pour tenir le 1/50 à grande ouverture." },
      ],
    },

    /* ============ ENRICHISSEMENT — VIDÉO ============ */
    {
      id: "tour-valeurs",
      category: "tournage",
      title: "Les valeurs de plan (échelle des plans)",
      summary: "Nommer les cadrages pour raconter et varier.",
      body: [
        { svg: '<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" role="img"><rect x="6" y="6" width="308" height="198" fill="none" stroke="var(--text-dim)" stroke-width="2"/><rect x="6" y="6" width="238" height="198" fill="none" stroke="var(--primary)" stroke-width="1.5"/><rect x="6" y="6" width="176" height="160" fill="none" stroke="var(--secondary)" stroke-width="1.5"/><rect x="6" y="6" width="120" height="112" fill="none" stroke="var(--primary)" stroke-width="1.5"/><rect x="6" y="6" width="72" height="64" fill="none" stroke="var(--secondary)" stroke-width="1.5"/><g font-size="9" fill="var(--text-main)" text-anchor="end"><text x="310" y="200">Plan large</text><text x="240" y="176">Plan moyen</text><text x="178" y="152">Américain</text><text x="122" y="104">Rapproché</text><text x="70" y="56">Gros plan</text></g></svg>', caption: "Du plus large au plus serré : chaque cadre resserre sur le sujet." },
        { ul: [
          "Très gros plan (insert) : un détail (œil, main, objet).",
          "Gros plan : le visage. Émotion, intimité.",
          "Plan rapproché : buste (taille/poitrine).",
          "Plan moyen / américain : à mi-cuisse ou en pied. Dialogue, action.",
          "Plan large : le sujet dans son décor.",
          "Très large (plan d'ensemble) : situe le lieu, ouvre ou ferme une séquence.",
        ] },
        { tip: "Varie les valeurs pour donner du rythme et pour pouvoir monter : tourne au moins un large, un moyen et un gros plan de chaque action." },
      ],
    },
    {
      id: "tour-mouvements",
      category: "tournage",
      title: "Les mouvements de caméra",
      summary: "Chaque mouvement porte un sens — à utiliser à bon escient.",
      body: [
        { ul: [
          "Panoramique / tilt : rotation horizontale / verticale sur pied. Suivre, révéler.",
          "Travelling : la caméra se déplace (rail, dolly, slider). Accompagne, immerge.",
          "Travelling avant/arrière : rapproche de l'émotion / prend du recul.",
          "Gimbal / Steadicam : mouvement fluide et libre, plans-séquences.",
          "Caméra épaule : énergie, urgence, documentaire.",
          "Zoom : change la focale (à distinguer du travelling, qui change la perspective).",
        ] },
        { tip: "Un mouvement doit être motivé (par une action, un regard). Un mouvement gratuit distrait plus qu'il ne sert." },
      ],
    },
    {
      id: "tour-sync",
      category: "tournage",
      title: "Synchronisation son & timecode",
      summary: "Recaler proprement le son enregistré à part.",
      body: [
        { p: "Quand le son est capté sur un enregistreur séparé (meilleure qualité), il faut le resynchroniser avec l'image au montage." },
        { h: "Méthodes" },
        { ul: [
          "Le clap : le « tac » visible et audible sert de point de calage manuel (ou automatique).",
          "Synchro par forme d'onde : les logiciels alignent l'audio caméra et l'audio HQ automatiquement (PluralEyes, Resolve, Premiere).",
          "Timecode : caméras et enregistreurs partagent le même code temporel (via boîtier Tentacle par ex.) — synchro instantanée sur gros tournages.",
        ] },
        { tip: "Même avec un enregistreur externe, garde le son de la caméra : il sert de référence pour la synchro par forme d'onde." },
      ],
    },

    /* ============ ENRICHISSEMENT — LUMIÈRE ============ */
    {
      id: "lum-naturelle",
      category: "lumiere",
      title: "Lumière naturelle & motivée",
      summary: "Travailler avec le soleil et les sources existantes.",
      body: [
        { h: "Lumière naturelle" },
        { p: "Le soleil direct est dur ; le ciel couvert est une immense softbox. Une fenêtre donne une belle lumière douce et directionnelle — un grand classique du portrait." },
        { h: "Lumière motivée" },
        { p: "En fiction, l'éclairage artificiel imite une source visible à l'écran (fenêtre, lampe, néon) pour rester crédible. On renforce ou remplace la source réelle tout en gardant sa logique." },
        { tip: "En intérieur jour, place ton sujet près d'une fenêtre à 45°, un réflecteur de l'autre côté : lumière gratuite et flatteuse." },
      ],
    },
    {
      id: "lum-modificateurs",
      category: "lumiere",
      title: "Modeler la lumière",
      summary: "Diffuseurs, drapeaux, réflecteurs, gels : sculpter au lieu de juste éclairer.",
      body: [
        { ul: [
          "Diffuseur (softbox, soie) : agrandit et adoucit la source.",
          "Drapeau (flag) : bloque la lumière, crée de l'ombre, évite les reflets parasites (flare).",
          "Réflecteur : renvoie la lumière pour déboucher les ombres, sans ajouter de projecteur.",
          "Nid d'abeille (grid) : concentre le faisceau, contrôle la dispersion.",
          "Gels : colorent (effet, ambiance) ou corrigent la température (CTO/CTB).",
        ] },
        { tip: "Contrôler où la lumière NE VA PAS (avec des drapeaux) est aussi important que l'éclairer : c'est ce qui donne du relief." },
      ],
    },

    /* ============ ENRICHISSEMENT — MONTAGE ============ */
    {
      id: "mont-musique",
      category: "montage",
      title: "Monter en rythme sur la musique",
      summary: "Caler les coupes sur le tempo pour une énergie irrésistible.",
      body: [
        { p: "Repère les temps forts (les « beats ») et place tes coupes ou tes apparitions dessus. La plupart des logiciels permettent de poser des marqueurs au rythme de la musique (touche à chaque temps pendant la lecture)." },
        { ul: [
          "Coupe sur le beat : dynamique, clip, montage sportif.",
          "Coupe en anticipation (juste avant le beat) : parfois plus naturel.",
          "Varie : tout caler mécaniquement finit par lasser.",
        ] },
        { tip: "Choisis la musique AVANT de monter une séquence rythmée : elle dicte la structure et le tempo." },
      ],
    },
    {
      id: "mont-sound",
      category: "montage",
      title: "Sound design & mixage (bases)",
      summary: "Le son fait la moitié de l'image.",
      body: [
        { h: "Les couches du son" },
        { ul: [
          "Dialogues : la priorité, toujours intelligibles.",
          "Ambiances (room tone, extérieurs) : donnent vie et continuité.",
          "Effets (foley, SFX) : renforcent les actions.",
          "Musique : porte l'émotion, sans écraser les dialogues.",
        ] },
        { h: "Repères de mixage" },
        { p: "Dialogues autour de -12 dB, musique en dessous pour ne pas masquer la voix. Vise une norme de loudness à la livraison (souvent -14 LUFS pour le web)." },
        { tip: "Un léger fondu (2-4 images) sur chaque coupe audio évite les clics. Ne néglige jamais le room tone pour combler les silences." },
      ],
    },
    {
      id: "mont-multicam",
      category: "montage",
      title: "Le montage multicaméra",
      summary: "Monter plusieurs angles synchronisés en direct.",
      body: [
        { p: "Le mode multicam synchronise plusieurs sources (par timecode, forme d'onde ou clap) et permet de « switcher » d'angle en temps réel pendant la lecture, comme une régie." },
        { h: "Workflow" },
        { ul: ["Synchronise les angles", "Crée un clip/timeline multicam", "Lis et coupe d'un angle à l'autre au clavier", "Affine les points de coupe ensuite"] },
        { tip: "Idéal pour interviews multi-angles, concerts, événements. Garde un angle « sécurité » large qui marche toujours." },
      ],
    },

    /* ============ ENRICHISSEMENT — ÉTALONNAGE ============ */
    {
      id: "eta-match",
      category: "etalonnage",
      title: "Faire correspondre les plans (shot matching)",
      summary: "Rendre une séquence homogène d'un plan à l'autre.",
      body: [
        { p: "Des plans tournés à des moments/réglages différents doivent sembler appartenir à la même scène. On les équilibre entre eux avant de poser le look." },
        { h: "Méthode" },
        { ul: [
          "Choisis un plan de référence réussi.",
          "Aligne les autres dessus : niveau des noirs et blancs (waveform), balance des couleurs (parade), teinte de peau (vecteurscope).",
          "Compare en basculant rapidement d'un plan à l'autre.",
        ] },
        { tip: "Resolve propose un « Shot Match » automatique : un bon point de départ à corriger ensuite à la main." },
      ],
    },
    {
      id: "eta-peau",
      category: "etalonnage",
      title: "Gérer les teintes de peau",
      summary: "La peau est le juge de paix de tout étalonnage.",
      body: [
        { p: "L'œil est extrêmement sensible aux teintes de peau : si elles sont justes, l'image passe ; sinon, tout paraît faux." },
        { h: "Repères" },
        { ul: [
          "Sur le vecteurscope, la peau se place le long de la « skin tone line » (I-line), quel que soit le teint.",
          "Attention aux dominantes qui verdissent ou rougissent la peau.",
          "En secondaire, isole la peau (qualifier HSL) pour l'ajuster sans toucher au reste.",
        ] },
        { tip: "Étalonne d'abord pour que la peau soit juste, puis construis le reste du look autour — pas l'inverse." },
      ],
    },
    {
      id: "eta-hdr",
      category: "etalonnage",
      title: "SDR vs HDR",
      summary: "Comprendre la différence et ses implications.",
      body: [
        { ul: [
          "SDR (Rec.709) : la norme actuelle, ~100 nits, la majorité des livraisons.",
          "HDR (Rec.2020 / PQ ou HLG) : plage dynamique et luminosité bien supérieures (1000 nits et +), couleurs plus larges. Rendu spectaculaire sur écran compatible.",
        ] },
        { h: "En pratique" },
        { p: "Le HDR demande un écran de mastering calibré, un color management rigoureux et une livraison spécifique. Beaucoup livrent en SDR et dérivent une version HDR si besoin." },
        { tip: "Ne te lance en HDR que si toute la chaîne (écran, export, plateforme) le supporte : un HDR mal maîtrisé est pire qu'un bon SDR." },
      ],
    },

    /* ============ ENRICHISSEMENT — VFX ============ */
    {
      id: "vfx-motionblur",
      category: "vfx",
      title: "Le motion blur en compositing",
      summary: "Intégrer un élément animé de façon crédible.",
      body: [
        { p: "Un élément ajouté qui bouge sans flou de mouvement « colle » à l'écran et trahit le trucage. Il faut lui appliquer un motion blur cohérent avec le plan (lié à la règle du 180°)." },
        { ul: [
          "Active le motion blur sur les calques animés (After Effects).",
          "Pour un rendu 3D, exporte des vecteurs de mouvement (motion vectors) pour l'appliquer en post.",
          "Assortis l'intensité à celle du plan réel.",
        ] },
        { tip: "Motion blur, grain assorti et légère aberration/flou d'objectif sont les 3 ingrédients qui fondent un élément CGI dans une prise réelle." },
      ],
    },
    {
      id: "vfx-cleanup",
      category: "vfx",
      title: "Nettoyage / paint-out",
      summary: "Effacer un élément indésirable d'un plan.",
      body: [
        { p: "Le cleanup consiste à supprimer perche son, marqueur de tracking, logo, passant, poussière capteur… en reconstituant l'arrière-plan." },
        { h: "Techniques" },
        { ul: [
          "Plan fixe : cloner une zone propre d'une autre image (image « propre »).",
          "Plan mobile : tracker la zone, patcher, puis re-tracker le patch.",
          "Outils : Content-Aware Fill (After Effects), tampon, Resolve (Patch Replacer / Object Removal IA).",
        ] },
        { tip: "Le plus rapide reste d'éviter le problème au tournage : cache les marqueurs superflus et surveille les bords du cadre." },
      ],
    },

    /* ============ ENRICHISSEMENT — MOTION ============ */
    {
      id: "mot-typo",
      category: "motion",
      title: "Typographie animée (kinetic type)",
      summary: "Animer le texte avec impact et lisibilité.",
      body: [
        { ul: [
          "Hiérarchie : un mot-clé domine, le reste soutient.",
          "Timing : apparitions rythmées (souvent sur la voix ou la musique).",
          "Easing : entrées en ease-out, léger overshoot pour du peps.",
          "Lisibilité avant tout : laisse le temps de lire, contraste suffisant.",
        ] },
        { h: "Outils After Effects" },
        { p: "Les animateurs de texte (Text Animators) permettent d'animer par caractère/mot/ligne (opacité, position, échelle) très efficacement." },
        { tip: "Anime peu de propriétés à la fois : position + opacité suffisent souvent. Trop d'effets nuit à la lisibilité." },
      ],
    },
    {
      id: "mot-rig",
      category: "motion",
      title: "Rigging de personnage (bases)",
      summary: "Préparer un personnage 2D pour l'animer facilement.",
      body: [
        { p: "Le rigging crée une « marionnette » : on relie les parties d'un personnage (via parentage, os, contraintes) pour l'animer sans tout redessiner." },
        { ul: [
          "Sépare les éléments en calques (bras, avant-bras, main…).",
          "Outil Marionnette (Puppet) ou plugins (DUIK, Rubberhose) pour les membres.",
          "Parentage pour la hiérarchie (la main suit l'avant-bras qui suit le bras).",
          "Contrôleurs (Sliders/Null) pour piloter le rig simplement.",
        ] },
        { tip: "Un bon rig se pilote avec quelques contrôleurs : investis du temps sur le rig pour gagner un temps fou à l'animation." },
      ],
    },

    /* ============ ENRICHISSEMENT — LOGICIELS ============ */
    {
      id: "sw-photoshop",
      category: "logiciels",
      title: "Photoshop",
      summary: "La référence de l'image fixe et du photomontage.",
      body: [
        { p: "Photoshop édite les images matricielles (pixels) : retouche photo, compositing d'images, matte painting, textures, création graphique." },
        { h: "Points forts" },
        { ul: ["Retouche et détourage puissants", "Calques, masques, modes de fusion", "Camera Raw pour le développement", "Passerelle vers After Effects (calques importables)"] },
        { tip: "Un PSD multicalque importé dans After Effects garde ses calques : idéal pour animer une illustration créée dans Photoshop." },
      ],
    },
    {
      id: "sw-lightroom",
      category: "logiciels",
      title: "Lightroom",
      summary: "Développement et catalogage photo (RAW).",
      body: [
        { p: "Lightroom gère le flux photo : import, tri, développement RAW non destructif et export par lots. Pensé pour traiter de gros volumes efficacement." },
        { h: "Points forts" },
        { ul: ["Développement RAW (exposition, couleurs, courbes)", "Catalogage, mots-clés, collections", "Presets réutilisables et synchronisables", "Retouches localisées (masques IA)"] },
        { tip: "Crée tes presets pour une identité photo cohérente et un traitement rapide de séries entières." },
      ],
    },
    {
      id: "sw-media-encoder",
      category: "logiciels",
      title: "Adobe Media Encoder",
      summary: "L'encodeur et la file d'attente d'export d'Adobe.",
      body: [
        { p: "Media Encoder (AME) encode et transcode en file d'attente, en tâche de fond, pour Premiere et After Effects. Il centralise les exports et les presets." },
        { h: "Usages" },
        { ul: ["Exporter sans bloquer Premiere/AE", "Traiter des lots de fichiers", "Créer et partager des presets d'export", "Surveiller un dossier (watch folder) pour encoder automatiquement"] },
        { tip: "Slate propose son propre transcodeur ffmpeg et un watch-folder — utile si tu n'as pas la suite Adobe ouverte." },
      ],
    },

    /* ============ ENRICHISSEMENT — LIVRAISON ============ */
    {
      id: "liv-audio",
      category: "livraison",
      title: "Normalisation audio (LUFS)",
      summary: "Livrer un son au bon volume pour chaque plateforme.",
      body: [
        { p: "Le LUFS (Loudness Units Full Scale) mesure le volume perçu. Les plateformes normalisent à une cible : livrer au bon niveau évite qu'elles rabaissent (ou montent) ton mix." },
        { ul: [
          "YouTube : ~ -14 LUFS",
          "Instagram / TikTok : ~ -14 LUFS",
          "Broadcast (EBU R128) : -23 LUFS",
          "Cinéma : référence en dBFS, pas en LUFS.",
        ] },
        { h: "True Peak" },
        { p: "Garde les pics sous -1 dBTP pour éviter la distorsion après ré-encodage." },
        { tip: "Slate peut normaliser l'audio d'un export via ffmpeg. Mesure toujours le LUFS intégré de ta vidéo finale avant livraison." },
      ],
    },
    {
      id: "liv-soustitres",
      category: "livraison",
      title: "Les sous-titres",
      summary: "Formats, incrustés vs fichiers, bonnes pratiques.",
      body: [
        { ul: [
          "Ouverts (burned-in / incrustés) : gravés dans l'image, toujours visibles, non désactivables — pratique pour les réseaux (lecture sans son).",
          "Fermés (fichier .srt / .vtt) : séparés, activables/désactivables, indexables par les plateformes (SEO, accessibilité).",
        ] },
        { h: "Bonnes pratiques" },
        { ul: ["2 lignes maxi, ~42 caractères/ligne", "Durée lisible (au moins ~1 s)", "Contraste et fond léger pour la lisibilité", "Synchro précise avec la parole"] },
        { tip: "Pour les réseaux, incruste des sous-titres stylés : la majorité regarde sans le son. Pour YouTube, fournis aussi un .srt pour l'accessibilité." },
      ],
    },

    /* ============ CHAPITRE 1 — FONDAMENTAUX CAMÉRA ============ */
    {
      id: "fond-priorites",
      category: "tournage",
      title: "Avant la caméra : histoire, son, lumière",
      summary: "Le matériel arrive en dernier — ce qui compte d'abord pour captiver.",
      body: [
        { p: "La caméra n'est pas la principale responsable de la qualité d'un film. Ce que le spectateur retient, c'est l'histoire, pas la fiche technique. Une image parfois sombre ou floue se pardonne si le récit captive." },
        { h: "L'ordre des priorités" },
        { ul: [
          "1. L'histoire : la bonne idée avant tout le reste.",
          "2. Le son : s'il est inaudible, personne ne reste. On pardonne une image imparfaite, pas un mauvais son.",
          "3. La lumière : une scène mal éclairée fait immédiatement amateur.",
          "4. Le matériel : en dernier seulement.",
        ] },
        { p: "Bonus : un micro reste pertinent de longues années, alors qu'une caméra se démode vite (capteurs, codecs…). Investir dans le son est plus durable." },
        { tip: "Une vidéo filmée au smartphone avec un vrai travail de lumière battra une caméra cinéma sans éclairage." },
      ],
    },
    {
      id: "obturation-creative",
      category: "photo",
      title: "La vitesse d'obturation, au-delà du 180°",
      summary: "Jouer avec l'obturateur : action, pause sur image, filé.",
      body: [
        { p: "La vitesse d'obturation fixe la durée d'exposition du capteur et donc le flou de mouvement. En vidéo, le défaut est le double du framerate (1/50 à 25 fps, règle du 180°). Mais on la détourne volontairement pour des effets précis." },
        { h: "Scènes d'action" },
        { p: "Monter à 1/250 fige le mouvement : image nette et nerveuse, débris et gouttes figés. C'est le rendu brutal de la scène de débarquement d'Il faut sauver le soldat Ryan." },
        { h: "Pause sur image" },
        { p: "Pour figer proprement sur un arrêt (ajout d'une voix off, d'un titre), tourne avec un obturateur élevé : l'image gelée restera nette." },
        { h: "Filé & pose longue (photo)" },
        { p: "Obturateur très lent (plusieurs secondes) + appareil fixe : la lumière s'accumule et les sources en mouvement (phares) laissent des traînées." },
        { tip: "En vidéo, reste proche du double du framerate par défaut ; ne change que pour un effet narratif assumé." },
      ],
    },
    {
      id: "iso-natif",
      category: "photo",
      title: "ISO : natif, bruit et dual ISO",
      summary: "Gérer la sensibilité sans dégrader l'image.",
      body: [
        { p: "L'ISO est la sensibilité du capteur. Contrairement au diaph et à l'obturateur (mécaniques), c'est un gain électronique : plus on le monte, plus on force le capteur et plus le bruit (grain numérique) apparaît." },
        { h: "L'ISO natif" },
        { p: "C'est la valeur de base du capteur : elle donne la meilleure plage dynamique et le moins de bruit. Souvent 100 en photo (200 sur d'anciens boîtiers), ou 800 en profil LOG." },
        { h: "Dual base ISO" },
        { p: "Certains capteurs (dont la Sony FX3) ont deux ISO natifs. En basse lumière, basculer sur le second (ex. 12 800) donne une image plus propre que de pousser progressivement depuis le premier." },
        { ul: ["Garde l'ISO le plus bas raisonnable.", "Ne le mets jamais en automatique : le grain est invisible sur un petit moniteur, mauvaise surprise au montage.", "Fais des tests avant chaque tournage — ça évolue selon les boîtiers."] },
        { svg: '<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
            '<polygon points="200,40 60,210 340,210" fill="var(--primary)" opacity="0.14" stroke="var(--primary)" stroke-width="2"/>' +
            '<text x="200" y="135" fill="var(--text-main)" font-size="15" text-anchor="middle" font-weight="bold">EXPOSITION</text>' +
            '<circle cx="200" cy="40" r="6" fill="var(--primary)"/>' +
            '<text x="200" y="26" fill="var(--text-main)" font-size="13" text-anchor="middle" font-weight="bold">OUVERTURE</text>' +
            '<text x="200" y="245" fill="var(--text-dim)" font-size="11" text-anchor="middle">profondeur de champ</text>' +
            '<circle cx="60" cy="210" r="6" fill="var(--primary)"/>' +
            '<text x="52" y="230" fill="var(--text-main)" font-size="13" text-anchor="middle" font-weight="bold">VITESSE</text>' +
            '<text x="36" y="150" fill="var(--text-dim)" font-size="11" text-anchor="middle" transform="rotate(-60 36 150)">flou de mouvement</text>' +
            '<circle cx="340" cy="210" r="6" fill="var(--primary)"/>' +
            '<text x="348" y="230" fill="var(--text-main)" font-size="13" text-anchor="middle" font-weight="bold">ISO</text>' +
            '<text x="364" y="150" fill="var(--text-dim)" font-size="11" text-anchor="middle" transform="rotate(60 364 150)">bruit / grain</text>' +
            '</svg>',
          caption: "Le triangle d exposition : trois reglages a equilibrer, chacun avec son effet creatif." },
        { tip: "Monter les ISO réduit aussi la plage dynamique : sur une scène très contrastée, baisse-les au maximum sans sous-exposer." },
      ],
    },
    {
      id: "dynamic-range",
      category: "tournage",
      title: "La plage dynamique (dynamic range)",
      summary: "L'écart entre les ombres et les hautes lumières qu'un capteur enregistre.",
      body: [
        { p: "La plage dynamique est la différence entre le ton le plus sombre et le plus clair qu'un capteur peut capter sans perdre de détail. Elle se mesure en EV (aussi appelés stops ou diaphragmes)." },
        { ul: [
          "1 EV = un doublement de la quantité de lumière.",
          "Œil humain : environ 24 EV.",
          "Bonnes caméras actuelles : 12 à 15 EV (l'écart se resserre chaque année).",
        ] },
        { h: "Convertir des dB en EV" },
        { p: "Certaines marques annoncent la dynamique en décibels. Divise par 6 pour obtenir des EV : 66 dB = 11 EV. (Un convertisseur est disponible dans Tournage → Calculatrices.)" },
        { h: "Préserver sa dynamique" },
        { ul: ["Préférer un grand capteur (plein format encaisse mieux).", "Garder les ISO bas.", "Tourner en profil LOG."] },
        { tip: "Côté photo, la technique HDR fusionne plusieurs expositions (bracketing) pour couvrir une dynamique que le capteur ne tient pas en une prise." },
      ],
    },
    {
      id: "profil-image",
      category: "tournage",
      title: "Profil d'image : standard, neutre ou LOG",
      summary: "Choisir comment la caméra enregistre contraste et couleurs.",
      body: [
        { p: "Le profil d'image est un préréglage de contraste, couleur, saturation et netteté appliqué à l'enregistrement. Une fois choisi, ces réglages sont « cuits » dans l'image (sauf en RAW) : impossible de revenir dessus comme on le ferait avec un fichier brut." },
        { ul: [
          "Standard : contrasté et saturé. Joli directement, mais difficile à étalonner. Pour livrer vite sans post.",
          "Neutre : plus plat, un peu plus de latitude.",
          "LOG : le plus plat, dynamique maximale, à étalonner obligatoirement. Le meilleur choix pour garder le contrôle.",
        ] },
        { h: "Pas de LOG ? Règle un profil neutre" },
        { ul: ["Contraste au minimum (éviter noirs bouchés / blancs brûlés).", "Netteté au minimum (rendu plus cinéma).", "Saturation deux crans en dessous.", "Ne touche pas à la teinte (couleurs faussées)."] },
        { tip: "Une image plate et grise au tournage est normale en neutre/LOG : tout se récupère à l'étalonnage." },
      ],
    },
    {
      id: "bits-couleur",
      category: "tournage",
      title: "8 bits vs 10 bits (profondeur de couleur)",
      summary: "Le nombre de nuances enregistrées par canal — crucial en LOG.",
      body: [
        { p: "La profondeur de couleur est le nombre de nuances disponibles par sous-pixel rouge, vert et bleu (RVB)." },
        { ul: [
          "8 bits : 256 nuances par canal → 256³ ≈ 16 millions de couleurs.",
          "10 bits : 1024 nuances par canal → 1024³ ≈ 1,07 milliard de couleurs.",
        ] },
        { p: "Le 10 bits offre des dégradés bien plus fins, un meilleur étalonnage et un fond vert plus facile à détourer. C'est particulièrement important en LOG, où l'on étire fortement l'image en post." },
        { tip: "Si ta caméra le permet, privilégie le 10 bits 4:2:2 — surtout dès que tu tournes en LOG." },
      ],
    },
    {
      id: "ralenti",
      category: "tournage",
      title: "Tourner au ralenti",
      summary: "Capturer plus d'images/seconde proprement.",
      body: [
        { p: "À partir de 50 img/s on obtient un ralenti (×2 en 25 fps). Pour des mouvements très rapides, on monte à 100 ou 120 img/s. L'obturation suit toujours (le double du framerate)." },
        { h: "Trois réflexes" },
        { ul: [
          "Plus de lumière : l'obturation plus rapide laisse entrer moins de lumière — prévois de la puissance, surtout en intérieur/nuit.",
          "Avec parcimonie : le ralenti doit servir le récit (coup de foudre, malaise…), pas être systématique.",
          "Vérifie le débit : si le bitrate ne suit pas la hausse de cadence, la qualité chute. Et il faut une carte assez rapide (voir Matériel).",
        ] },
        { tip: "Choisis la cadence selon la vitesse du sujet : 50-60 fps pour un mouvement humain, 100-120 fps pour un objet très rapide." },
      ],
    },

    /* ---- Matériel ---- */
    {
      id: "mat-trepied",
      category: "materiel",
      title: "Choisir son trépied et sa tête fluide",
      summary: "Stabilité et fluidité : les deux seuls vrais critères.",
      body: [
        { p: "Un trépied se compose des jambes et de la tête (rotule). Deux critères priment : la stabilité et la fluidité des mouvements." },
        { h: "À vérifier avant d'acheter" },
        { ul: [
          "Éviter les colonnes centrales réglables : elles vibrent et fragilisent (aucun trépied pro n'en a). Pour de la hauteur, prends des jambes plus longues.",
          "Préférer la fibre de carbone à l'aluminium : amortissement bien plus court, donc moins de vibrations.",
          "Vérifier la charge max : additionne caméra + objectif le plus lourd + accessoires, et garde de la marge.",
        ] },
        { h: "La tête fluide" },
        { p: "Elle donne des panoramiques/tilts fluides ; les modèles avancés ont un contrepoids réglable. La fixation à bol (boule) se met à niveau facilement — standard au cinéma — contrairement au disque plat." },
        { tip: "Un trépied léger n'est pas forcément meilleur : vise stabilité + tête fluide avant le poids." },
      ],
    },
    {
      id: "mat-stable",
      category: "materiel",
      title: "Stabiliser sans trépied (épaule & à main levée)",
      summary: "Des points d'appui pour une image qui ne tremble pas.",
      body: [
        { h: "À l'épaule (épaulière)" },
        { p: "L'épaulière ajoute un troisième point d'appui en plus des deux mains : la caméra suit le corps. Vise l'équilibre (tu ne dois pas porter le poids avec les bras), le confort, et l'ajustabilité pour monter micro/moniteur." },
        { h: "À main levée" },
        { ul: [
          "Cadre à deux mains, poids réparti.",
          "Ajoute du poids : plus lourd = plus stable (ton trépied replié tenu en hauteur, par ex.).",
          "Tends une sangle autour de la nuque, caméra au bout.",
          "Appuie tes coudes sur un objet fixe ou sur tes hanches.",
          "Évite le zoom (le moindre tremblement est amplifié) : rapproche-toi.",
        ] },
        { tip: "Un léger tremblement se corrige en post, mais le stabilisateur recadre et zoome : tourne un peu plus large et dans la meilleure définition." },
      ],
    },
    {
      id: "mat-carte",
      category: "materiel",
      title: "Choisir et lire une carte mémoire",
      summary: "Capacité, et surtout vitesse d'écriture minimale.",
      body: [
        { h: "Les types" },
        { ul: [
          "SD : les plus répandues (SDHC 4–32 Go, SDXC >32 Go à 2 To).",
          "CF (CompactFlash / CFexpress) : rapides et robustes, sur les boîtiers haut de gamme.",
          "microSD : drones, action-cams, smartphones.",
        ] },
        { h: "Ce qui compte vraiment" },
        { ul: [
          "Capacité : mieux vaut plusieurs cartes moyennes (ex. 64 Go) qu'une énorme — moins risqué en cas de perte ou de corruption.",
          "Vitesse d'ÉCRITURE minimale (pas la vitesse de lecture, plus vendeuse mais inutile ici) : c'est le débit soutenu qui garantit l'enregistrement.",
        ] },
        { h: "Lire les classes" },
        { p: "Un chiffre dans un « C » (Class), dans un « U » (UHS) ou précédé d'un « V » (Video Speed) indique le débit d'écriture minimal garanti." },
        { tip: "En 4K, haut débit ou ralenti, une carte trop lente sature et coupe l'enregistrement. Le débit requis monte avec la résolution et la cadence." },
      ],
    },
    {
      id: "mat-accessoires",
      category: "materiel",
      title: "Les accessoires caméra essentiels",
      summary: "Ce qui fait vraiment la différence autour du boîtier.",
      body: [
        { ul: [
          "Micro externe : indispensable — n'utilise jamais le micro interne, de mauvaise qualité.",
          "Viseur / loupe : juger l'exposition et la netteté en plein soleil, là où le moniteur trompe.",
          "Filtres : ND (réduire la lumière pour garder l'obturation ciné), polarisant (supprimer les reflets), diffusion (adoucir l'image).",
          "Matte box : pare-soleil anti-flare + porte-filtres (accessoire avancé).",
          "Follow focus : déporter la mise au point, avec repères, pour des points précis sans faire trembler l'objectif.",
        ] },
        { tip: "Priorités quand on débute : un bon micro, un trépied stable et un filtre ND. Le reste viendra ensuite." },
      ],
    },

    /* ============ CHAPITRE 2 — LES OBJECTIFS ============ */
    {
      id: "mat-camera-objectif",
      category: "materiel",
      title: "Caméra ou objectif : où investir ?",
      summary: "Un bon objectif est un meilleur investissement que le boîtier.",
      body: [
        { p: "Un bon objectif coûte souvent plus cher que le boîtier — et c'est normal. Sur la durée, l'optique est le meilleur placement." },
        { ul: [
          "Les caméras se démodent vite (nouveaux capteurs, formats 4K/6K/8K…).",
          "Le verre, lui, ne vieillit quasiment pas : des optiques vintage de 40 ans servent encore.",
          "Un objectif s'adapte à plusieurs boîtiers (au besoin via une bague type Metabones).",
          "Il se revend facilement en conservant sa valeur, contrairement au boîtier.",
        ] },
        { p: "Beaucoup de vidéastes louent la caméra mais achètent leurs objectifs." },
        { tip: "Mieux vaut un boîtier modeste avec de bonnes optiques que l'inverse. Et fuis les packs « appareil + objectif » de grande surface (optiques médiocres)." },
      ],
    },
    {
      id: "mat-capteur-crop",
      category: "materiel",
      title: "Taille de capteur & crop factor",
      summary: "Pourquoi une même focale ne cadre pas pareil selon le capteur.",
      body: [
        { p: "Le cadrage obtenu avec une focale dépend de la taille du capteur : un 50 mm ne donne pas le même angle sur un plein format et sur un capteur plus petit." },
        { h: "Les tailles courantes" },
        { ul: [
          "Plein format : 24×36 mm (comme la pellicule 35 mm). Référence en vidéo.",
          "APS-C : ~15×23 mm, crop ×1,5 (×1,6 chez Canon).",
          "Micro 4/3 : crop ×2. 1 pouce, 1/2,3 (GoPro/drones), etc. : encore plus petits.",
        ] },
        { h: "Le crop factor" },
        { p: "Un capteur plus petit ne capte que la partie centrale de l'image projetée → effet de « zoom ». Un 50 mm sur APS-C cadre comme un ~75-80 mm en plein format." },
        { ul: [
          "La focale reste la focale : la profondeur de champ d'un 50 mm ne change pas avec le capteur, seul le cadrage change.",
          "Un objectif plein format fonctionne sur APS-C ; l'inverse n'est pas toujours vrai.",
          "Beaucoup de boîtiers plein format ont un mode APS-C pour « zoomer » sans changer d'objectif.",
        ] },
        { tip: "Multiplie la focale par le crop factor pour l'équivalent plein format (calculateur dans Tournage → Calculatrices)." },
      ],
    },
    {
      id: "mat-zoom-fixe",
      category: "materiel",
      title: "Zoom ou focale fixe ?",
      summary: "Les forces de chaque famille d'objectifs.",
      body: [
        { h: "Le zoom (focale variable)" },
        { ul: [
          "Polyvalent : change de cadrage sans bouger ni changer d'objectif.",
          "Plus léger qu'une série de fixes (un 70-200 couvre 85, 100, 135, 200 mm).",
          "Économique : un seul zoom remplace plusieurs fixes.",
        ] },
        { p: "Si tu n'en prends qu'un : un 24-70 f/2.8. Évite les zooms à ouverture variable (f/3.5-5.6) : pénibles à exposer — privilégie une ouverture constante." },
        { h: "La focale fixe (prime)" },
        { ul: [
          "Grande ouverture abordable (f/1.8, f/1.4) : excellente en basse lumière.",
          "Flou d'arrière-plan (bokeh) plus facile à obtenir.",
          "Meilleure qualité optique : moins d'aberrations, plus de piqué.",
        ] },
        { tip: "Le marché de l'occasion regorge d'optiques de qualité : comme les objectifs gardent leur valeur, c'est peu risqué." },
      ],
    },
    {
      id: "mat-optiques-cinema",
      category: "materiel",
      title: "Objectifs photo vs cinéma (T-stops)",
      summary: "Ce qui distingue une optique ciné d'une optique photo.",
      body: [
        { ul: [
          "Diaphragme en T : la valeur T mesure la lumière réelle qui passe (plus précise que le f/) et se règle en continu, sans à-coup d'exposition pendant la prise.",
          "Bagues crantées : pour fixer un follow focus, avec une grande course de point et des butées physiques (vs les bagues sans fin des objectifs AF).",
          "Fabrication standardisée : même diamètre, poids et design dans une série → changements d'objectif rapides et colorimétrie constante entre les plans.",
        ] },
        { tip: "Les optiques ciné sont chères ; en vidéaste, des focales fixes photo + un follow focus couvrent déjà beaucoup de besoins." },
      ],
    },
    {
      id: "mat-objectifs-speciaux",
      category: "materiel",
      title: "Objectifs spéciaux : fish-eye, macro, tilt-shift",
      summary: "Trois optiques aux effets très particuliers.",
      body: [
        { ul: [
          "Fish-eye : ultra grand-angle à distorsion extrême (image hémisphérique). Pour exprimer la désorientation d'un personnage ou une vue subjective.",
          "Macro : grossissement jusqu'à 1:1 (le sujet se projette à sa taille réelle sur le capteur) et mise au point très rapprochée — détails, insectes, textures.",
          "Tilt-shift : la bascule (tilt) permet un flou sélectif et l'effet « maquette » ; le décentrement (shift) corrige les perspectives (architecture).",
        ] },
        { tip: "Bidouille macro : retourne un 35-50 mm face au capteur (fixé au gaffer) ou place une simple loupe devant l'objectif." },
      ],
    },
    {
      id: "mat-anamorphique",
      category: "materiel",
      title: "Les objectifs anamorphiques",
      summary: "Le secret du look « cinémascope » très large.",
      body: [
        { p: "Hérités du CinemaScope (années 1950), ils compressent l'image horizontalement (souvent ×2) au tournage ; on la ré-étire en post pour obtenir un format très large (2.35)." },
        { h: "Leur signature visuelle" },
        { ul: [
          "Flare horizontal (traits bleutés) sur les sources lumineuses.",
          "Bokeh de forme ovale.",
          "Rendu plus « cinéma » : à cadrage égal, profondeur de champ plus marquée (on utilise une focale plus longue).",
        ] },
        { tip: "Bidouille du flare anamorphique : tends un bout de fil de pêche devant l'objectif (coloré au marqueur pour un flare teinté)." },
      ],
    },
    {
      id: "mat-filtres",
      category: "materiel",
      title: "Les filtres d'objectif (ND, polarisant, UV)",
      summary: "Trois filtres qui changent vraiment l'image.",
      body: [
        { p: "Avant d'acheter, vérifie le diamètre de ton objectif (indiqué par le sigle ø). Une bague d'adaptation permet de monter un filtre plus grand sur un objectif plus petit, pas l'inverse." },
        { ul: [
          "ND (densité neutre) : réduit la lumière sans toucher au diaph, à l'obturateur ni à l'ISO — idéal pour garder une grande ouverture en plein jour. ND2 = 1 diaph, ND4 = 2 diaphs, etc. Les ND variables (deux bagues) sont rapides mais peuvent teinter l'image.",
          "Polarisant : supprime les reflets (eau, verre, pare-brise) et assombrit le ciel. Coûte 1 à 2 diaphs : à éviter en basse lumière.",
          "UV / neutre : incolore, sert surtout à protéger l'optique (rayures, poussière). On le laisse souvent vissé en permanence.",
        ] },
        { tip: "Les filtres vissants ne se superposent pas : pour empiler plusieurs filtres, il faut une matte box à porte-filtres." },
      ],
    },
    {
      id: "mat-sigles",
      category: "materiel",
      title: "Décoder les sigles d'objectifs",
      summary: "Montures, autofocus, stabilisation, gammes pro.",
      body: [
        { h: "Montures (vérifie la compatibilité avec ton boîtier)" },
        { ul: [
          "Canon : EF (plein format) / EF-S (APS-C).",
          "Nikon : FX (plein format) / DX (APS-C).",
          "Sony : FE (plein format) / E (APS-C).",
          "Sigma : DG / DC — Tamron : Di / Di-II.",
        ] },
        { h: "Autofocus (type de moteur)" },
        { p: "USM / STM (Canon), AF-S/SWM (Nikon), HSM (Sigma), SSM (Sony), USD/PZD (Tamron)." },
        { h: "Stabilisation optique" },
        { p: "IS (Canon), VR (Nikon), OSS (Sony), OS (Sigma), VC (Tamron), OIS (Panasonic)." },
        { h: "Gammes haut de gamme" },
        { ul: ["Canon « L » (liseré rouge), Sony « G / GM », Sigma « Art », Nikon (liseré doré)."] },
        { tip: "Une bague d'adaptation (type Metabones) peut monter une autre monture, mais l'autofocus ou le diaph électronique ne passent pas toujours." },
      ],
    },
    {
      id: "focale-emotion",
      category: "photo",
      title: "Choisir sa focale pour l'émotion",
      summary: "La focale change l'impact psychologique, pas seulement le cadrage.",
      body: [
        { p: "Un gros plan au 24 mm ne raconte pas la même chose qu'au 135 mm. La focale est un outil de mise en scène." },
        { h: "Grand-angle" },
        { ul: [
          "Agrandit l'espace : les sujets paraissent distants (ex. le face-à-face de Drive).",
          "Exagère le mouvement : un objet grossit vite en approchant → sensation de vitesse.",
          "Déforme les visages vus de près (nez proéminent) — utilisé pour la désorientation (Las Vegas Parano).",
          "Caméra proche = spectateur plongé dans l'intimité de la scène.",
        ] },
        { h: "Téléobjectif" },
        { ul: [
          "Compresse la perspective : rapproche les personnages, crée l'intimité.",
          "Donne une sensation de distance / de voyeurisme (comme si on espionnait).",
        ] },
        { tip: "À cadrage identique, le grand-angle inclut le spectateur dans la scène, le télé l'en fait sortir." },
      ],
    },
    {
      id: "effet-cinema",
      category: "photo",
      title: "L'effet cinéma (flou d'arrière-plan)",
      summary: "Obtenir en pratique le fond flou qui détache le sujet.",
      body: [
        { p: "Le fond flou caractéristique du cinéma vient d'une faible profondeur de champ (à l'opposé de l'image nette partout, très « télé »)." },
        { h: "Comment l'obtenir" },
        { ul: [
          "Grande ouverture (petit f/ : f/1.8–f/2.8) — le levier principal.",
          "Longue focale : à cadrage égal, un téléobjectif floute plus qu'un grand-angle.",
          "Sujet proche de la caméra et éloigné du fond.",
          "Grand capteur.",
        ] },
        { h: "Garder une grande ouverture en plein jour" },
        { ul: [
          "Option médiocre : monter l'obturateur — on perd le flou de mouvement ciné, l'image devient très « télé ».",
          "Bonne option : un filtre ND, qui réduit la lumière sans toucher à l'ouverture.",
        ] },
        { tip: "La « bidouille du zoom » (reculer + zoomer) compresse aussi le fond, mais déplace la caméra : joue plutôt sur le diaph et un ND." },
      ],
    },

    /* ============ CHAPITRE 3 — LE SON ============ */
    {
      id: "son-techno",
      category: "son",
      title: "Micro dynamique vs statique",
      summary: "Les deux grandes technologies de micro et l'alimentation phantom.",
      body: [
        { p: "Un micro transforme les ondes sonores en signal électrique via une membrane. Deux technologies principales existent." },
        { h: "Dynamique" },
        { p: "Pas besoin d'alimentation, peu sensible : il encaisse les sons très forts (concert, explosion) sans saturer, mais son rapport signal/bruit est médiocre. Robuste et abordable — idéal concert, plateau TV, micro-trottoir." },
        { h: "Statique (à condensateur)" },
        { p: "Haute sensibilité, excellent rapport signal/bruit : restitution fidèle, c'est le micro du tournage et du studio. Fragile (craint l'humidité), plus cher, et sensible au Larsen (sifflement de boucle)." },
        { h: "Alimentation phantom (+48 V)" },
        { p: "Les micros statiques doivent être alimentés — par la caméra ou l'enregistreur, via le câble XLR (indication « +48V »). Les dynamiques n'en ont pas besoin." },
        { tip: "En tournage de fiction, on travaille quasiment toujours avec des micros statiques (perche, cravate)." },
      ],
    },
    {
      id: "son-modeles",
      category: "son",
      title: "Les types de micro",
      summary: "Perche, cravate, studio, main : lequel pour quoi.",
      body: [
        { ul: [
          "Micro-perche (canon / shotgun) : le plus utilisé en tournage pour les dialogues. Statique, très directif, alimenté (XLR). Plus il est long, plus il est directif.",
          "Micro-cravate (lavalier) : accroché au vêtement vers la poitrine ; invisible s'il est bien placé. Souvent en HF (sans fil).",
          "Micro studio : large membrane pour capter le détail d'une voix/instrument. À utiliser avec un filtre anti-pop. Prise XLR ou USB.",
          "Micro-main : quasi toujours dynamique (concert, micro-trottoir, animation TV). Peu discret, rare en fiction.",
        ] },
        { tip: "Pour un dialogue, la perche donne le son le plus naturel ; la cravate HF sécurise et rattrape la présence de la voix." },
      ],
    },
    {
      id: "son-directivite",
      category: "son",
      title: "La directivité",
      summary: "La zone dans laquelle le micro capte le mieux.",
      body: [
        { p: "La directivité décrit la sensibilité du micro selon la direction de la source." },
        { ul: [
          "Cardioïde : capte l'avant (~130°). La plus répandue, bien pour le chant.",
          "Hypercardioïde : plus étroit (~115°), capte un peu l'arrière. Bon compromis polyvalent.",
          "Canon : très directif (~105°), pour la perche : vise la voix et isole des bruits parasites.",
          "Omnidirectionnel : capte à 360°, pour les ambiances.",
          "Bidirectionnel : avant + arrière (voix + réverbération d'une pièce).",
        ] },
        { svg: '<svg viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
            '<circle cx="70" cy="95" r="42" fill="var(--primary)" opacity="0.28" stroke="var(--primary)" stroke-width="2"/>' +
            '<circle cx="70" cy="95" r="5" fill="var(--text-main)"/>' +
            '<text x="70" y="168" fill="var(--text-dim)" font-size="12" text-anchor="middle">OMNI (360)</text>' +
            '<path d="M200,120 C155,120 150,55 200,48 C250,55 245,120 200,120 Z" fill="var(--primary)" opacity="0.32" stroke="var(--primary)" stroke-width="2"/>' +
            '<circle cx="200" cy="112" r="5" fill="var(--text-main)"/>' +
            '<text x="200" y="168" fill="var(--text-dim)" font-size="12" text-anchor="middle">CARDIO (avant)</text>' +
            '<path d="M330,95 C298,95 298,52 330,48 C362,52 362,95 330,95 C298,95 298,138 330,142 C362,138 362,95 330,95 Z" fill="var(--secondary)" opacity="0.3" stroke="var(--secondary)" stroke-width="2"/>' +
            '<circle cx="330" cy="95" r="5" fill="var(--text-main)"/>' +
            '<text x="330" y="168" fill="var(--text-dim)" font-size="12" text-anchor="middle">FIGURE 8</text>' +
            '</svg>',
          caption: "Zone de captation vue de dessus : omni capte partout, cardio surtout l avant, figure-8 avant et arriere." },
        { tip: "Si tu ne dois en choisir qu'un, prends un hypercardioïde : bon équilibre entre directivité et facilité." },
      ],
    },
    {
      id: "son-hf",
      category: "son",
      title: "Les micros HF (sans fil)",
      summary: "Libérer les comédiens du câble et sécuriser la prise.",
      body: [
        { p: "Un système HF = un émetteur (dans la poche du comédien, relié à une cravate) et un récepteur (sur la caméra ou la mixette). Il permet de capter là où la perche ne peut pas (voiture, plan large)." },
        { ul: [
          "Avec plusieurs HF, utilise des fréquences différentes pour éviter le brouillage.",
          "Colle une pastille de couleur sur chaque duo émetteur/récepteur pour les reconnaître vite.",
          "Placement : au milieu de la poitrine (ni trop près de la gorge, sinon étouffé).",
          "Fixation : évite le scotch (bruit au décollement) ; préfère le butyle (pâte collante stable).",
        ] },
        { tip: "Le HF seul sonne souvent étouffé (on entend surtout les graves) : les ingé son le doublent avec la perche, plus naturelle." },
      ],
    },
    {
      id: "son-perche",
      category: "son",
      title: "Percher le son",
      summary: "La position du micro fait la qualité de la prise.",
      body: [
        { p: "La perche (fibre de carbone, légère) permet d'approcher le micro au plus près sans entrer dans le cadre. Enroule le câble autour pour qu'il ne pende pas." },
        { ul: [
          "Perche par le haut : on laisse moins d'air au-dessus des têtes, et le canon vise le sol (évite les bruits des projecteurs).",
          "Incline le micro à ~45° vers la bouche pour capter tout le timbre de la voix.",
          "Sois « bord cadre » : au plus près de l'image sans y entrer (un repère adhésif blanc sur la bonnette aide de nuit).",
          "Vérifie les ombres de perche sur le visage ou le décor avant de tourner.",
        ] },
        { tip: "Percher par le bas donne une voix moins naturelle et récupère la réverbération du plafond." },
      ],
    },
    {
      id: "son-protection",
      category: "son",
      title: "Protéger son micro du vent",
      summary: "Bonnettes et suspension selon les conditions.",
      body: [
        { ul: [
          "Bonnette mousse : protection de base (intérieur, vent faible, bruits de déplacement). À éviter dehors.",
          "Bonnette à poils longs (« moumoute ») : bon rapport qualité/prix, résiste au vent moyen.",
          "Bonnette à cage (blimp) : haut de gamme, pour les vents forts — micro désolidarisé dans une cage à fourrure.",
        ] },
        { h: "La suspension" },
        { p: "Elle amortit les chocs, vibrations et bruits de main transmis par la perche. Indispensable avec un micro statique (voir la bidouille pour en fabriquer une)." },
        { tip: "Le vent est un problème même en intérieur si les mouvements de perche sont rapides." },
      ],
    },
    {
      id: "son-connectique",
      category: "son",
      title: "Connectiques audio",
      summary: "Symétrique vs asymétrique : XLR, jack, RCA, minijack.",
      body: [
        { p: "Un câble symétrique résiste bien aux interférences (plus il est long, plus c'est important). C'est la référence pro." },
        { ul: [
          "XLR : symétrique, verrouillable — le standard pro universel des micros.",
          "Jack 6,35 mm : asymétrique, casques et certains micros.",
          "Minijack 3,5 mm : sur smartphones et appareils photo, pratique mais fragile.",
          "RCA : asymétrique, connexions « line » du matériel grand public.",
        ] },
        { tip: "N'enroule jamais un câble autour du bras : tu le vrilles et l'abîmes. Apprends l'enroulement en « 8 »." },
      ],
    },
    {
      id: "son-prises",
      category: "son",
      title: "Les 3 façons de capter le son",
      summary: "Micro interne, micro externe, ou enregistreur dédié.",
      body: [
        { ul: [
          "Micro interne : à bannir — mauvaise qualité, capte les bruits de la caméra (AF, ventilateur), oblige à rester près du sujet. Sert seulement de son témoin pour la synchro.",
          "Micro externe sur la caméra : meilleure qualité, synchro automatique, mais le placement dépend de la caméra et on est limité à une piste.",
          "Enregistreur externe : la méthode pro. Son indépendant de la caméra → comédiens libres, plusieurs pistes séparées, meilleur préampli.",
        ] },
        { tip: "Même avec un enregistreur séparé, garde le son de la caméra : il sert de référence pour recaler par forme d'onde." },
      ],
    },
    {
      id: "son-enregistreur",
      category: "son",
      title: "Choisir et utiliser un enregistreur",
      summary: "L'enregistreur de poche, du choix au placement.",
      body: [
        { h: "Choisir" },
        { ul: [
          "Nombre de pistes : un par source à isoler (débuter = 2, ex. perche + cravate). Certains vont à 8 entrées.",
          "Connectiques : privilégie les entrées XLR (+ alimentation phantom pour les micros statiques).",
          "Fonctions utiles : pré-enregistrement (les secondes avant l'appui REC) et piste de secours (-12 dB, anti-saturation).",
        ] },
        { h: "Le placer" },
        { p: "Sur la caméra (solo), au bout d'une perche, ou relié à la mixette de l'ingé son. Les enregistreurs de poche (Zoom H5/H6, Tascam…) offrent un son pro pour une centaine d'euros." },
        { tip: "Branche tes HF et ta perche sur l'enregistreur pour tout centraliser et surveiller la courbe audio pendant la prise." },
      ],
    },
    {
      id: "son-reglages",
      category: "son",
      title: "Régler ses niveaux (dBFS, WAV, 48 kHz)",
      summary: "Les paramètres d'une bonne prise numérique.",
      body: [
        { h: "Le niveau (dBFS)" },
        { p: "0 dBFS = saturation irrécupérable : n'y touche jamais. Vise une voix moyenne vers -18 dBFS, avec des pics entre -12 et -24 dBFS pour garder de la marge." },
        { h: "Le format" },
        { p: "Choisis le WAV (sans perte), pas le MP3 (compressé, avec perte)." },
        { h: "Taux d'échantillonnage & bitrate" },
        { ul: [
          "Taux : 48 kHz pour la vidéo (44,1 kHz = standard CD).",
          "Profondeur : 24 bits si possible (fichiers plus lourds mais plus fidèles ; 16 bits acceptable).",
          "Repère : cinéma 48 kHz / 24 bits, YouTube 48 kHz / 16 bits.",
        ] },
        { tip: "Ne confonds pas dBFS (niveau numérique avant saturation) et dB(A) (intensité perçue). +3 dB(A) ≈ deux fois plus fort à l'oreille." },
      ],
    },
    {
      id: "son-clap",
      category: "son",
      title: "Le clap : identifier & synchroniser",
      summary: "Le petit objet qui sauve le montage.",
      body: [
        { h: "Deux rôles" },
        { ul: [
          "Identifier : numéro de séquence/plan, prise, date… pour que le monteur s'y retrouve.",
          "Synchroniser : le claquement sec crée un pic audio net que l'on aligne sur l'image du clap qui se ferme.",
        ] },
        { h: "Le langage du clap" },
        { ul: [
          "On annonce « 23 sur 3, première » (séq. 23, plan 3, prise 1).",
          "MOS / Muet / M : plan sans son (clap présenté fermé).",
          "PU = pick-up (partie d'un plan), R = retake (prise refaite).",
        ] },
        { tip: "Sans clap, vingt heures de rushes d'Amazing Grace sont restées 46 ans impossibles à synchroniser. Slate intègre un clap numérique dans l'onglet Tournage." },
      ],
    },
    {
      id: "son-conseils",
      category: "son",
      title: "Bonnes pratiques son au tournage",
      summary: "Les réflexes qui font gagner des heures au montage.",
      body: [
        { h: "Enregistre des sons seuls" },
        { p: "À chaque fin de scène, capte l'ambiance du lieu (room tone) et des bruits utiles (porte, pas…) : ils ont la bonne acoustique, contrairement à un son téléchargé, et comblent les vides au montage." },
        { h: "Évite le chevauchement" },
        { p: "Demande aux comédiens de marquer un temps entre les répliques (surtout hors-champ) pour pouvoir couper proprement. Attends la fin de la réverbération avant de couper." },
        { ul: [
          "Supprime les bruits qu'on ne voit pas (vaisselle mimée, etc.).",
          "Pose de la moquette / des ronds de feutre pour étouffer pas et grincements hors-champ.",
          "Écoute avec un casque fermé et neutre (pas d'écouteurs qui boostent les basses).",
          "Repère les décors au casque : une clim inaudible à l'oreille peut hurler dans le micro.",
        ] },
        { tip: "Le réalisateur, le chef op et l'ingé son peuvent couper une prise : en cas de bruit parasite (klaxon, avion), refais-la, tu le regretterais au montage." },
      ],
    },

    /* ============ CHAPITRE 4 — ÉCLAIRER UNE SCÈNE ============ */
    {
      id: "lum-balance-blancs",
      category: "lumiere",
      title: "La balance des blancs (réglage caméra)",
      summary: "Caler la caméra sur la température de ta lumière.",
      body: [
        { p: "La teinte du blanc change selon la lumière (bleutée au soleil, orangée sous une lampe). Notre œil corrige automatiquement, pas la caméra : la balance des blancs sert à lui indiquer ce qui doit paraître blanc." },
        { svg: '<svg viewBox="0 0 340 80" xmlns="http://www.w3.org/2000/svg" role="img"><defs><linearGradient id="kelv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff8a33"/><stop offset="0.3" stop-color="#ffd9a0"/><stop offset="0.5" stop-color="#ffffff"/><stop offset="0.75" stop-color="#cfe3ff"/><stop offset="1" stop-color="#8fb6ff"/></linearGradient></defs><rect x="14" y="12" width="312" height="22" rx="4" fill="url(#kelv)"/><g font-size="10" fill="var(--text-main)" text-anchor="middle"><text x="45" y="52">1900 K</text><text x="45" y="66">Bougie</text><text x="130" y="52">3200 K</text><text x="130" y="66">Tungstène</text><text x="215" y="52">5600 K</text><text x="215" y="66">Soleil</text><text x="300" y="52">7500 K</text><text x="300" y="66">Nuageux</text></g></svg>', caption: "L'échelle de température de couleur, en kelvins." },
        { h: "Les deux repères" },
        { ul: ["5600 K : lumière du jour / soleil (symbole soleil).", "3200 K : lumière artificielle / tungstène (symbole ampoule).", "Autres préréglages : nuageux ~6000 K, ombre ~7000 K, fluo ~4400 K, personnalisé 2000–10000 K."] },
        { p: "N'utilise jamais le mode automatique : la caméra fait la moyenne des couleurs et la teinte change à chaque cadrage. Cale une valeur fixe et garde-la pour toute la séquence." },
        { tip: "Une BdB juste donne une image neutre et facilite les raccords à l'étalonnage." },
      ],
    },
    {
      id: "lum-gelatines",
      category: "lumiere",
      title: "Les gélatines",
      summary: "Corriger la température ou colorer un projecteur.",
      body: [
        { p: "Les gélatines sont des feuilles colorées fixées sur les volets du projecteur avec des pinces en bois ou métal (jamais plastique : ça fond ; jamais de scotch). Elles existent en puissances full, 1/2, 1/4, 1/8." },
        { ul: [
          "CTO (orange) : réchauffe — transforme un 5600 K en ~3200 K.",
          "CTB (bleu) : refroidit — transforme un 3200 K en ~5600 K.",
          "Correcteur de teinte : minus green (magenta) contre le vert d'un vieux tube, plus green à l'inverse.",
          "ND : réduit l'intensité (ND3 = -1 diaph, ND6 = -2…) sans changer la couleur.",
          "Effet : couleurs franches (gyrophare bleu/rouge, ambiance verte…).",
        ] },
        { tip: "Les gélatines sont la meilleure solution pour harmoniser des projecteurs de températures différentes sans tout rattraper à l'étalonnage." },
      ],
    },
    {
      id: "lum-sources",
      category: "lumiere",
      title: "Les sources de lumière",
      summary: "Tungstène, HMI, fluo, LED : forces et contraintes.",
      body: [
        { ul: [
          "Tungstène / halogène : 3200 K, abordable, température stable. Mais chauffe énormément et consomme beaucoup (gants obligatoires).",
          "HMI : 5600 K, très lumineux et peu gourmand, mais cher, émet des UV (verre de protection) et nécessite un ballast. Peut « flicker » (scintiller) à obturation élevée.",
          "Fluorescent (Kino Flo) : doux (grande surface), peu gourmand, mais peut virer vert/magenta en vieillissant.",
          "LED : polyvalent (3200/5600 K réglable, parfois RVB), dimmable, léger, sur batterie, longue durée. Attention à la qualité colorimétrique.",
        ] },
        { h: "L'IRC (indice de rendu des couleurs)" },
        { p: "De 0 à 100 (100 = lumière du jour), il mesure la fidélité des couleurs d'une source. Vise un IRC > 85-90, surtout pour les LED bon marché qui peuvent fausser les teintes." },
        { tip: "En débutant : une LED bi-couleur à bon IRC est le choix le plus souple (pas de ballast, pas de chaleur, alimentable sur batterie)." },
      ],
    },
    {
      id: "lum-electricite",
      category: "lumiere",
      title: "La puissance électrique sur un tournage",
      summary: "Ne pas faire sauter les plombs avec ses projecteurs.",
      body: [
        { p: "Puissance (watts) = Tension (volts) × Intensité (ampères). En Europe la tension est de 220 V. Chaque prise dépend d'un disjoncteur avec son ampérage (10 A, 16 A…)." },
        { h: "Calcul" },
        { p: "Sur un circuit 16 A : 220 × 16 = 3520 W disponibles. Un projecteur « Mandarine » tungstène tire ~800 W → environ 4 sur ce circuit. (Calculateur dans Tournage → Calculatrices.)" },
        { h: "Si ça disjoncte" },
        { ul: ["Répartis les projecteurs sur des prises de circuits différents (vérifie qu'elles ne dépendent pas du même disjoncteur).", "Ou branche-toi sur un circuit à l'ampérage plus élevé.", "En extérieur sans prise : un groupe électrogène (bruyant → à éloigner du plateau pour le son)."] },
        { tip: "Un projecteur puissant bien placé vaut mieux que cinq petits : moins d'ombres à gérer et moins de risque de surcharge." },
      ],
    },
    {
      id: "lum-doser",
      category: "lumiere",
      title: "Doser la lumière",
      summary: "Distance, gélatine ND et dimmer pour régler l'intensité.",
      body: [
        { h: "La distance (loi du carré inverse)" },
        { p: "L'intensité décroît comme l'inverse du carré de la distance : à 4 m, un sujet reçoit 4× moins de lumière qu'à 2 m. Éloigner la source la réduit vite — et agrandit l'espace de jeu du comédien (l'intensité varie moins loin de la source)." },
        { h: "Autres leviers" },
        { ul: [
          "Gélatine ND sur la source (ou collée sur une vitre / autour d'une ampoule de décor).",
          "Dimmer : les LED en ont souvent un intégré (sans changer la teinte). Sur tungstène, un dimmer externe réchauffe la couleur en baissant l'intensité.",
          "Monte les projecteurs en hauteur : les ombres tombent au sol, hors champ.",
        ] },
        { tip: "Un dimmer sert aussi à simuler une source vacillante (cheminée, télé, soleil à travers les arbres). Place-le loin du plateau : il peut bourdonner." },
      ],
    },
    {
      id: "lum-direction",
      category: "lumiere",
      title: "La direction de la lumière",
      summary: "D'où vient la lumière change tout : volume, contraste, émotion.",
      body: [
        { p: "Selon la position de la source autour du sujet (et sa hauteur), on sculpte le visage très différemment — d'une lumière plate et flatteuse à un clair-obscur dramatique." },
        { svg: '<svg viewBox="0 0 340 250" xmlns="http://www.w3.org/2000/svg" role="img"><rect x="150" y="214" width="20" height="14" rx="2" fill="var(--secondary)"/><polygon points="170,217 184,210 184,232 170,225" fill="var(--secondary)"/><text x="160" y="246" text-anchor="middle" font-size="11" fill="var(--text-dim)">Caméra</text><circle cx="160" cy="120" r="30" fill="var(--glass-panel)" stroke="var(--text-dim)" stroke-width="2"/><circle cx="160" cy="150" r="4" fill="var(--text-dim)"/><g fill="var(--primary)"><circle cx="181" cy="196" r="7"/><circle cx="224" cy="165" r="7"/><circle cx="238" cy="120" r="7"/><circle cx="220" cy="71" r="7"/><circle cx="174" cy="43" r="7"/></g><g font-size="11" fill="var(--text-main)"><text x="150" y="200" text-anchor="end">Face</text><text x="234" y="168">3/4 face</text><text x="248" y="123">Latéral</text><text x="230" y="74">3/4 contre</text><text x="184" y="44">Contre</text></g></svg>', caption: "Positions de la source autour du sujet (vue de dessus)." },
        { ul: [
          "Face : aucune ombre, visage lisse — peu de relief (clip, beauté).",
          "3/4 face (Rembrandt) : petit triangle de lumière, naturel et contrasté.",
          "Latéral : pousse les ombres vers la caméra, très flatteur (standard hollywoodien).",
          "Contre : dessine la silhouette, détache du fond.",
          "Au-dessus : ombres dures (soleil de midi) ; en dessous : déformant, inquiétant (horreur).",
        ] },
        { tip: "Un seul projecteur bien orienté + un réflecteur pour déboucher les ombres suffisent souvent à un beau portrait." },
      ],
    },
    {
      id: "lum-contraste",
      category: "lumiere",
      title: "Le contraste & le travail en négatif",
      summary: "Gérer le rapport ombre/lumière, y compris en retirant de la lumière.",
      body: [
        { p: "Le contraste est le rapport entre zones claires et sombres. Fort = tendu, mystérieux ; faible = calme, léger. À éclairage de sujet identique, c'est souvent le fond qui fait le contraste (fond sombre → le sujet ressort)." },
        { h: "Créer du contraste" },
        { ul: [
          "Drapeaux : coupent la lumière sur le fond (ne pas les éloigner trop du projecteur, sinon ombres dures).",
          "Faible profondeur de champ + direction artistique (décors/costumes sombres).",
        ] },
        { h: "Le travail en négatif" },
        { p: "Quand la lumière est trop diffuse (ciel couvert, sable réfléchissant), on n'ajoute pas de lumière : on en RETIRE. Un panneau noir (polystyrène côté noir, borniol) près du sujet absorbe la lumière d'un côté et recrée une direction et du contraste." },
        { tip: "Le négatif est l'outil clé en extérieur couvert, où aucune ombre ne se forme naturellement sur les visages." },
      ],
    },
    {
      id: "lum-couleur",
      category: "lumiere",
      title: "La couleur au cinéma",
      summary: "La couleur raconte et manipule l'émotion.",
      body: [
        { p: "Au-delà de la lumière, une gamme de couleurs (déco, stylisme, accessoires) donne un ton et guide l'œil : harmonie apaisante, opposition tendue, ou une touche vive qui attire l'attention (la robe rouge de Matrix)." },
        { h: "Interprétations courantes" },
        { ul: [
          "Rouge : passion, danger, puissance, colère.",
          "Rose : innocence, douceur, tendresse.",
          "Orange : chaleur, amitié, joie, énergie.",
          "Jaune : énergie, bonheur — mais aussi maladie, folie, mise en garde.",
          "Vert : nature, richesse — ou corruption, malaise.",
          "Bleu : calme, mélancolie, froideur, solitude, tristesse.",
        ] },
        { tip: "Aucune couleur n'est « juste » ou « fausse » : l'essentiel est qu'elle serve l'histoire. Pense ta direction artistique avant le tournage." },
      ],
    },
    {
      id: "lum-nuit-americaine",
      category: "lumiere",
      title: "La nuit américaine (day-for-night)",
      summary: "Filmer de jour une scène censée se passer la nuit.",
      body: [
        { p: "Historiquement : sous-exposer et placer un filtre bleu foncé devant l'objectif pour simuler la nuit en plein jour. Aujourd'hui, l'effet se fait surtout en post (comme Mad Max: Fury Road)." },
        { h: "Pourquoi" },
        { p: "Surtout un choix économique : éclairer de nuit un très grand espace coûte cher et prend du temps. On tourne les plans larges en « nuit américaine » et on raccorde avec des plans serrés réellement tournés de nuit (éclairables au projecteur)." },
        { h: "Bonnes pratiques de tournage" },
        { ul: [
          "Évite le soleil dur : tourne par temps couvert (lumière douce, pas d'ombres).",
          "Ou filme à contre-jour (soleil derrière les comédiens) pour simuler un clair de lune.",
          "Un filtre polarisant assombrit le ciel et coupe les reflets.",
        ] },
        { tip: "En post : baisse l'expo et les hautes lumières, ajoute du contraste, désature, teinte en bleu, parfois remplace le ciel. Pas de recette miracle, teste." },
      ],
    },
    {
      id: "lum-fond-vert",
      category: "lumiere",
      title: "Éclairer un fond vert",
      summary: "Un bon key se prépare d'abord à la lumière.",
      body: [
        { p: "Deux étapes : éclairer le fond, puis les comédiens — en cohérence avec l'arrière-plan à incruster (même qualité, couleur et direction de lumière, sinon les ombres ne collent pas)." },
        { ul: [
          "Éclaire le fond de façon homogène (lumière diffuse, LED/fluo) : pas de dégradés ni de taches.",
          "Avance les comédiens loin du fond : évite les ombres portées sur le vert et les reflets verts sur peau/cheveux.",
          "Tends / repasse le tissu : les plis créent des zones d'ombre difficiles à keyer.",
          "Augmente l'obturateur (min. 1/100) : le flou de mouvement est l'ennemi du détourage.",
          "Ajoute des points de tracking si la caméra bouge ; tourne en LOG, faible compression.",
        ] },
        { h: "Vert ou bleu ?" },
        { p: "Vert : plus lumineux (moins de puissance requise) mais déborde plus sur les sujets — plutôt pour le jour. Bleu : pour la nuit, ou si le sujet est blond / porte du vert." },
        { tip: "Le vert et le bleu sont choisis car ce sont les couleurs les plus éloignées des teintes de peau." },
      ],
    },
    {
      id: "mat-lumiere-accessoires",
      category: "materiel",
      title: "Pieds & accessoires d'éclairage",
      summary: "Le petit matériel qui fait tenir et contrôler la lumière.",
      body: [
        { h: "Les pieds" },
        { ul: [
          "Léger (alu, max ~10 kg) pour LED et petits tungstènes.",
          "Lourd (acier) ou « Wind Up » à manivelle pour HMI, fluo, gros tungstènes.",
          "Pour stabiliser : ouvre la vis du HAUT (jamais celle du bas) et baisse le pied au maximum.",
        ] },
        { h: "Pour contrôler la lumière" },
        { ul: [
          "Drapeau (sur rotule) : coupe et délimite la lumière.",
          "Cinefoil : aluminium noir mat, bouche les fuites ou crée un faisceau.",
          "Volets : orientent le faisceau du projecteur.",
          "Gueuse / sacs de sable : lestent le pied (anti-bascule).",
          "Borniol : tissu noir opaque pour occulter (fenêtres).",
          "Élingue : sangle de sécurité ; spigot : embout de liaison ; prolong : rallonge.",
        ] },
        { tip: "Astuce : des balles de tennis trouées au bout des pieds évitent de rayer le sol." },
      ],
    },

    /* ============ CHAPITRE 5 — DÉCOUPER LE SCÉNARIO ============ */
    {
      id: "real-scenario",
      category: "realisation",
      title: "Écrire un scénario (le format)",
      summary: "La mise en page codifiée qui se lit comme le film se regarde.",
      body: [
        { p: "Un scénario est un document normalisé : même mise en page pour tous les intervenants. Règle d'or : une page ≈ une minute de film (police 12, interligne 1,0)." },
        { h: "L'intitulé de séquence (slugline)" },
        { p: "En majuscules et gras : numéro, INT/EXT, lieu, puis JOUR/NUIT. Ex : « 1. EXT. CHAMP DE BATAILLE — JOUR ». Une nouvelle séquence à chaque changement de décor. Précise fb (flash-back), ff (flash-forward) ou rêve si besoin." },
        { h: "L'action" },
        { p: "Au présent, factuelle : on décrit seulement ce qu'on voit et entend (pas les pensées, pas de style romanesque). Un nom de personnage s'écrit en majuscules à sa première apparition." },
        { h: "Le dialogue" },
        { p: "Nom du personnage en majuscules/gras, didascalie entre parenthèses (ton, attitude), puis la réplique — le tout centré/margé pour une lecture fluide." },
        { tip: "Un nouveau paragraphe d'action peut suggérer un nouveau plan : la mise en forme porte déjà du rythme." },
      ],
    },
    {
      id: "real-decoupage-technique",
      category: "realisation",
      title: "Le découpage technique",
      summary: "La transcription visuelle du scénario : la liste des plans à tourner.",
      body: [
        { p: "Après lecture du scénario, le réalisateur liste chaque plan dans un tableau. Pas de format standard, mais des colonnes essentielles : n° de séquence, n° de plan (celui du clap), valeur + angle, mouvement (machinerie), action." },
        { h: "À quoi ça sert" },
        { ul: [
          "Ne rien oublier : sous stress, on perd des plans ; on raye chaque ligne tournée.",
          "Organiser le tournage : regrouper les plans d'un même axe (on ne tourne pas dans l'ordre chronologique).",
          "Impliquer l'équipe : le chef op anticipe la lumière, le prod chiffre le budget.",
        ] },
        { tip: "Slate intègre une Shot list (Tournage) qui fait exactement office de découpage technique : description, cadre, angle, mouvement, statut." },
      ],
    },
    {
      id: "real-storyboard",
      category: "realisation",
      title: "Le story-board & le plan au sol",
      summary: "Visualiser le film avant de le tourner.",
      body: [
        { h: "Le story-board" },
        { p: "Une BD de ton scénario : une vignette par plan (dessin ou image) + notes sur l'action et le mouvement. Pas besoin de savoir dessiner (Scorsese griffonnait ceux de Taxi Driver) — il s'agit de traduire tes idées, pas de faire joli." },
        { h: "Le plan au sol" },
        { p: "Le décor vu de dessus : on y place comédiens, caméras, trajectoires et projecteurs. Non essentiel pour débuter, mais utile pour situer l'espace pendant le découpage." },
        { tip: "L'appli Shot Designer (ordi/mobile) recrée un plan au sol : ajoute des caméras et la liste de plans se met à jour automatiquement." },
      ],
    },
    {
      id: "real-champ-contrechamp",
      category: "realisation",
      title: "Le champ-contrechamp",
      summary: "Alterner deux axes opposés, surtout en dialogue.",
      body: [
        { p: "Le champ montre ce que voit la caméra ; le contrechamp est le plan opposé, obtenu en « retournant » la caméra. On alterne les deux pour filmer un dialogue." },
        { svg: '<svg viewBox="0 0 340 170" xmlns="http://www.w3.org/2000/svg" role="img"><line x1="120" y1="58" x2="220" y2="58" stroke="var(--text-dim)" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="120" cy="58" r="16" fill="var(--glass-panel)" stroke="var(--text-dim)" stroke-width="2"/><text x="120" y="62" text-anchor="middle" font-size="12" fill="var(--text-main)">A</text><circle cx="220" cy="58" r="16" fill="var(--glass-panel)" stroke="var(--text-dim)" stroke-width="2"/><text x="220" y="62" text-anchor="middle" font-size="12" fill="var(--text-main)">B</text><line x1="112" y1="120" x2="210" y2="70" stroke="var(--secondary)" stroke-width="1"/><line x1="228" y1="120" x2="130" y2="70" stroke="var(--primary)" stroke-width="1"/><rect x="98" y="120" width="22" height="14" rx="2" fill="var(--primary)"/><rect x="220" y="120" width="22" height="14" rx="2" fill="var(--secondary)"/><text x="109" y="150" text-anchor="middle" font-size="10" fill="var(--text-main)">Champ (voit B)</text><text x="231" y="150" text-anchor="middle" font-size="10" fill="var(--text-main)">Contrechamp (voit A)</text></svg>', caption: "Les deux caméras restent du même côté de l'axe A-B (règle des 180°)." },
        { p: "On filme les deux axes séparément (le comédien hors champ donne la réplique) ou avec deux caméras simultanées." },
        { tip: "Tourne chaque champ en DEUX valeurs (un moyen + un serré) : tu auras le choix au montage pour rythmer et faire monter l'intimité ou la tension." },
      ],
    },
    {
      id: "real-hors-champ",
      category: "realisation",
      title: "Le hors-champ",
      summary: "Tout ce qu'on ne montre pas — et qui travaille l'imagination.",
      body: [
        { p: "Le hors-champ, c'est ce qui existe dans l'histoire sans être à l'image. Le spectateur l'imagine, ce qui est souvent plus fort que de le montrer." },
        { ul: [
          "Faire peur : la menace invisible (le hors-champ sonore laisse imaginer le pire).",
          "Suggérer sans montrer : une violence, une scène choquante (le panoramique qui s'écarte dans Reservoir Dogs).",
          "Économiser un effet : on filme les comédiens qui réagissent à une explosion hors champ (+ bruitage + flash lumineux).",
          "Garder le mystère : ne pas montrer le contenu d'un paquet (le coffret de Seven).",
        ] },
        { tip: "Le hors-champ est l'allié n°1 du petit budget : la réaction + le son suffisent souvent à « voir » ce qu'on n'a pas tourné." },
      ],
    },
    {
      id: "real-decoupage-classique",
      category: "realisation",
      title: "Le découpage classique",
      summary: "Plan large, puis champ / contrechamp : la base qui situe toute scène.",
      body: [
        { p: "À chaque nouvelle séquence, le spectateur a besoin de repères : où ? quand ? qui ? On y répond par un enchaînement simple et efficace." },
        { svg: '<svg viewBox="0 0 340 120" xmlns="http://www.w3.org/2000/svg" role="img"><rect x="8" y="14" width="96" height="58" rx="3" fill="var(--glass-panel)" stroke="var(--text-dim)"/><circle cx="40" cy="44" r="5" fill="var(--text-dim)"/><rect x="36" y="49" width="8" height="15" fill="var(--text-dim)"/><circle cx="72" cy="44" r="5" fill="var(--text-dim)"/><rect x="68" y="49" width="8" height="15" fill="var(--text-dim)"/><text x="56" y="92" text-anchor="middle" font-size="10" fill="var(--text-main)">1. Plan large</text><rect x="122" y="14" width="96" height="58" rx="3" fill="var(--glass-panel)" stroke="var(--text-dim)"/><circle cx="170" cy="40" r="11" fill="var(--primary)"/><rect x="159" y="51" width="22" height="21" fill="var(--primary)"/><text x="170" y="92" text-anchor="middle" font-size="10" fill="var(--text-main)">2. Champ</text><rect x="236" y="14" width="96" height="58" rx="3" fill="var(--glass-panel)" stroke="var(--text-dim)"/><circle cx="284" cy="40" r="11" fill="var(--secondary)"/><rect x="273" y="51" width="22" height="21" fill="var(--secondary)"/><text x="284" y="92" text-anchor="middle" font-size="10" fill="var(--text-main)">3. Contrechamp</text><text x="112" y="46" font-size="15" fill="var(--text-dim)">&#8250;</text><text x="226" y="46" font-size="15" fill="var(--text-dim)">&#8250;</text></svg>', caption: "Le squelette d'une scène : situer, puis alterner les points de vue." },
        { ul: [
          "1. Plan large (plan d'exposition) : situe le lieu, le moment, les personnages.",
          "2. Champ : on se rapproche (plan moyen ou serré) sur l'action / le dialogue.",
          "3. Contrechamp : le point de vue opposé.",
        ] },
        { tip: "C'est une ligne directrice, pas une règle : développe-la (inserts, plans intermédiaires) ou inverse-la (révéler le décor en plan large à la fin) pour un effet comique." },
      ],
    },
    {
      id: "real-conseils-decoupage",
      category: "realisation",
      title: "Découper une scène : les réflexes",
      summary: "Trois principes pour un découpage lisible.",
      body: [
        { h: "1 plan = 1 info" },
        { p: "Ne surdécoupe pas « pour faire stylé ». Chaque plan doit apporter une nouvelle information (où ? qui ? que fait-il ? que regarde-t-il ?). Trop de plans = montage indigeste." },
        { h: "Suis le regard" },
        { p: "Quand un personnage se retourne, tourne avec lui et ajoute un plan face à lui : le spectateur doit voir les regards et les émotions, c'est là que vit la narration." },
        { h: "N'oublie pas les raccords" },
        { ul: [
          "Raccord de mouvement : même geste sur les deux plans.",
          "Raccord dans l'axe : du large au serré sur la même action.",
          "Raccord de regard : le regard introduit le plan suivant.",
          "Raccord champ/contrechamp : changement d'axe pour un échange.",
        ] },
        { tip: "La meilleure école du découpage reste de regarder de bons films en se demandant : pourquoi cette valeur, cet axe, à ce moment ?" },
      ],
    },
    {
      id: "real-plan-exposition",
      category: "realisation",
      title: "Le plan d'exposition (establishing shot)",
      summary: "Le plan large qui situe avant d'entrer dans la scène.",
      body: [
        { p: "Souvent un extérieur au grand-angle : il décrit le lieu, l'heure, la saison, parfois avec un sous-titre ou un élément distinctif. Les personnages y sont minuscules, voire absents." },
        { p: "Il se place en général avant le découpage classique, au début de chaque nouvelle localisation. Inutile de le répéter si les scènes suivantes restent au même endroit. Il peut aussi clore une séquence, pour « donner de l'air »." },
        { tip: "Il doit durer assez longtemps pour que le spectateur enregistre toutes les informations — c'est un temps de respiration du montage." },
      ],
    },
    {
      id: "real-stock-shot",
      category: "realisation",
      title: "Tricher la localisation (stock-shot)",
      summary: "Situer sa scène n'importe où, sans budget voyage.",
      body: [
        { p: "Le plan d'exposition localise la scène — donc en le remplaçant, on change le lieu perçu ! Un plan des bureaux + un établissement de la City de Londres = « bureaux à Londres ». C'est la technique de Friends (intérieurs à Los Angeles, plans d'expo tournés à New York)." },
        { h: "La bidouille du stock-shot" },
        { p: "Sans équipe à envoyer dans le monde, achète un plan d'archive (establishing shot) sur un site de banque d'images, place-le avant ton découpage classique, et veille à ce que rien dans TES plans ne trahisse le vrai décor (panneau, plaque, architecture par la fenêtre)." },
        { ul: ["Cherche en anglais (« establishing shot »).", "Sites : Pond5, Artgrid, Adobe Stock, Shutterstock, Getty, Dissolve, Filmsupply…", "Prix de ~5 € à plusieurs centaines selon le plan."] },
        { tip: "Ça marche aussi pour des éléments difficiles (hélicoptère, incendie) : un stock-shot + un décor accessoirisé + bruitage, et on y croit." },
      ],
    },

    /* ============ CHAPITRE 6 — COMPOSER SON CADRE ============ */
    {
      id: "cad-point-de-vue",
      category: "cadrage",
      title: "Le point de vue (objectif, subjectif, omniscient)",
      summary: "Où l'on place la caméra détermine ce que le spectateur ressent.",
      body: [
        { p: "La même scène filmée sous deux angles raconte deux choses différentes (les photos du G7 Merkel/Trump en sont l'exemple parfait). Le placement de la caméra, c'est le regard du réalisateur." },
        { ul: [
          "Objectif : cadres égaux en champ/contrechamp, caméra en recul, aucun parti pris — on observe sans s'identifier.",
          "Subjectif : on adopte le regard d'un personnage, avec ses seules informations. Très utilisé en horreur (on a peur en même temps que lui).",
          "Omniscient : le spectateur sait tout, souvent via une voix off (Desperate Housewives). Rare, car on s'identifie moins.",
        ] },
        { tip: "Choisis le point de vue selon qui tu veux que le spectateur « devienne » — ou pas — dans la scène." },
      ],
    },
    {
      id: "cad-vue-subjective",
      category: "cadrage",
      title: "La vue subjective (POV)",
      summary: "Voir à travers les yeux d'un personnage ou d'un objet.",
      body: [
        { p: "Le plan POV se place entre un personnage qui regarde et sa réaction. Il implique fortement le spectateur." },
        { ul: [
          "À travers un viseur : image habillée de repères (jumelles, caméra) — ou le genre found footage (Blair Witch).",
          "À travers une drogue : image déformée (Requiem for a Dream, Trainspotting).",
          "À travers un personnage : on voit ce qu'il cherche/découvre (ouverture culte de Halloween).",
          "À travers un objet : témoin muet (le lave-linge de Breaking Bad), ou suivre une balle (Lord of War).",
          "À travers un danger : suggérer la menace sans la montrer — la vue subjective du requin des Dents de la mer, née d'un animatronique défaillant.",
        ] },
        { tip: "Bidouille petit budget : un monstre/zombie trop cher à montrer ? Filme sa vue subjective qui fonce sur l'acteur et coupe avant le contact." },
      ],
    },
    {
      id: "cad-ratio",
      category: "cadrage",
      title: "Le ratio (format d'image)",
      summary: "Le rapport largeur/hauteur, à décider avant de tourner.",
      body: [
        { p: "Le ratio (largeur ÷ hauteur) conditionne toute ta composition. À choisir avant le tournage." },
        { svg: '<svg viewBox="0 0 340 110" xmlns="http://www.w3.org/2000/svg" role="img"><g fill="none" stroke="var(--primary)" stroke-width="2"><rect x="10" y="30" width="48" height="36"/><rect x="74" y="30" width="64" height="36"/><rect x="154" y="30" width="85" height="36"/><rect x="255" y="30" width="36" height="36"/><rect x="305" y="18" width="24" height="42"/></g><g font-size="9" fill="var(--text-main)" text-anchor="middle"><text x="34" y="80">4/3</text><text x="106" y="80">16/9</text><text x="196" y="80">2.35</text><text x="273" y="80">1:1</text><text x="317" y="74">9/16</text></g></svg>', caption: "Les formats courants, à hauteur égale (la largeur = le ratio)." },
        { ul: [
          "2.35 (scope) : épique, cinéma, paysages (favori de David Fincher).",
          "16/9 (~1.85 US, 1.66 EU) : standard, comédies et drames.",
          "4/3 (1.33) : format académique ancien, ou effet d'enfermement (A Ghost Story).",
          "Carré 1:1 / Vertical 9:16 : réseaux sociaux.",
        ] },
        { h: "Choisir son ratio" },
        { p: "Par genre (scope pour l'aventure), par ressenti (le carré de Mommy enferme le personnage), par époque (The Artist en 4/3), ou par style (Scott Pilgrim bascule en 2.35 pendant les combats)." },
        { tip: "Un ratio plus étroit (4/3, carré) resserre et oppresse ; un ratio large respire et impressionne." },
      ],
    },
    {
      id: "cad-2-35",
      category: "cadrage",
      title: "Tourner en 2.35",
      summary: "Trois façons d'obtenir le look scope.",
      body: [
        { ul: [
          "Objectifs anamorphiques : la vraie méthode, mais chère et peu pratique pour débuter.",
          "Marqueurs : certaines caméras affichent des lignes de cadrage dans le viseur (non enregistrées) ; on recadre ensuite au montage.",
          "La bidouille : colle un film protecteur sur ton moniteur et trace les lignes au marqueur (ou deux élastiques / du gaffer).",
        ] },
        { h: "Au montage" },
        { p: "Deux options : poser deux bandes noires (PNG transparent au bon ratio) sur une séquence 16/9, ou changer les dimensions de la séquence. Formule : largeur = hauteur × ratio (ou hauteur = largeur ÷ ratio)." },
        { tip: "Tourne toujours ton image complète (16/9) et cadre en gardant l'info importante dans la zone 2.35 : tu gardes de la marge au recadrage. (Calculateur Ratio/letterbox dans Tournage.)" },
      ],
    },
    {
      id: "cad-regle-tiers",
      category: "cadrage",
      title: "La règle des tiers",
      summary: "Diviser le cadre en 9 pour placer et équilibrer.",
      body: [
        { p: "On divise le cadre en tiers (3×3). On place les éléments importants sur les lignes ou leurs intersections (« lignes de force »). Comme toute « règle » de cinéma, c'est une ligne directrice." },
        { svg: '<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img"><rect x="8" y="8" width="284" height="164" fill="none" stroke="var(--text-dim)" stroke-width="2"/><g stroke="var(--primary)" stroke-width="1.2"><line x1="102.7" y1="8" x2="102.7" y2="172"/><line x1="197.3" y1="8" x2="197.3" y2="172"/><line x1="8" y1="62.7" x2="292" y2="62.7"/><line x1="8" y1="117.3" x2="292" y2="117.3"/></g><g fill="var(--secondary)"><circle cx="102.7" cy="62.7" r="5"/><circle cx="197.3" cy="62.7" r="5"/><circle cx="102.7" cy="117.3" r="5"/><circle cx="197.3" cy="117.3" r="5"/></g></svg>', caption: "Les 4 points de force : y placer le sujet attire l'œil." },
        { ul: [
          "Le regard : place les yeux sur la ligne haute ; laisse de l'air dans la direction du regard.",
          "L'horizon : dans le tiers haut pour insister sur le sol, dans le tiers bas pour le ciel.",
          "Le mouvement : un personnage qui va à droite se place à gauche (il « marche vers le centre »).",
          "Le placement : deux personnages sur les lignes verticales = attention égale ; au centre = symétrie et domination (Full Metal Jacket).",
        ] },
        { tip: "Sur un plan serré, couper le haut du crâne ne choque pas — mais garde toujours le menton dans le cadre." },
      ],
    },
    {
      id: "cad-angles",
      category: "cadrage",
      title: "Les angles : plongée, contre-plongée, dutch",
      summary: "La hauteur et l'inclinaison de la caméra manipulent le rapport de force.",
      body: [
        { svg: '<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" role="img"><circle cx="175" cy="52" r="15" fill="var(--glass-panel)" stroke="var(--text-dim)" stroke-width="2"/><rect x="163" y="68" width="24" height="86" rx="6" fill="var(--glass-panel)" stroke="var(--text-dim)" stroke-width="2"/><g fill="var(--primary)"><rect x="60" y="20" width="22" height="14" rx="2"/><rect x="48" y="96" width="22" height="14" rx="2"/><rect x="60" y="168" width="22" height="14" rx="2"/></g><g stroke="var(--primary)" stroke-width="1"><line x1="82" y1="30" x2="158" y2="52"/><line x1="70" y1="103" x2="158" y2="100"/><line x1="82" y1="172" x2="158" y2="150"/></g><g font-size="10" fill="var(--text-main)"><text x="58" y="16">Plongée</text><text x="18" y="92">Hauteur des yeux</text><text x="40" y="196">Contre-plongée</text></g></svg>', caption: "Trois hauteurs de caméra pour un même sujet." },
        { ul: [
          "Hauteur des yeux : neutre, familier, le plus courant (comédie).",
          "Plongée (au-dessus, vers le bas) : écrase, affaiblit, soumet le personnage (Dobby dans Harry Potter).",
          "Contre-plongée (en dessous, vers le haut) : agrandit, magnifie, donne de la puissance (super-héros).",
          "Dutch angle (caméra inclinée) : malaise, perte de repères, tension. À ne pas abuser.",
        ] },
        { p: "En alternant plongée et contre-plongée, on installe un rapport de force (le duel Jon Snow / Ramsay dans la Bataille des Bâtards)." },
        { tip: "Bidouille scène historique : filme tes plans larges en contre-plongée pour ne cadrer que le haut des bâtiments et cacher voitures, boutiques et éléments modernes au sol." },
      ],
    },
    {
      id: "cad-topshot",
      category: "cadrage",
      title: "Le topshot (caméra en douche)",
      summary: "La plongée à 90° au-dessus du sol.",
      body: [
        { p: "Vue du dessus parfaitement perpendiculaire. Elle situe l'espace, suit un mouvement (trajet d'une voiture), ou exprime solitude, enfermement, mort, libération." },
        { h: "La bidouille Google Earth" },
        { p: "Pas besoin d'un drone coûteux : avec Google Earth (et Google Earth Studio), on crée un faux plan aérien en se déplaçant dans les vues satellites, avec des points clés animés — on peut même régler la position du soleil. Les frères Coen l'ont fait pour le générique de Burn After Reading." },
        { tip: "Ajoute de faux nuages et des voitures détourées en mouvement sur la carte : l'effet de zoom depuis l'espace devient crédible." },
      ],
    },
    {
      id: "cad-conseils",
      category: "cadrage",
      title: "Conseils de cadrage",
      summary: "Les réflexes pour une image léchée.",
      body: [
        { ul: [
          "Ne sois pas flemmard : ne filme pas « en reportage » debout en pivotant. Baisse-toi, prends de la hauteur, cherche le meilleur angle.",
          "Dirige l'attention : compose pour guider l'œil et éliminer les distractions autour du sujet (crucial pour des plans courts/web lisibles vite).",
          "Fais la bulle : vérifie le niveau (bulle du trépied, niveau à bulle, appli boussole du téléphone) — sauf dutch angle voulu.",
        ] },
        { tip: "Un viseur de champ (ou l'appli Artemis sur smartphone) permet de prévisualiser un cadre selon la focale et le capteur, sans trimballer la caméra." },
      ],
    },

    /* ============ CHAPITRE 7 — DIALOGUE & RÈGLE DES 180° ============ */
    {
      id: "real-dialogue-tournage",
      category: "realisation",
      title: "Bien tourner un dialogue",
      summary: "Master, deux valeurs, répétitions et son propre.",
      body: [
        { p: "Un dialogue se filme comme un petit découpage classique : on pose le lieu en plan moyen (qui sert de fil rouge), puis on se rapproche en champ-contrechamp quand l'émotion monte." },
        { h: "Tourne des masters" },
        { p: "Joue le dialogue en entier sur chaque axe — c'est le « master » de la scène — au lieu de retourner la caméra à chaque réplique. Tu remonteras l'ordre au montage et tu auras toujours de la matière pour chaque personnage." },
        { h: "Deux valeurs par axe" },
        { p: "Pour chaque champ, tourne un plan moyen ET un plan serré. Tu pourras resserrer progressivement pour accroître l'intimité ou la tension (la fameuse scène de Heat entre Pacino et De Niro)." },
        { ul: [
          "Répète avec les comédiens : un acteur inspiré qui change sa réplique sur le contrechamp devient impossible à raccorder avec le champ déjà tourné.",
          "Surveille le son : les comédiens ne doivent pas se chevaucher. Un petit temps entre les répliques permet de couper proprement au montage.",
        ] },
        { tip: "Priorité n°1 sur un dialogue : un son propre. Un léger blanc entre deux répliques vaut mieux qu'un chevauchement qui t'empêche de couper." },
      ],
    },
    {
      id: "real-180",
      category: "realisation",
      title: "La règle des 180°",
      summary: "Rester du même côté de la ligne pour que les regards se croisent.",
      body: [
        { p: "Trace une ligne imaginaire entre tes deux personnages : la caméra doit toujours rester du même côté. La franchir fait « sauter » les personnages de place d'un plan à l'autre et casse le croisement des regards." },
        { svg: '<svg viewBox="0 0 360 205" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
            '<rect x="10" y="92" width="340" height="105" fill="var(--primary)" opacity="0.07"/>' +
            '<text x="180" y="112" fill="var(--text-dim)" font-size="10" text-anchor="middle">cote autorise</text>' +
            '<line x1="20" y1="90" x2="340" y2="90" stroke="var(--secondary)" stroke-width="2" stroke-dasharray="6 4"/>' +
            '<text x="22" y="82" fill="var(--secondary)" font-size="11">LIGNE DES 180</text>' +
            '<circle cx="140" cy="90" r="15" fill="var(--glass-panel)" stroke="var(--text-main)" stroke-width="2"/><text x="140" y="94" text-anchor="middle" font-size="12" fill="var(--text-main)">A</text>' +
            '<circle cx="230" cy="90" r="15" fill="var(--glass-panel)" stroke="var(--text-main)" stroke-width="2"/><text x="230" y="94" text-anchor="middle" font-size="12" fill="var(--text-main)">B</text>' +
            '<rect x="80" y="158" width="22" height="14" rx="2" fill="var(--primary)"/><line x1="100" y1="160" x2="220" y2="100" stroke="var(--primary)" stroke-width="1.5"/><text x="80" y="188" font-size="10" fill="var(--text-dim)" text-anchor="middle">champ</text>' +
            '<rect x="268" y="158" width="22" height="14" rx="2" fill="var(--primary)"/><line x1="268" y1="160" x2="150" y2="100" stroke="var(--primary)" stroke-width="1.5"/><text x="279" y="188" font-size="10" fill="var(--text-dim)" text-anchor="middle">contrechamp</text>' +
            '<rect x="174" y="16" width="22" height="14" rx="2" fill="none" stroke="#ff5a5a" stroke-width="2"/><line x1="185" y1="30" x2="185" y2="76" stroke="#ff5a5a" stroke-width="1.5" stroke-dasharray="3 3"/><text x="238" y="27" font-size="10" fill="#ff5a5a">INTERDIT (franchit)</text>' +
            "</svg>",
          caption: "Les caméras du champ et du contrechamp restent sous la ligne. Passer au-dessus (en rouge) casse les reperes." },
        { h: "Croiser les regards" },
        { p: "Du bon côté, A regarde vers B et B vers A : leurs regards se répondent. Du mauvais côté, ils semblent regarder dans la même direction, comme s'ils parlaient à un tiers hors champ." },
        { h: "La franchir volontairement" },
        { p: "On peut traverser la ligne pour marquer une bascule (une séduction, une trahison, un autre visage d'un personnage), à condition de montrer le passage — le plus souvent par un travelling qui emmène la caméra d'un côté à l'autre." },
        { ul: [
          "Un personnage qui fixe un objet, une télé, un téléphone : on croise les regards comme s'ils se faisaient face.",
          "Une scène au téléphone ou en split-screen : les regards restent face à face, pour « se répondre » à distance.",
        ] },
        { tip: "Trompé au tournage ? Tu peux inverser l'image horizontalement au montage — mais vérifie d'abord qu'aucun détail ne trahit le miroir (barrette, cicatrice, texte, horloge en fond)." },
      ],
    },
    {
      id: "real-30",
      category: "realisation",
      title: "La règle des 30°",
      summary: "Bouger la caméra d'au moins 30° entre deux plans du même sujet.",
      body: [
        { p: "Entre deux plans successifs du même sujet, déplace la caméra d'au moins 30° (et change si possible de valeur). En dessous, la coupe ressemble à une « saute » : un petit sursaut gênant qui désoriente le spectateur." },
        { svg: '<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
            '<circle cx="180" cy="38" r="15" fill="var(--glass-panel)" stroke="var(--text-main)" stroke-width="2"/><text x="180" y="42" text-anchor="middle" font-size="10" fill="var(--text-main)">sujet</text>' +
            '<line x1="90" y1="163" x2="172" y2="50" stroke="var(--primary)" stroke-width="1.5"/><rect x="79" y="163" width="22" height="14" rx="2" fill="var(--primary)"/><text x="90" y="191" text-anchor="middle" font-size="10" fill="var(--text-dim)">A</text>' +
            '<line x1="122" y1="166" x2="176" y2="52" stroke="#ff5a5a" stroke-width="1.5" stroke-dasharray="4 3"/><rect x="111" y="166" width="22" height="14" rx="2" fill="none" stroke="#ff5a5a" stroke-width="2"/><text x="122" y="194" text-anchor="middle" font-size="9" fill="#ff5a5a">trop proche</text>' +
            '<line x1="252" y1="163" x2="188" y2="50" stroke="var(--secondary)" stroke-width="1.5"/><rect x="241" y="163" width="22" height="14" rx="2" fill="var(--secondary)"/><text x="252" y="191" text-anchor="middle" font-size="10" fill="var(--text-dim)">30 ok</text>' +
            '<text x="210" y="78" font-size="11" fill="var(--text-dim)">30 min</text>' +
            "</svg>",
          caption: "Depuis la cam A, un axe trop proche fait une saute (rouge) ; un axe a 30 degres ou plus raccorde bien." },
        { p: "En revanche, entre le champ et le contrechamp d'un dialogue, garde le même objectif et la même distance au sujet : les deux axes doivent s'équilibrer, pas se déséquilibrer." },
        { tip: "30°, c'est un minimum. Combine déplacement ET changement de valeur (du moyen au serré) pour que deux plans se raccordent le plus naturellement." },
      ],
    },
    {
      id: "real-dialogue-groupe",
      category: "realisation",
      title: "Filmer un dialogue de groupe",
      summary: "Gérer plusieurs lignes de 180° sans se perdre.",
      body: [
        { p: "À plus de deux personnages, les lignes des 180° se multiplient. Un petit plan au sol (vue de dessus) où tu notes les positions et les lignes t'évite de t'emmêler." },
        { h: "Quatre méthodes" },
        { ul: [
          "Une ligne dominante : n'en trace qu'une (la relation principale) et compose autour (la rencontre dans Seven).",
          "Alterner les lignes : plan large d'abord pour situer tout le monde, puis champ-contrechamp en respectant la ligne entre chaque intervenant (Pulp Fiction).",
          "Se placer au centre : si le groupe est en cercle, mets-toi au milieu et pivote pour cadrer chacun (Breakfast Club).",
          "Jouer la symétrie : des personnages qui se font face, cadrés de façon symétrique pour croiser les regards (Matrix Reloaded).",
        ] },
        { tip: "Le but ne change pas : où qu'ils soient placés, cadre pour que les regards se croisent d'un plan à l'autre." },
      ],
    },
    {
      id: "real-continuite",
      category: "realisation",
      title: "Continuité de direction (mouvement)",
      summary: "Garder le même sens de déplacement d'un plan à l'autre.",
      body: [
        { p: "La règle des 180° vaut aussi pour un sujet qui bouge. Si une voiture roule de gauche à droite, elle doit garder ce sens au plan suivant — sinon elle semble faire marche arrière (les poursuites de Baby Driver ne franchissent jamais la ligne)." },
        { ul: [
          "Marche et course : même direction d'un plan à l'autre (le jeune Forrest Gump court toujours vers la droite).",
          "Sens narratif : aller vers la droite = avancer vers son objectif ; vers la gauche = reculer, hésiter (Snowpiercer), car on lit de gauche à droite.",
        ] },
        { tip: "Pour inverser le sens sans perdre le spectateur, glisse un plan de coupe neutre entre les deux : un piéton qui regarde, le conducteur qui tourne la tête, les mains sur le volant." },
      ],
    },
    {
      id: "real-french-over",
      category: "realisation",
      title: "Le french over",
      summary: "Filmer par-dessus l'épaule, depuis l'arrière des personnages.",
      body: [
        { p: "Le « french over » désigne les plans filmés derrière les comédiens. Le nom vient des scènes en voiture d'À bout de souffle (Godard), tournées depuis la banquette arrière faute de place à l'avant." },
        { p: "On place le spectateur dans le dos des personnages, comme s'il les espionnait, sans lire leurs visages — parfait pour une tension ou un secret (Millenium : Ce qui ne me tue pas)." },
        { tip: "Utile quand on ne peut pas mettre la caméra devant (voiture, espace exigu), et expressif quand on veut justement cacher les émotions." },
      ],
    },
    {
      id: "cad-amorce",
      category: "cadrage",
      title: "Le plan avec (et sans) amorce",
      summary: "L'épaule au premier plan : proximité ou distance.",
      body: [
        { p: "Une amorce, c'est un élément de premier plan — souvent l'épaule d'un personnage de dos. Elle situe l'interlocuteur et crée de la proximité : la relation paraît plus intime (Titanic) ou appuie un rapport de force (Mon beau-père et moi)." },
        { h: "Sans amorce" },
        { p: "À l'inverse, un plan sans amorce isole le personnage filmé et met de la distance entre les comédiens." },
        { p: "Équilibre tes axes : si le champ est en amorce, fais le contrechamp aussi en amorce (et inversement) pour éviter les sautes à l'image." },
        { tip: "Cadre ton amorce de trois-quarts ou de dos, bouche hors champ : tu seras libre, au montage, de lui faire dire — ou non — sa réplique sans voir ses lèvres bouger." },
      ],
    },
    {
      id: "cad-dialogue-cadrage",
      category: "cadrage",
      title: "Cadrer un dialogue : l'air et le décadrage",
      summary: "Laisser de l'espace au regard, ou décadrer pour un effet.",
      body: [
        { p: "Pour un cadre neutre, applique la règle des tiers : les yeux sur la ligne du haut, et de l'« air » dans le sens du regard (de l'espace à droite s'il regarde à droite, à gauche s'il regarde à gauche)." },
        { h: "Jouer le décadrage" },
        { p: "Décadrer volontairement change le sens. Un cadre parfaitement symétrique donne de la rigueur, un côté strict (Le Discours d'un roi). Pousser les têtes vers le bord crée un malaise, un enfermement (Mr. Robot)." },
        { tip: "Le cadre raconte le rapport de force : contre-plongée + symétrie = puissance ; plongée + personnage décadré = vulnérabilité (l'interrogatoire du Silence des agneaux)." },
      ],
    },
    {
      id: "real-long-dialogue",
      category: "realisation",
      title: "Cadrer un long dialogue",
      summary: "Relancer le rythme au-delà d'une à deux minutes.",
      body: [
        { p: "Au-delà d'une à deux minutes, un simple champ-contrechamp finit par lasser, même si la scène est bien écrite. Deux solutions pour relancer le rythme." },
        { ul: [
          "Déplacer la caméra : multiplie les angles — commence neutre à hauteur des yeux, ajoute plongée/contre-plongée si le rapport de force évolue, glisse un travelling circulaire pour casser la lenteur.",
          "Déplacer les acteurs : fais lever un personnage qui part dans la cuisine tout en parlant — nouveau fond, nouveaux angles, plus de profondeur.",
        ] },
        { tip: "Fais évoluer le découpage avec l'émotion de la scène, jamais au hasard : chaque changement d'angle doit raconter quelque chose." },
      ],
    },
  ];
})(window.MH = window.MH || {});
