/* =========================================================
   ÉDITEUR DE SCÉNARIO
   Saisie en texte simple (style Fountain) + aperçu formaté
   en direct. Contexte de projet, export .fountain / PDF / Word
   (RTF), import. Auto-sauvegarde localStorage.
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var desktop = typeof window.motionHub !== "undefined" && window.motionHub.isDesktop;
  var KEY = "mh:screenplay";
  var KEY_DEC = "mh:decoupage";
  var saveTimer = null;
  var decRows = null; // lignes du découpage technique (chargées à l'init)

  var FRAMES = ["Très large", "Large", "Plan moyen", "Rapproché", "Gros plan", "Très gros plan", "Insert"];
  var ANGLES = ["Hauteur des yeux", "Plongée", "Contre-plongée", "Topshot", "Dutch angle"];
  var MOVES = ["Fixe", "Panoramique", "Tilt", "Travelling", "Zoom", "Gimbal / Steadicam", "Épaule"];

  MH.screenplay = { init: init, parse: parse, analyze: analyze };

  /* ---------- Parseur type Fountain ---------- */
  function isScene(l) {
    var s = l.replace(/^\s*\d+[.)]?\s+/, ""); // ignore un numéro de séquence en préfixe
    return /^(int|ext|int\.?\/ext|ext\.?\/int|i\/e)[\.\s\/]/i.test(s) || /^(int|ext)$/i.test(s);
  }
  function isTransition(l) {
    if (/^>/.test(l)) return true;
    return l === l.toUpperCase() && /:$/.test(l) && l.length <= 32 && /[A-ZÀ-Þ]/.test(l);
  }
  function hasLetter(l) { return /[A-Za-zÀ-ÿ]/.test(l); }
  function isCharacter(l, next) {
    if (/^@/.test(l)) return true;
    if (!hasLetter(l)) return false;
    if (l !== l.toUpperCase()) return false;
    if (l.length > 40) return false;
    if (/:$/.test(l)) return false;
    return !!(next && next.trim() !== "");
  }

  function parse(text) {
    var lines = (text || "").split(/\r?\n/);
    var out = [];
    var dialogue = false;
    for (var i = 0; i < lines.length; i++) {
      var raw = lines[i];
      var l = raw.replace(/\s+$/, "").trim();
      if (l === "") { out.push({ type: "blank", text: "" }); dialogue = false; continue; }
      if (isScene(l)) { out.push({ type: "scene", text: l.toUpperCase() }); dialogue = false; continue; }
      if (isTransition(l)) { out.push({ type: "transition", text: l.replace(/^>\s*/, "").toUpperCase() }); dialogue = false; continue; }
      if (!dialogue && isCharacter(l, lines[i + 1])) { out.push({ type: "character", text: l.replace(/^@/, "") }); dialogue = true; continue; }
      if (dialogue && /^\(.*\)$/.test(l)) { out.push({ type: "paren", text: l }); continue; }
      if (dialogue) { out.push({ type: "dialogue", text: l }); continue; }
      out.push({ type: "action", text: l });
    }
    return out;
  }

  /* ---------- Rendu aperçu ---------- */
  function renderPreview() {
    var parsed = parse(utils.$("#sp-text").value);
    var html = parsed
      .map(function (b) {
        if (b.type === "blank") return "";
        return '<div class="sp-' + b.type + '">' + utils.escapeHtml(b.text) + "</div>";
      })
      .join("");
    utils.$("#sp-preview").innerHTML = html || '<div class="muted">L\'aperçu formaté apparaîtra ici.</div>';
    renderStats(parsed);
  }

  function renderStats(parsed) {
    var scenes = parsed.filter(function (b) { return b.type === "scene"; }).length;
    var chars = utils.$("#sp-text").value.replace(/\s+/g, " ").trim().length;
    var pages = Math.max(0, Math.round((chars / 1500) * 10) / 10);
    utils.$("#sp-stats").textContent =
      scenes + " séquence" + (scenes > 1 ? "s" : "") + " · ≈ " + pages + " page" + (pages > 1 ? "s" : "") + " (≈ " + Math.round(pages) + " min)";
  }

  /* ---------- État / sauvegarde ---------- */
  function collect() {
    return {
      title: utils.$("#sp-title").value,
      author: utils.$("#sp-author").value,
      genre: utils.$("#sp-genre").value,
      logline: utils.$("#sp-logline").value,
      notes: utils.$("#sp-notes").value,
      text: utils.$("#sp-text").value,
    };
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(collect())); } catch (e) {}
  }
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 400);
  }
  function load(d) {
    utils.$("#sp-title").value = d.title || "";
    utils.$("#sp-author").value = d.author || "";
    utils.$("#sp-genre").value = d.genre || "";
    utils.$("#sp-logline").value = d.logline || "";
    utils.$("#sp-notes").value = d.notes || "";
    utils.$("#sp-text").value = d.text || "";
  }

  /* ---------- Fountain (export / import) ---------- */
  function buildFountain() {
    var d = collect();
    var tp = [];
    if (d.title) tp.push("Title: " + d.title);
    if (d.author) tp.push("Author: " + d.author);
    if (d.genre) tp.push("Genre: " + d.genre);
    if (d.logline) tp.push("Logline: " + d.logline);
    if (d.notes) tp.push("Notes: " + d.notes.replace(/\n/g, " "));
    return (tp.length ? tp.join("\n") + "\n\n" : "") + d.text;
  }

  function parseFountain(fileText) {
    var text = fileText.replace(/\r\n/g, "\n");
    var ctx = {};
    // Title page = clés "Clé: valeur" en tête jusqu'à la première ligne vide.
    var lines = text.split("\n");
    var i = 0;
    var isTitlePage = /^[A-Za-zÀ-ÿ ]{2,20}:/.test(lines[0] || "");
    if (isTitlePage) {
      for (; i < lines.length; i++) {
        var l = lines[i];
        if (l.trim() === "") { i++; break; }
        var m = l.match(/^([A-Za-zÀ-ÿ ]{2,20}):\s*(.*)$/);
        if (!m) continue;
        var key = m[1].toLowerCase().trim();
        var val = m[2].trim();
        if (key === "title") ctx.title = val;
        else if (key === "author" || key === "auteur") ctx.author = val;
        else if (key === "genre") ctx.genre = val;
        else if (key === "logline") ctx.logline = val;
        else if (key === "notes") ctx.notes = val;
      }
    }
    ctx.text = lines.slice(i).join("\n").replace(/^\n+/, "");
    return ctx;
  }

  /* ---------- Word (RTF) ---------- */
  function rtfEsc(s) {
    s = (s || "").replace(/\\/g, "\\\\").replace(/\{/g, "\\{").replace(/\}/g, "\\}");
    return s.replace(/[\u0080-\uFFFF]/g, function (c) { return "\\u" + c.charCodeAt(0) + "?"; });
  }
  function buildRTF() {
    var d = collect();
    var parsed = parse(d.text);
    var body = "";
    if (d.title) body += "\\pard\\qc\\b\\fs36 " + rtfEsc(d.title.toUpperCase()) + "\\b0\\fs24\\par\n";
    if (d.author) body += "\\pard\\qc " + rtfEsc(d.author) + "\\par\n";
    if (d.title || d.author) body += "\\par\\par\n";
    parsed.forEach(function (b) {
      if (b.type === "blank") { body += "\\par\n"; return; }
      var t = rtfEsc(b.text);
      switch (b.type) {
        case "scene": body += "\\pard\\b " + t + "\\b0\\par\n"; break;
        case "character": body += "\\pard\\li3600 " + t + "\\par\n"; break;
        case "paren": body += "\\pard\\li3000 " + t + "\\par\n"; break;
        case "dialogue": body += "\\pard\\li2160\\ri1440 " + t + "\\par\n"; break;
        case "transition": body += "\\pard\\qr " + t + "\\par\n"; break;
        default: body += "\\pard " + t + "\\par\n";
      }
    });
    return "{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Courier New;}}\\f0\\fs24\n" + body + "}";
  }

  /* ---------- HTML pour le PDF ---------- */
  function buildHTML() {
    var d = collect();
    var parsed = parse(d.text);
    var blocks = parsed
      .map(function (b) {
        if (b.type === "blank") return "";
        return '<div class="' + b.type + '">' + utils.escapeHtml(b.text) + "</div>";
      })
      .join("\n");
    var title = d.title ? '<div class="tp"><h1>' + utils.escapeHtml(d.title.toUpperCase()) + "</h1>" +
      (d.author ? "<p>" + utils.escapeHtml(d.author) + "</p>" : "") + "</div>" : "";
    return [
      "<!DOCTYPE html><html><head><meta charset='utf-8'><style>",
      "@page{size:Letter;margin:0;}",
      "body{font-family:'Courier New',monospace;font-size:12pt;color:#000;line-height:1;padding:1in 1in 1in 1.5in;box-sizing:border-box;}",
      ".tp{height:9in;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;page-break-after:always;}",
      ".tp h1{font-size:14pt;letter-spacing:1px;}",
      ".scene{font-weight:bold;text-transform:uppercase;margin:1.5em 0 .4em;}",
      ".action{margin:0 0 .4em;}",
      ".character{margin:.8em 0 0;margin-left:2in;}",
      ".paren{margin-left:1.5in;}",
      ".dialogue{margin-left:1in;margin-right:1.5in;}",
      ".transition{text-align:right;margin:.6em 0;}",
      "</style></head><body>",
      title,
      blocks,
      "</body></html>",
    ].join("\n");
  }

  /* ---------- Exports ---------- */
  function safeName() {
    return ((utils.$("#sp-title").value || "scenario").trim().replace(/[^\w\-]+/g, "_") || "scenario");
  }
  function exportFountain() {
    utils.download(safeName() + ".fountain", buildFountain());
    utils.toast("Exporté en .fountain", "success");
  }
  function exportWord() {
    utils.download(safeName() + ".rtf", buildRTF());
    utils.toast("Exporté (RTF, ouvrable dans Word)", "success");
  }
  function exportPdf() {
    var html = buildHTML();
    if (desktop && window.motionHub.screenplay && window.motionHub.screenplay.exportPdf) {
      window.motionHub.screenplay.exportPdf(html, safeName()).then(function (res) {
        if (res && res.canceled) return;
        utils.toast("PDF exporté.", "success");
      }).catch(function (e) { utils.toast("Erreur PDF : " + e.message, "error"); });
    } else {
      // Repli web : fenêtre d'impression
      var w = window.open("", "_blank");
      if (!w) { utils.toast("Autorise les pop-ups pour l'export PDF.", "warn"); return; }
      w.document.write(html);
      w.document.close();
      setTimeout(function () { w.print(); }, 300);
    }
  }

  /* ---------- Insertion assistée ---------- */
  function insert(kind) {
    var ta = utils.$("#sp-text");
    var snippets = {
      scene: "\n\nINT. LIEU - JOUR\n\n",
      action: "\n\nAction décrite au présent.\n",
      character: "\n\nPERSONNAGE\nSa réplique.\n",
      paren: "(ton de la réplique)\n",
      transition: "\n\nCUT TO:\n\n",
    };
    var snip = snippets[kind] || "";
    var start = ta.selectionStart || ta.value.length;
    ta.value = ta.value.slice(0, start) + snip + ta.value.slice(ta.selectionEnd || start);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = start + snip.length;
    renderPreview();
    scheduleSave();
  }

  /* ---------- Analyse du scénario ---------- */
  function countWords(s) {
    var t = (s || "").trim();
    if (!t) return 0;
    return t.split(/\s+/).length;
  }
  function cleanName(n) {
    return (n || "").replace(/\s*\([^)]*\)\s*$/, "").replace(/\s{2,}/g, " ").trim();
  }
  function parseHeading(h) {
    var s = (h || "").replace(/^\s*\d+[.)]?\s*/, "");
    var m = s.match(/^(INT\.?\/EXT\.?|EXT\.?\/INT\.?|I\/E|INT\.?|EXT\.?)\s*[.\-\s]\s*/i);
    var prefix = "", rest = s;
    if (m) {
      prefix = m[1].toUpperCase().replace(/\./g, "");
      rest = s.slice(m[0].length);
    }
    var loc = rest, time = "";
    var parts = rest.split(/\s[-–—]\s/);
    if (parts.length > 1) { time = parts[parts.length - 1].trim(); loc = parts.slice(0, -1).join(" - ").trim(); }
    return { type: prefix || "—", loc: (loc || "—").toUpperCase().trim(), time: time.toUpperCase().trim() };
  }
  function timeBucket(t) {
    if (/NUIT|SOIR|NIGHT|AUBE|CRÉPUSCULE|CREPUSCULE/.test(t)) return "nuit";
    if (/JOUR|MATIN|APRÈS|APRES|MIDI|DAY/.test(t)) return "jour";
    return "autre";
  }

  function analyze(parsed) {
    var scenes = [];
    var chars = {};
    var locs = {};
    var cur = null, curIdx = -1, curChar = null;
    var totalWords = 0, dialogueWords = 0, actionWords = 0;
    var intCount = 0, extCount = 0, dayCount = 0, nightCount = 0, otherTime = 0;

    parsed.forEach(function (b) {
      if (b.type === "scene") {
        var h = parseHeading(b.text);
        cur = { heading: b.text, type: h.type, loc: h.loc, time: h.time, chars: {}, firstAction: "" };
        scenes.push(cur); curIdx = scenes.length - 1; curChar = null;
        if (/EXT/.test(h.type)) extCount++;
        if (/INT/.test(h.type)) intCount++;
        var tb = timeBucket(h.time);
        if (tb === "jour") dayCount++; else if (tb === "nuit") nightCount++; else otherTime++;
        if (!locs[h.loc]) locs[h.loc] = { name: h.loc, scenes: 0, type: h.type };
        locs[h.loc].scenes++;
      } else if (b.type === "character") {
        curChar = cleanName(b.text);
        if (!curChar) return;
        if (!chars[curChar]) chars[curChar] = { name: curChar, cues: 0, words: 0, scenes: {} };
        chars[curChar].cues++;
        if (cur) { cur.chars[curChar] = true; chars[curChar].scenes[curIdx] = true; }
      } else if (b.type === "dialogue") {
        var w = countWords(b.text);
        dialogueWords += w; totalWords += w;
        if (curChar && chars[curChar]) chars[curChar].words += w;
      } else if (b.type === "action") {
        var wa = countWords(b.text);
        actionWords += wa; totalWords += wa;
        if (cur && !cur.firstAction) cur.firstAction = b.text;
      }
    });

    var charList = Object.keys(chars).map(function (k) {
      var c = chars[k];
      return {
        name: c.name, cues: c.cues, words: c.words,
        scenes: Object.keys(c.scenes).length,
        share: dialogueWords ? c.words / dialogueWords : 0,
      };
    }).sort(function (a, b) { return b.words - a.words || b.cues - a.cues; });

    var locList = Object.keys(locs).map(function (k) { return locs[k]; })
      .sort(function (a, b) { return b.scenes - a.scenes; });

    return {
      scenes: scenes, sceneCount: scenes.length,
      intCount: intCount, extCount: extCount,
      dayCount: dayCount, nightCount: nightCount, otherTime: otherTime,
      totalWords: totalWords, dialogueWords: dialogueWords, actionWords: actionWords,
      characters: charList, locations: locList,
    };
  }

  function renderAnalysis() {
    var panel = utils.$("#sp-analysis");
    if (!panel || panel.hidden) return;
    var a = analyze(parse(utils.$("#sp-text").value));
    var pages = Math.round((utils.$("#sp-text").value.replace(/\s+/g, " ").trim().length / 1500) * 10) / 10;

    function card(label, value, sub) {
      return '<div class="sp-ana-card"><div class="sp-ana-val">' + value + "</div>" +
        '<div class="sp-ana-lab">' + label + "</div>" +
        (sub ? '<div class="sp-ana-sub">' + sub + "</div>" : "") + "</div>";
    }
    utils.$("#sp-ana-cards").innerHTML =
      card("Séquences", a.sceneCount, a.intCount + " INT · " + a.extCount + " EXT") +
      card("Décors", a.locations.length, "lieux distincts") +
      card("Personnages", a.characters.length, "avec répliques") +
      card("Jour / Nuit", a.dayCount + " / " + a.nightCount, (a.otherTime ? a.otherTime + " autre" : "&nbsp;")) +
      card("Mots", a.totalWords, a.dialogueWords + " en dialogue") +
      card("Durée est.", "≈ " + Math.round(pages) + " min", "≈ " + pages + " pages");

    if (!a.characters.length) {
      utils.$("#sp-ana-chars").innerHTML = '<p class="muted">Aucun personnage détecté. Écris un nom EN MAJUSCULES au-dessus d\'une réplique.</p>';
    } else {
      var rows = a.characters.map(function (c) {
        var pct = Math.round(c.share * 100);
        return "<tr><td class='sp-ana-name'>" + utils.escapeHtml(c.name) + "</td>" +
          "<td>" + c.cues + "</td><td>" + c.words + "</td><td>" + c.scenes + "</td>" +
          "<td class='sp-ana-share'><span class='sp-ana-bar' style='width:" + pct + "%'></span><em>" + pct + "%</em></td></tr>";
      }).join("");
      utils.$("#sp-ana-chars").innerHTML =
        "<table class='sp-ana-table'><thead><tr><th>Personnage</th><th>Répl.</th><th>Mots</th><th>Scènes</th><th>Temps de parole</th></tr></thead><tbody>" +
        rows + "</tbody></table>";
    }

    if (!a.locations.length) {
      utils.$("#sp-ana-locs").innerHTML = '<p class="muted">Aucun décor détecté.</p>';
    } else {
      var lrows = a.locations.map(function (l) {
        return "<tr><td>" + utils.escapeHtml(l.type) + "</td><td class='sp-ana-name'>" + utils.escapeHtml(l.name) + "</td><td>" + l.scenes + "</td></tr>";
      }).join("");
      utils.$("#sp-ana-locs").innerHTML =
        "<table class='sp-ana-table'><thead><tr><th>Type</th><th>Décor</th><th>Scènes</th></tr></thead><tbody>" +
        lrows + "</tbody></table>";
    }
  }

  /* ---------- Découpage technique ---------- */
  function loadDec() {
    if (decRows) return decRows;
    try { decRows = JSON.parse(localStorage.getItem(KEY_DEC) || "null"); } catch (e) {}
    if (!decRows) decRows = [];
    return decRows;
  }
  function saveDec() {
    try { localStorage.setItem(KEY_DEC, JSON.stringify(decRows || [])); } catch (e) {}
  }
  function generateDecoupage() {
    var a = analyze(parse(utils.$("#sp-text").value));
    var rows = [];
    a.scenes.forEach(function (sc, i) {
      var label = (i + 1) + ". " + sc.type + " " + sc.loc + (sc.time ? " - " + sc.time : "");
      rows.push({
        id: "d" + Date.now() + "_" + i,
        scene: label,
        shot: "1",
        value: "Plan moyen",
        angle: "Hauteur des yeux",
        move: "Fixe",
        desc: sc.firstAction ? sc.firstAction.slice(0, 120) : "",
      });
    });
    decRows = rows;
    saveDec();
    renderDecoupage();
  }
  function sel(id, options, value) {
    var o = options.map(function (op) {
      return "<option" + (op === value ? " selected" : "") + ">" + utils.escapeHtml(op) + "</option>";
    }).join("");
    return "<select data-dec='" + id + "'>" + o + "</select>";
  }
  function renderDecoupage() {
    var wrap = utils.$("#sp-dec-table");
    if (!wrap) return;
    loadDec();
    if (!decRows.length) {
      wrap.innerHTML = '<p class="muted">Aucune ligne. Clique « Régénérer » pour créer une ligne par séquence, ou « Ligne » pour partir de zéro.</p>';
      return;
    }
    var body = decRows.map(function (r) {
      return "<tr data-id='" + r.id + "'>" +
        "<td><input data-dec='scene' value='" + utils.escapeHtml(r.scene) + "'></td>" +
        "<td class='sp-dec-shot'><input data-dec='shot' value='" + utils.escapeHtml(r.shot) + "'></td>" +
        "<td>" + sel("value", FRAMES, r.value) + "</td>" +
        "<td>" + sel("angle", ANGLES, r.angle) + "</td>" +
        "<td>" + sel("move", MOVES, r.move) + "</td>" +
        "<td><input data-dec='desc' value='" + utils.escapeHtml(r.desc) + "'></td>" +
        "<td><button class='sp-dec-del' title='Supprimer'><i class='fas fa-xmark'></i></button></td></tr>";
    }).join("");
    wrap.innerHTML =
      "<table class='sp-dec-table'><thead><tr><th>Séquence</th><th>Plan</th><th>Cadre</th><th>Angle</th><th>Mouvement</th><th>Description / action</th><th></th></tr></thead><tbody>" +
      body + "</tbody></table>";

    wrap.querySelectorAll("tr[data-id]").forEach(function (tr) {
      var id = tr.getAttribute("data-id");
      var row = decRows.filter(function (x) { return x.id === id; })[0];
      if (!row) return;
      tr.querySelectorAll("[data-dec]").forEach(function (f) {
        f.addEventListener("change", function () { row[f.getAttribute("data-dec")] = f.value; saveDec(); });
        if (f.tagName === "INPUT") f.addEventListener("input", function () { row[f.getAttribute("data-dec")] = f.value; scheduleDecSave(); });
      });
      tr.querySelector(".sp-dec-del").addEventListener("click", function () {
        decRows = decRows.filter(function (x) { return x.id !== id; });
        saveDec(); renderDecoupage();
      });
    });
  }
  var decSaveTimer = null;
  function scheduleDecSave() { clearTimeout(decSaveTimer); decSaveTimer = setTimeout(saveDec, 400); }
  function addDecRow() {
    loadDec();
    decRows.push({ id: "d" + Date.now(), scene: "", shot: "1", value: "Plan moyen", angle: "Hauteur des yeux", move: "Fixe", desc: "" });
    saveDec(); renderDecoupage();
  }
  function decToShotlist() {
    loadDec();
    if (!decRows.length) { utils.toast("Rien à envoyer.", "warn"); return; }
    var shots = [];
    try { shots = JSON.parse(localStorage.getItem("mh:shotlist") || "[]"); } catch (e) {}
    decRows.forEach(function (r, i) {
      shots.push({
        id: "s" + Date.now() + "_" + i,
        desc: (r.scene ? "[" + r.scene + "] " : "") + (r.desc || "Plan " + r.shot),
        frame: r.value, angle: r.angle, move: r.move, lens: "", done: false,
      });
    });
    try { localStorage.setItem("mh:shotlist", JSON.stringify(shots)); } catch (e) {}
    utils.toast(decRows.length + " plan(s) ajouté(s) à la shot list du Tournage.", "success");
  }
  function decToCSV() {
    loadDec();
    if (!decRows.length) { utils.toast("Rien à exporter.", "warn"); return; }
    function q(s) { return '"' + String(s == null ? "" : s).replace(/"/g, '""') + '"'; }
    var head = ["Séquence", "Plan", "Cadre", "Angle", "Mouvement", "Description"];
    var lines = [head.map(q).join(";")];
    decRows.forEach(function (r) {
      lines.push([r.scene, r.shot, r.value, r.angle, r.move, r.desc].map(q).join(";"));
    });
    utils.download(safeName() + "_decoupage.csv", "﻿" + lines.join("\r\n"));
    utils.toast("Découpage exporté en CSV.", "success");
  }

  /* ---------- Assistant IA ---------- */
  var aiCfg = { hasKey: false, model: "claude-sonnet-5-5" };
  var aiOutText = "";
  var aiBusy = false;

  var AI_SYSTEM =
    "Tu es un assistant d'écriture de scénario francophone, expert en dramaturgie. " +
    "Tu écris au format scénario standard (type Fountain) : séquences sous la forme " +
    "\"INT./EXT. LIEU - MOMENT\" en majuscules, noms de personnages EN MAJUSCULES au-dessus " +
    "de leurs répliques, didascalies entre parenthèses, descriptions d'action au présent. " +
    "Réponds UNIQUEMENT avec le contenu demandé, prêt à être collé dans le scénario, " +
    "sans préambule, sans explication, sans texte entre guillemets de code.";

  var AI_TEMPLATES = {
    idees: "Propose 3 idées d'histoire courtes (pitch de 2-3 phrases chacune) cohérentes avec le contexte du projet.",
    intro: "Écris une scène d'ouverture (une séquence) qui installe l'ambiance et le personnage principal.",
    sequencier: "Propose un séquencier : une liste numérotée de 6 à 12 séquences, chacune avec son intitulé (INT./EXT. LIEU - MOMENT) suivi d'une phrase résumant ce qui s'y passe.",
    suite: "Dans la continuité de l'extrait fourni, écris la ou les deux séquences suivantes.",
    dialogue: "Écris un dialogue vivant et naturel pour la situation décrite.",
    reformuler: "Reformule le passage sélectionné en gardant le sens et en améliorant le style, au format scénario.",
    transition: "Propose une idée de transition (visuelle ou narrative) entre les séquences autour du passage fourni.",
  };

  function ctxBlock() {
    var d = collect();
    var p = [];
    if (d.title) p.push("Titre : " + d.title);
    if (d.genre) p.push("Format/genre : " + d.genre);
    if (d.logline) p.push("Logline : " + d.logline);
    if (d.notes) p.push("Notes : " + d.notes);
    return p.length ? p.join("\n") : "(aucun contexte renseigné)";
  }
  function selectionText() {
    var ta = utils.$("#sp-text");
    if (ta.selectionStart != null && ta.selectionEnd > ta.selectionStart) {
      return ta.value.slice(ta.selectionStart, ta.selectionEnd);
    }
    return "";
  }

  function refreshAi() {
    if (!desktop || !window.motionHub.ai) {
      aiToggleNotice("web");
      return Promise.resolve();
    }
    return window.motionHub.ai.getConfig().then(function (c) {
      aiCfg = c || aiCfg;
      var ms = utils.$("#sp-ai-model");
      if (ms) ms.textContent = "Modèle : " + aiCfg.model;
      aiToggleNotice(aiCfg.hasKey ? "ok" : "nokey");
      // refléter dans Réglages
      var st = utils.$("#ai-status");
      if (st) {
        st.textContent = aiCfg.hasKey ? "✓ Clé configurée — assistant actif." : "Aucune clé enregistrée.";
        st.classList.toggle("ok", aiCfg.hasKey);
      }
      var sel = utils.$("#ai-model");
      if (sel) sel.value = aiCfg.model;
    });
  }
  function aiToggleNotice(state) {
    var nokey = utils.$("#sp-ai-nokey"), web = utils.$("#sp-ai-web"), body = utils.$("#sp-ai-body");
    if (!body) return;
    if (web) web.hidden = state !== "web";
    if (nokey) nokey.hidden = state !== "nokey";
    body.hidden = state !== "ok";
  }

  function runAi() {
    if (aiBusy) return;
    if (!desktop || !window.motionHub.ai) { utils.toast("IA disponible dans l'app installée.", "warn"); return; }
    if (!aiCfg.hasKey) { utils.toast("Ajoute ta clé API dans les Réglages.", "warn"); return; }
    var instruction = utils.$("#sp-ai-prompt").value.trim();
    if (!instruction) { utils.toast("Décris ce que tu veux, ou clique une suggestion.", "warn"); return; }

    var useSel = utils.$("#sp-ai-usesel").checked;
    var sel = selectionText();
    var base;
    if (useSel && sel) base = "PASSAGE SÉLECTIONNÉ :\n" + sel;
    else base = "EXTRAIT DU SCÉNARIO (pour la continuité) :\n" + (utils.$("#sp-text").value.slice(-6000) || "(vide)");

    var prompt = "CONTEXTE DU PROJET :\n" + ctxBlock() + "\n\n" + base + "\n\nDEMANDE :\n" + instruction;

    aiBusy = true;
    var btn = utils.$("#sp-ai-run");
    var old = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération…';

    window.motionHub.ai.complete(AI_SYSTEM, prompt, 2500).then(function (res) {
      aiBusy = false; btn.disabled = false; btn.innerHTML = old;
      if (!res || res.error) { utils.toast("IA : " + ((res && res.error) || "erreur inconnue"), "error"); return; }
      aiOutText = res.text || "";
      utils.$("#sp-ai-out-text").textContent = aiOutText;
      utils.$("#sp-ai-out").hidden = false;
      utils.$("#sp-ai-out").scrollIntoView({ behavior: "smooth", block: "nearest" });
    }).catch(function (e) {
      aiBusy = false; btn.disabled = false; btn.innerHTML = old;
      utils.toast("IA : " + e.message, "error");
    });
  }

  function aiInsert() {
    if (!aiOutText) return;
    var ta = utils.$("#sp-text");
    var pos = ta.selectionStart != null ? ta.selectionStart : ta.value.length;
    var chunk = "\n\n" + aiOutText.trim() + "\n";
    ta.value = ta.value.slice(0, pos) + chunk + ta.value.slice(ta.selectionEnd != null ? ta.selectionEnd : pos);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = pos + chunk.length;
    renderPreview(); renderAnalysis(); scheduleSave();
    utils.toast("Texte inséré.", "success");
  }

  function initAiSettings() {
    var saveBtn = utils.$("#ai-save");
    if (!saveBtn) return;
    if (!desktop || !window.motionHub.ai) {
      var st = utils.$("#ai-status");
      if (st) st.textContent = "Disponible uniquement dans l'app Slate installée.";
      ["#ai-key", "#ai-model", "#ai-save", "#ai-clear"].forEach(function (s) { var el = utils.$(s); if (el) el.disabled = true; });
      return;
    }
    saveBtn.addEventListener("click", function () {
      var key = utils.$("#ai-key").value;
      var model = utils.$("#ai-model").value;
      window.motionHub.ai.setConfig(key, model).then(function (c) {
        aiCfg = c; utils.$("#ai-key").value = "";
        utils.toast("Réglages IA enregistrés.", "success");
        refreshAi();
      });
    });
    utils.$("#ai-clear").addEventListener("click", function () {
      window.motionHub.ai.setConfig("", utils.$("#ai-model").value).then(function (c) {
        aiCfg = c; utils.$("#ai-key").value = "";
        utils.toast("Clé effacée.", "success");
        refreshAi();
      });
    });
  }

  /* ---------- Init ---------- */
  function init() {
    var ta = utils.$("#sp-text");
    if (!ta) return;

    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
    if (saved) load(saved);

    ta.addEventListener("input", function () { renderPreview(); renderAnalysis(); scheduleSave(); });
    ["#sp-title", "#sp-author", "#sp-genre", "#sp-logline", "#sp-notes"].forEach(function (s) {
      utils.$(s).addEventListener("input", scheduleSave);
    });

    utils.$("#sp-context-toggle").addEventListener("click", function () {
      var c = utils.$("#sp-context");
      c.hidden = !c.hidden;
    });

    utils.$("#sp-analysis-toggle").addEventListener("click", function () {
      var p = utils.$("#sp-analysis");
      p.hidden = !p.hidden;
      if (!p.hidden) renderAnalysis();
    });

    utils.$("#sp-analysis-decoupage").addEventListener("click", function () {
      var d = utils.$("#sp-decoupage");
      d.hidden = false;
      loadDec();
      if (!decRows.length) generateDecoupage(); else renderDecoupage();
      d.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Assistant IA
    initAiSettings();
    utils.$("#sp-ai-toggle").addEventListener("click", function () {
      var p = utils.$("#sp-ai");
      p.hidden = !p.hidden;
      if (!p.hidden) refreshAi();
    });
    utils.$$("#sp-ai .sp-ai-quick [data-ai]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tpl = AI_TEMPLATES[btn.dataset.ai] || "";
        utils.$("#sp-ai-prompt").value = tpl;
        utils.$("#sp-ai-usesel").checked = (btn.dataset.ai === "reformuler" || btn.dataset.ai === "dialogue");
        utils.$("#sp-ai-prompt").focus();
      });
    });
    utils.$("#sp-ai-run").addEventListener("click", runAi);
    utils.$("#sp-ai-insert").addEventListener("click", aiInsert);
    utils.$("#sp-ai-copy").addEventListener("click", function () {
      if (!aiOutText) return;
      navigator.clipboard.writeText(aiOutText).then(function () { utils.toast("Copié.", "success"); });
    });
    var goSettings = utils.$("#sp-ai-gosettings");
    if (goSettings) goSettings.addEventListener("click", function () {
      if (MH.showTool) MH.showTool("settings"); else location.hash = "#settings";
    });

    utils.$("#sp-dec-addrow").addEventListener("click", addDecRow);
    utils.$("#sp-dec-tolist").addEventListener("click", decToShotlist);
    utils.$("#sp-dec-csv").addEventListener("click", decToCSV);
    utils.$("#sp-dec-regen").addEventListener("click", function () {
      if (decRows && decRows.length && !window.confirm("Régénérer effacera les lignes actuelles du découpage. Continuer ?")) return;
      generateDecoupage();
    });

    utils.$$(".sp-inserts [data-ins]").forEach(function (btn) {
      btn.addEventListener("click", function () { insert(btn.dataset.ins); });
    });

    utils.$("#sp-exp-fountain").addEventListener("click", exportFountain);
    utils.$("#sp-exp-word").addEventListener("click", exportWord);
    utils.$("#sp-exp-pdf").addEventListener("click", exportPdf);

    utils.$("#sp-import").addEventListener("click", function () { utils.$("#sp-file").click(); });
    utils.$("#sp-file").addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var ctx = parseFountain(String(reader.result));
        load({
          title: ctx.title || utils.$("#sp-title").value,
          author: ctx.author || utils.$("#sp-author").value,
          genre: ctx.genre || utils.$("#sp-genre").value,
          logline: ctx.logline || utils.$("#sp-logline").value,
          notes: ctx.notes || utils.$("#sp-notes").value,
          text: ctx.text || "",
        });
        renderPreview();
        save();
        utils.toast("Scénario importé.", "success");
      };
      reader.readAsText(f);
      e.target.value = "";
    });

    renderPreview();
  }
})(window.MH = window.MH || {});
