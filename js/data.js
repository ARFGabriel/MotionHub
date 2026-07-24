/* =========================================================
   DONNÉES STATIQUES
   Bibliothèque d'expressions + modèles de scripts After Effects.
   Séparées de la logique pour être facilement enrichies.
   ========================================================= */
(function (MH) {
  "use strict";

  /* --- Statuts de projet (kanban) --- */
  MH.projectStatuses = [
    { id: "todo", label: "À faire", color: "#8b9bb4" },
    { id: "progress", label: "En cours", color: "#00d2ff" },
    { id: "review", label: "Review", color: "#ffb454" },
    { id: "done", label: "Fini", color: "#3ddc97" },
  ];

  /* --- Catégories (ordre d'affichage des filtres) --- */
  MH.expressionCategories = [
    "Mouvement",
    "Physique",
    "Temps",
    "Rigging & Liens",
    "Texte",
    "Couleur & Style",
    "Audio",
    "Maths & Utilitaires",
    "3D & Caméra",
  ];

  /* --- Bibliothèque d'expressions After Effects ---
     Schéma : { id, title, category, desc, where, how, params[], code } */
  MH.expressions = [
    /* ===================== MOUVEMENT ===================== */
    {
      id: "wiggle",
      title: "Wiggle",
      category: "Mouvement",
      desc: "Agite la valeur de façon aléatoire mais fluide. Le grand classique pour donner de la vie : caméra à main levée, flottement, nervosité.",
      where: "Position, Rotation, Échelle, ou n'importe quelle propriété numérique.",
      how: "Colle tel quel. Fonctionne sans keyframe. Pour figer le wiggle sur un seul axe, sépare les dimensions.",
      params: [
        { name: "freq (2)", desc: "Nombre de secousses par seconde. Plus haut = plus nerveux." },
        { name: "amp (50)", desc: "Amplitude en pixels/degrés. Plus haut = déplacement plus large." },
      ],
      code: "wiggle(2, 50);",
    },
    {
      id: "loop_cycle",
      title: "Loop Cycle",
      category: "Mouvement",
      desc: "Répète en boucle infinie l'animation définie par tes keyframes.",
      where: "N'importe quelle propriété possédant au moins 2 keyframes.",
      how: "Anime avec des keyframes, puis colle sur la même propriété. La boucle reprend de la 1re à la dernière clé.",
      params: [
        { name: '"cycle"', desc: "Type de boucle. Remplace par \"pingpong\", \"offset\" ou \"continue\"." },
        { name: "numKeyframes", desc: "loopOut(\"cycle\", 2) ne boucle que sur les 2 dernières clés (0 = toutes)." },
      ],
      code: 'loopOut("cycle");',
    },
    {
      id: "loop_pingpong",
      title: "Loop Ping-Pong",
      category: "Mouvement",
      desc: "Boucle l'animation en aller-retour (A→B→A→B), sans à-coup au retour.",
      where: "Propriété avec au moins 2 keyframes.",
      how: "Idéal pour un flottement ou une pulsation qui ne doit jamais 'sauter'.",
      params: [{ name: '"pingpong"', desc: "Le mode. Compare avec \"cycle\" qui, lui, repart brutalement au début." }],
      code: 'loopOut("pingpong");',
    },
    {
      id: "loop_offset",
      title: "Loop Offset (progression infinie)",
      category: "Mouvement",
      desc: "Rejoue l'animation en cumulant le déplacement : parfait pour un défilement sans fin (bandeau, tapis roulant, ciel qui défile).",
      where: "Position surtout ; toute propriété qui doit avancer continûment.",
      how: "Fais 2 keyframes de position (départ → +1 cycle de décalage), puis colle. Le mouvement se prolonge à l'infini.",
      params: [{ name: '"offset"', desc: "Cumule la distance entre 1re et dernière clé à chaque boucle." }],
      code: 'loopOut("offset");',
    },
    {
      id: "sine_osc",
      title: "Oscillation sinusoïdale",
      category: "Mouvement",
      desc: "Balancement doux et régulier via une onde sinus. Plus contrôlable qu'un wiggle car parfaitement périodique.",
      where: "Position (1 axe), Rotation, Opacité, Échelle.",
      how: "Ajoute la sortie à value, ou remplace value. Ci-dessous : oscille autour de la valeur actuelle.",
      params: [
        { name: "freq", desc: "Vitesse de l'oscillation (cycles/seconde)." },
        { name: "amp", desc: "Amplitude du balancement." },
      ],
      code: ["freq = 1;", "amp = 30;", "value + Math.sin(time * freq * Math.PI * 2) * amp;"].join("\n"),
    },
    {
      id: "breathe",
      title: "Respiration (pulse d'échelle)",
      category: "Mouvement",
      desc: "Fait 'respirer' un calque : léger gonflement/dégonflement continu. Donne de la vie à un logo ou un personnage au repos.",
      where: "Échelle.",
      how: "Colle sur Échelle. Le calque pulse autour de sa taille d'origine.",
      params: [
        { name: "freq", desc: "Rythme de la respiration." },
        { name: "amp", desc: "Intensité du gonflement en %." },
      ],
      code: ["freq = 0.5;", "amp = 5;", "s = Math.sin(time * freq * Math.PI * 2) * amp;", "[value[0] + s, value[1] + s];"].join("\n"),
    },
    {
      id: "auto_drift",
      title: "Dérive constante",
      category: "Mouvement",
      desc: "Déplacement linéaire et régulier dans une direction, sans keyframe.",
      where: "Position.",
      how: "Utile pour un fond qui glisse lentement. Modifie le vecteur vitesse pour changer la direction.",
      params: [{ name: "speed", desc: "Vitesse en px/seconde sur X et Y ([X, Y])." }],
      code: ["speed = [50, 0];", "value + speed * time;"].join("\n"),
    },

    /* ===================== PHYSIQUE ===================== */
    {
      id: "inertial",
      title: "Inertial Bounce (rebond)",
      category: "Physique",
      desc: "Ajoute un rebond élastique automatique après ta dernière keyframe : le calque dépasse puis revient, comme un objet qui a de l'inertie.",
      where: "Position, Échelle, Rotation (tout ce qui bouge et s'arrête).",
      how: "Anime avec 2 keyframes (départ → arrivée), puis colle. Le rebond se déclenche à la dernière clé.",
      params: [
        { name: "amp", desc: "Ampleur du dépassement. Plus haut = rebond plus large." },
        { name: "freq", desc: "Nombre de rebonds par seconde." },
        { name: "decay", desc: "Vitesse d'amortissement. Plus haut = se stabilise plus vite." },
      ],
      code: [
        "amp = 0.08; freq = 3.0; decay = 4.0;",
        "n = 0;",
        "if (numKeys > 0) {",
        "  n = nearestKey(time).index;",
        "  if (key(n).time > time) n--;",
        "}",
        "if (n == 0) { t = 0; } else { t = time - key(n).time; }",
        "if (n > 0 && t < 3) {",
        "  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);",
        "  value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);",
        "} else { value; }",
      ].join("\n"),
    },
    {
      id: "overshoot",
      title: "Overshoot / Spring (dépassement)",
      category: "Physique",
      desc: "Version 'ressort' : le calque dépasse sa cible puis se cale dessus avec une élasticité douce. Plus 'design' qu'un rebond dur.",
      where: "Position, Échelle, Rotation.",
      how: "2 keyframes, puis colle. Joue sur amplitude et fréquence pour un feeling plus mou ou plus vif.",
      params: [
        { name: "amplitude", desc: "Taille du dépassement." },
        { name: "frequency", desc: "Nombre d'oscillations." },
        { name: "decay", desc: "Amortissement." },
      ],
      code: [
        "amplitude = 0.1; frequency = 2.0; decay = 5.0;",
        "n = 0;",
        "if (numKeys > 0) {",
        "  n = nearestKey(time).index;",
        "  if (key(n).time > time) n--;",
        "}",
        "if (n > 0) {",
        "  t = time - key(n).time;",
        "  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);",
        "  value + v * (amplitude * Math.sin(frequency * t * Math.PI * 2) / Math.exp(decay * t));",
        "} else { value; }",
      ].join("\n"),
    },
    {
      id: "pendulum",
      title: "Pendule amorti",
      category: "Physique",
      desc: "Balancement de pendule qui s'atténue jusqu'à l'arrêt. Parfait pour un panneau suspendu, une queue, un accessoire.",
      where: "Rotation.",
      how: "Colle sur Rotation. Le pendule démarre au début du calque et se stabilise à la verticale (0°).",
      params: [
        { name: "startAngle", desc: "Angle de départ en degrés." },
        { name: "freq", desc: "Vitesse du balancement." },
        { name: "decay", desc: "Rapidité de l'amortissement." },
      ],
      code: ["startAngle = 40;", "freq = 1.5;", "decay = 1.0;", "startAngle * Math.sin(freq * time * Math.PI * 2) / Math.exp(decay * time);"].join("\n"),
    },
    {
      id: "gravity_bounce",
      title: "Rebond de balle (gravité)",
      category: "Physique",
      desc: "Simule une balle qui tombe et rebondit au sol avec perte d'énergie. Pur calcul physique, sans keyframe.",
      where: "Position (souvent l'axe Y).",
      how: "Colle sur Position. Ajuste la hauteur, la gravité et l'élasticité pour le poids voulu.",
      params: [
        { name: "floor", desc: "Hauteur Y du sol (px)." },
        { name: "gravity", desc: "Force de gravité. Plus haut = chute plus lourde." },
        { name: "bounce", desc: "Restitution (0.1–0.9). Plus haut = rebondit plus longtemps." },
      ],
      code: [
        "floor = value[1]; gravity = 4000; bounce = 0.7; vel = 0;",
        "// Rebond amorti simple basé sur le temps",
        "e = 0.7; g = 2000; v0 = 900; t = time;",
        "h = 0; tt = t; k = 0;",
        "while (true) {",
        "  span = (v0 * Math.pow(e, k)) * 2 / g;",
        "  if (tt < span || span < 0.001) break;",
        "  tt -= span; k++;",
        "}",
        "vv = v0 * Math.pow(e, k);",
        "h = vv * tt - 0.5 * g * tt * tt;",
        "[value[0], floor - Math.max(h, 0)];",
      ].join("\n"),
    },

    /* ===================== TEMPS ===================== */
    {
      id: "time_rotation",
      title: "Rotation continue",
      category: "Temps",
      desc: "Fait tourner un calque en continu, sans keyframe. Roues, hélices, chargements, cadrans.",
      where: "Rotation.",
      how: "Colle sur Rotation. Valeur négative = sens antihoraire.",
      params: [{ name: "150", desc: "Degrés par seconde. 360 = un tour complet par seconde." }],
      code: "time * 150;",
    },
    {
      id: "posterize",
      title: "Posterize Time (stop-motion)",
      category: "Temps",
      desc: "Fige l'animation sur un nombre d'images/seconde réduit → look saccadé 'fait main' / stop-motion.",
      where: "Sur la 1re propriété animée du calque (souvent Position). Affecte tout le calque.",
      how: "Mets la ligne posterizeTime en tête, puis value. Baisse la valeur pour un rendu plus saccadé.",
      params: [{ name: "12", desc: "Images par seconde apparentes. 6–12 pour un vrai look stop-motion." }],
      code: "posterizeTime(12);\nvalue;",
    },
    {
      id: "delay_echo",
      title: "Suivi avec retard (echo/cascade)",
      category: "Temps",
      desc: "Reproduit l'animation d'un autre calque avec un décalage temporel : effet de traîne, cascade, chenille.",
      where: "Même propriété que le calque source (Position, etc.).",
      how: "Duplique ton calque animé plusieurs fois. Sur chaque copie, colle ceci : chaque calque suit celui du dessus avec un retard.",
      params: [
        { name: "delay", desc: "Retard en secondes par rapport au calque source." },
        { name: "thisComp.layer(index-1)", desc: "Le calque suivi (ici celui juste au-dessus)." },
      ],
      code: ["delay = 0.1;", "src = thisComp.layer(index - 1);", "src.transform.position.valueAtTime(time - delay);"].join("\n"),
    },

    /* ===================== RIGGING & LIENS ===================== */
    {
      id: "look_at",
      title: "Orienter vers un calque (look-at 2D)",
      category: "Rigging & Liens",
      desc: "Fait pointer un calque vers un autre en permanence (yeux qui suivent, flèche, projecteur).",
      where: "Rotation (2D).",
      how: "Renomme la cible 'Cible' ou change le nom dans le code. Ajoute un offset si ton visuel pointe vers le haut plutôt que la droite.",
      params: [
        { name: 'layer("Cible")', desc: "Le calque à viser." },
        { name: "offset", desc: "Correction d'angle si ton graphisme ne pointe pas vers la droite (ex: +90)." },
      ],
      code: [
        'target = thisComp.layer("Cible");',
        "offset = 0;",
        "d = target.transform.position - transform.position;",
        "radiansToDegrees(Math.atan2(d[1], d[0])) + offset;",
      ].join("\n"),
    },
    {
      id: "wheel_roll",
      title: "Roue qui roule",
      category: "Rigging & Liens",
      desc: "Calcule automatiquement la rotation d'une roue à partir de son déplacement horizontal : plus elle avance, plus elle tourne, sans glissement.",
      where: "Rotation de la roue.",
      how: "Mesure le rayon de ta roue en pixels et renseigne-le. La roue reste synchro même si tu changes son animation de position.",
      params: [{ name: "radius", desc: "Rayon de la roue en pixels (à mesurer sur ton visuel)." }],
      code: ["radius = 100;", "circ = 2 * Math.PI * radius;", "x = transform.position[0];", "(x / circ) * 360;"].join("\n"),
    },
    {
      id: "counter_rotate",
      title: "Contre-rotation (rester droit)",
      category: "Rigging & Liens",
      desc: "Annule la rotation d'un parent pour qu'un calque enfant reste toujours droit (nacelle de grande roue, texte sur un objet qui tourne).",
      where: "Rotation d'un calque enfant (parenté à un calque qui tourne).",
      how: "Parente le calque à l'objet qui tourne, puis colle. Il compensera automatiquement.",
      params: [{ name: "parent.transform.rotation", desc: "La rotation annulée. Ajoute une valeur pour un décalage constant." }],
      code: "-parent.transform.rotation;",
    },
    {
      id: "squash_stretch",
      title: "Squash & Stretch (volume constant)",
      category: "Rigging & Liens",
      desc: "Étire et écrase un calque en conservant son volume : quand il s'allonge, il s'affine, et inversement. Base de l'animation cartoon.",
      where: "Échelle.",
      how: "Pilote la variable 'stretch' avec un curseur (Slider) ou une expression. 0 = neutre, positif = étiré, négatif = écrasé.",
      params: [{ name: "stretch", desc: "Facteur d'étirement. Relie-le à un Slider Control pour l'animer." }],
      code: ["stretch = 0;", "s = value / 100;", "[s[0] * (1 - stretch), s[1] * (1 + stretch)] * 100;"].join("\n"),
    },
    {
      id: "link_property",
      title: "Lier à une autre propriété (pickwhip)",
      category: "Rigging & Liens",
      desc: "Copie en direct la valeur d'une propriété d'un autre calque (synchronise deux éléments).",
      where: "N'importe quelle propriété du même type que la source.",
      how: "Adapte le nom du calque et la propriété. Ajoute un décalage ou un multiplicateur si besoin.",
      params: [
        { name: 'layer("Contrôle")', desc: "Le calque source." },
        { name: "* 1", desc: "Multiplicateur : 0.5 pour moitié, -1 pour inverser." },
      ],
      code: 'thisComp.layer("Contrôle").transform.opacity * 1;',
    },

    /* ===================== TEXTE ===================== */
    {
      id: "counter",
      title: "Compteur animé",
      category: "Texte",
      desc: "Affiche un nombre qui monte (ou descend) dans le temps : statistiques, scores, chiffres qui défilent.",
      where: "Texte source (Source Text) d'un calque de texte.",
      how: "Pilote le nombre avec un Slider Control pour l'animer précisément, ou laisse-le suivre le temps. Change toFixed pour les décimales.",
      params: [
        { name: "num", desc: "La valeur affichée (ici basée sur le temps). Relie à un Slider pour keyframer." },
        { name: "toFixed(0)", desc: "Nombre de décimales." },
      ],
      code: ["num = time * 100;", "num.toFixed(0);"].join("\n"),
    },
    {
      id: "counter_commas",
      title: "Compteur avec séparateurs de milliers",
      category: "Texte",
      desc: "Comme le compteur, mais formaté avec des séparateurs (1 000 000). Idéal pour de gros chiffres lisibles.",
      where: "Texte source.",
      how: "Remplace 'num' par ta valeur ou un Slider Control. Le formatage ajoute les espaces automatiquement.",
      params: [{ name: "num", desc: "La valeur à afficher/formater." }],
      code: [
        "num = Math.round(time * 5000);",
        "s = num.toString();",
        "r = '';",
        "for (i = 0; i < s.length; i++) {",
        "  if (i > 0 && (s.length - i) % 3 == 0) r += ' ';",
        "  r += s[i];",
        "}",
        "r;",
      ].join("\n"),
    },
    {
      id: "timecode",
      title: "Chronomètre / Timecode",
      category: "Texte",
      desc: "Affiche le temps écoulé au format horloge (MM:SS ou HH:MM:SS). Minuteur, compte à rebours, timer de stream.",
      where: "Texte source.",
      how: "Colle tel quel pour un chrono qui démarre au début du calque. Pour un compte à rebours, part d'une durée et soustrais le temps.",
      params: [{ name: "t", desc: "Le temps en secondes utilisé. Remplace par (60 - time) pour un décompte de 60 s." }],
      code: [
        "t = time;",
        "mm = Math.floor(t / 60);",
        "ss = Math.floor(t % 60);",
        "z = function(n){ return (n < 10 ? '0' : '') + n; };",
        "z(mm) + ':' + z(ss);",
      ].join("\n"),
    },
    {
      id: "typewriter",
      title: "Machine à écrire",
      category: "Texte",
      desc: "Révèle le texte caractère par caractère dans le temps, comme s'il était tapé.",
      where: "Texte source.",
      how: "Écris ta phrase dans 'str'. Règle la vitesse (caractères/seconde). Ajoute un curseur clignotant si tu veux.",
      params: [
        { name: "str", desc: "Le texte à révéler." },
        { name: "cps", desc: "Caractères par seconde." },
      ],
      code: ["str = 'Bonjour le monde';", "cps = 12;", "n = Math.floor(time * cps);", "str.substr(0, n);"].join("\n"),
    },
    {
      id: "text_scramble",
      title: "Texte brouillé (glitch/hacker)",
      category: "Texte",
      desc: "Fait défiler des caractères aléatoires, effet 'décryptage' / terminal hacker.",
      where: "Texte source.",
      how: "Change le jeu de caractères et la vitesse. Combine avec Posterize Time pour un rendu plus saccadé.",
      params: [
        { name: "chars", desc: "Les caractères tirés au hasard." },
        { name: "len", desc: "Longueur de la chaîne générée." },
      ],
      code: [
        "chars = 'ABCDEF0123456789#$%&';",
        "len = 10;",
        "seedRandom(Math.floor(time * 15), true);",
        "r = '';",
        "for (i = 0; i < len; i++) r += chars[Math.floor(random(0, chars.length))];",
        "r;",
      ].join("\n"),
    },

    /* ===================== COULEUR & STYLE ===================== */
    {
      id: "flicker",
      title: "Flicker (scintillement)",
      category: "Couleur & Style",
      desc: "Fait clignoter l'opacité de façon aléatoire : néon défaillant, vieille télé, ampoule qui grésille.",
      where: "Opacité.",
      how: "Règle la fréquence et le seuil. Plus le seuil est haut, plus le calque est souvent visible.",
      params: [
        { name: "freq", desc: "Fréquence du scintillement." },
        { name: "min/max", desc: "Bornes d'opacité aléatoire (%)." },
      ],
      code: ["freq = 15;", "seedRandom(Math.floor(time * freq), true);", "random(20, 100);"].join("\n"),
    },
    {
      id: "strobe",
      title: "Strobe (clignotement franc)",
      category: "Couleur & Style",
      desc: "Alterne visible / invisible de façon nette et régulière (stroboscope, alerte).",
      where: "Opacité.",
      how: "Colle sur Opacité. Change la fréquence pour accélérer/ralentir le clignotement.",
      params: [{ name: "fps", desc: "Nombre de clignotements par seconde." }],
      code: ["fps = 8;", "(Math.floor(time * fps) % 2 == 0) ? 100 : 0;"].join("\n"),
    },
    {
      id: "blink",
      title: "Clignotement doux",
      category: "Couleur & Style",
      desc: "Opacité qui pulse en douceur entre deux valeurs (respiration lumineuse, bouton actif).",
      where: "Opacité.",
      how: "Ajuste les bornes min/max et la vitesse. Sinus = transition douce (vs strobe qui est franc).",
      params: [
        { name: "min/max", desc: "Opacités basse et haute." },
        { name: "freq", desc: "Vitesse de la pulsation." },
      ],
      code: ["min = 30; max = 100; freq = 1;", "min + (max - min) * (Math.sin(time * freq * Math.PI * 2) * 0.5 + 0.5);"].join("\n"),
    },

    /* ===================== AUDIO ===================== */
    {
      id: "audio_scale",
      title: "Échelle réactive au son",
      category: "Audio",
      desc: "Fait grossir un calque en rythme avec l'audio : barres de spectre, cœur qui bat sur la musique, VU-mètre.",
      where: "Échelle (ou toute propriété à piloter).",
      how: "1) Sélectionne ton calque audio → clic droit → Keyframe Assistant → Convertir l'audio en keyframes. 2) Ça crée un calque 'Audio Amplitude'. 3) Colle ceci et ajuste le multiplicateur.",
      params: [
        { name: '"Audio Amplitude"', desc: "Le calque généré par la conversion audio→keyframes." },
        { name: "mult", desc: "Sensibilité : convertit l'amplitude en % d'échelle." },
      ],
      code: [
        'amp = thisComp.layer("Audio Amplitude").effect("Both Channels")("Slider");',
        "mult = 2;",
        "base = 100;",
        "[base + amp * mult, base + amp * mult];",
      ].join("\n"),
    },

    /* ===================== MATHS & UTILITAIRES ===================== */
    {
      id: "clamp",
      title: "Clamp (limiter une valeur)",
      category: "Maths & Utilitaires",
      desc: "Empêche une valeur de sortir d'un intervalle. Utile pour sécuriser une expression qui pourrait s'emballer.",
      where: "Toute propriété numérique.",
      how: "Enveloppe ta valeur ou une autre expression. Ici on limite l'opacité entre 0 et 100.",
      params: [
        { name: "min", desc: "Borne basse." },
        { name: "max", desc: "Borne haute." },
      ],
      code: "clamp(value, 0, 100);",
    },
    {
      id: "map_range",
      title: "Remapper une plage (linear)",
      category: "Maths & Utilitaires",
      desc: "Traduit une valeur d'un intervalle vers un autre. Ex : convertir une position 0→1920 en opacité 0→100.",
      where: "Toute propriété.",
      how: "Renseigne la source (input + ses bornes) et les bornes de sortie. linear plafonne aux extrêmes.",
      params: [
        { name: "input", desc: "La valeur d'entrée à convertir." },
        { name: "0,100 / 0,1", desc: "Bornes d'entrée puis de sortie." },
      ],
      code: ["input = transform.position[0];", "linear(input, 0, thisComp.width, 0, 100);"].join("\n"),
    },
    {
      id: "ease_range",
      title: "Remapper en douceur (ease)",
      category: "Maths & Utilitaires",
      desc: "Comme linear, mais avec des transitions accélérées/décélérées aux extrémités : rendu plus organique.",
      where: "Toute propriété.",
      how: "Idéal pour lier une valeur à une autre avec un feeling naturel plutôt que mécanique.",
      params: [{ name: "ease(t, tMin, tMax, vMin, vMax)", desc: "Même logique que linear, avec lissage." }],
      code: ["input = transform.position[0];", "ease(input, 0, thisComp.width, 0, 100);"].join("\n"),
    },
    {
      id: "distance",
      title: "Distance entre deux calques",
      category: "Maths & Utilitaires",
      desc: "Calcule la distance en pixels entre deux calques. Sert à déclencher des effets de proximité (grossir quand on s'approche, tracer une ligne).",
      where: "N'importe quelle propriété (souvent via un Slider intermédiaire).",
      how: "Nomme tes deux calques et colle. Combine avec linear() pour transformer la distance en autre chose.",
      params: [{ name: 'layer("A") / layer("B")', desc: "Les deux calques mesurés." }],
      code: ['a = thisComp.layer("A").transform.position;', 'b = thisComp.layer("B").transform.position;', "length(a, b);"].join("\n"),
    },
    {
      id: "index_offset",
      title: "Décalage par n° de calque",
      category: "Maths & Utilitaires",
      desc: "Utilise le numéro du calque (index) pour décaler automatiquement une valeur : dégradés d'animation, grilles, motifs répétés.",
      where: "Toute propriété, sur des calques dupliqués.",
      how: "Duplique un calque N fois : chaque copie se décale toute seule selon sa position dans la pile.",
      params: [{ name: "step", desc: "Décalage appliqué par calque (temps, position, teinte…)." }],
      code: ["step = 20;", "value + (index - 1) * step;"].join("\n"),
    },

    /* ===================== 3D & CAMÉRA ===================== */
    {
      id: "billboard",
      title: "Toujours face caméra (billboard)",
      category: "3D & Caméra",
      desc: "Force un calque 3D à toujours faire face à la caméra, comme un sprite. Évite qu'il ne devienne 'plat' quand la caméra tourne.",
      where: "Orientation d'un calque 3D (active la 3D du calque).",
      how: "Alternative propre à l'auto-orientation : le calque pivote pour suivre la caméra active en permanence.",
      params: [{ name: "thisComp.activeCamera", desc: "La caméra suivie. Nécessite une caméra dans la comp." }],
      code: ["cam = thisComp.activeCamera;", "lookAt(transform.position, cam.transform.position);"].join("\n"),
    },
    {
      id: "depth_scale",
      title: "Échelle selon la profondeur (faux 3D)",
      category: "3D & Caméra",
      desc: "Fait grossir un calque quand il se rapproche de la caméra et rétrécir quand il s'éloigne, pour un faux effet de profondeur en 2D.",
      where: "Échelle, en pilotant par la position Z (calque 3D) ou un Slider.",
      how: "Relie la profondeur (Z) à l'échelle : proche = grand, loin = petit.",
      params: [
        { name: "z", desc: "Profondeur du calque (position Z ou Slider)." },
        { name: "ref", desc: "Distance de référence où l'échelle vaut 100 %." },
      ],
      code: ["z = transform.position[2];", "ref = 1000;", "s = linear(z, 0, ref, 200, 50);", "[s, s];"].join("\n"),
    },
  ];

  /* --- Modèles de scripts .jsx pour After Effects ---
     Chaque entrée est une fonction qui reçoit des options et
     renvoie { filename, content }. */
  MH.scripts = {
    proxy: function (opts) {
      var format = opts.format || "QuickTime";
      var res = opts.res || "0.5";
      return {
        filename: "MH_Proxies.jsx",
        content: [
          "{",
          '    app.beginUndoGroup("Auto Proxy");',
          "    var sel = app.project.selection;",
          "    if (sel.length > 0) {",
          "        for (var i = 0; i < sel.length; i++) {",
          "            if (sel[i] instanceof FootageItem) {",
          "                var rq = app.project.renderQueue.items.add(sel[i]);",
          '                rq.outputModule(1).applyTemplate("' + format + '");',
          '                rq.outputModule(1).file = new File(sel[i].name + "_PROXY");',
          "            }",
          "        }",
          '        alert("' + Math.round(1 / res) + " métrage(s) ajouté(s) à la Render Queue (échelle 1/" + Math.round(1 / res) + ')!");',
          "    } else {",
          '        alert("Sélectionne des métrages dans le projet !");',
          "    }",
          "    app.endUndoGroup();",
          "}",
        ].join("\n"),
      };
    },

    structure: function () {
      return {
        filename: "MH_Structure.jsx",
        content: [
          "{",
          '    app.beginUndoGroup("Create Structure");',
          '    var f = ["00_RENDUS", "01_COMPOSITIONS", "02_PRECOMPS", "03_ASSETS", "04_SOLIDES"];',
          "    for (var i = 0; i < f.length; i++) { app.project.items.addFolder(f[i]); }",
          '    alert("Structure de dossiers créée !");',
          "    app.endUndoGroup();",
          "}",
        ].join("\n"),
      };
    },

    markers: function () {
      return {
        filename: "MH_Markers.jsx",
        content: [
          "{",
          "    var comp = app.project.activeItem;",
          "    if (comp && comp instanceof CompItem) {",
          '        var csv = "Timecode,Comment\\n";',
          "        var m = comp.markerProperty;",
          "        for (var i = 1; i <= m.numKeys; i++) {",
          '            csv += m.keyTime(i).toFixed(2) + "," + m.keyValue(i).comment + "\\n";',
          "        }",
          '        var f = new File(Folder.desktop.fsName + "/Marqueurs_" + comp.name + ".csv");',
          '        f.open("w"); f.write(csv); f.close();',
          '        alert("CSV exporté sur le bureau !");',
          "    } else {",
          '        alert("Aucune composition active.");',
          "    }",
          "}",
        ].join("\n"),
      };
    },

    easing: function () {
      return {
        filename: "MH_Easing.jsx",
        content: [
          "{",
          '    app.beginUndoGroup("Easy Ease");',
          "    var comp = app.project.activeItem;",
          "    if (comp) {",
          "        var sel = comp.selectedLayers;",
          "        for (var i = 0; i < sel.length; i++) {",
          "            var props = sel[i].selectedProperties;",
          "            for (var j = 0; j < props.length; j++) {",
          "                if (props[j].numKeys > 0) {",
          "                    var keys = props[j].selectedKeys;",
          "                    for (var k = 0; k < keys.length; k++) {",
          "                        props[j].setTemporalEaseAtKey(keys[k], [new KeyframeEase(0,75)], [new KeyframeEase(0,75)]);",
          "                    }",
          "                }",
          "            }",
          "        }",
          '        alert("Lissage 75% appliqué !");',
          "    }",
          "    app.endUndoGroup();",
          "}",
        ].join("\n"),
      };
    },

    sequencer: function (opts) {
      var frames = opts.frames || 5;
      return {
        filename: "MH_Sequencer.jsx",
        content: [
          "{",
          '    app.beginUndoGroup("Sequencer");',
          "    var comp = app.project.activeItem;",
          "    var d = " + frames + " * comp.frameDuration;",
          "    var sel = comp.selectedLayers;",
          "    for (var i = 0; i < sel.length; i++) { sel[i].startTime = sel[i].startTime + (i * d); }",
          "    app.endUndoGroup();",
          "}",
        ].join("\n"),
      };
    },

    cleaner: function () {
      return {
        filename: "MH_Cleaner.jsx",
        content: [
          "{",
          '    app.beginUndoGroup("Clean");',
          '    if (confirm("Supprimer les fichiers inutilisés du projet ?")) {',
          "        app.project.reduceProject(app.project.selection);",
          "    }",
          "    app.endUndoGroup();",
          "}",
        ].join("\n"),
      };
    },
  };

  /* --- Table de correspondance des types de fichiers --- */
  MH.fileTypes = [
    { exts: ["aep", "aet", "mogrt"], icon: "fa-video", cls: "ae-file", stat: "ae", label: "After Effects" },
    { exts: ["prproj", "prel"], icon: "fa-film", cls: "pr-file", stat: "pr", label: "Premiere Pro" },
    { exts: ["psd", "psb"], icon: "fa-image", cls: "ps-file", stat: "ps", label: "Photoshop" },
    { exts: ["ai", "eps"], icon: "fa-pen-nib", cls: "ai-file", stat: "ai", label: "Illustrator" },
    { exts: ["c4d", "obj", "fbx", "blend"], icon: "fa-cube", cls: "c4d-file", stat: "c4d", label: "3D" },
    { exts: ["mp3", "wav", "aif", "aiff", "sesx"], icon: "fa-music", cls: "aud-file", stat: "aud", label: "Audio" },
    { exts: ["mp4", "mov", "mkv", "avi"], icon: "fa-clapperboard", cls: "vid-file", stat: "vid", label: "Vidéo" },
    { exts: ["png", "jpg", "jpeg", "exr", "tif", "tiff", "gif"], icon: "fa-image", cls: "img-file", stat: "img", label: "Image" },
  ];
})(window.MH = window.MH || {});
