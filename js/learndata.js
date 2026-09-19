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
    { id: "lumiere", label: "Lumière", icon: "fa-lightbulb" },
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
  ];
})(window.MH = window.MH || {});
