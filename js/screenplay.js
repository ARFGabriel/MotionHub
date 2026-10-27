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
  var saveTimer = null;

  MH.screenplay = { init: init, parse: parse };

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

  /* ---------- Init ---------- */
  function init() {
    var ta = utils.$("#sp-text");
    if (!ta) return;

    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
    if (saved) load(saved);

    ta.addEventListener("input", function () { renderPreview(); scheduleSave(); });
    ["#sp-title", "#sp-author", "#sp-genre", "#sp-logline", "#sp-notes"].forEach(function (sel) {
      utils.$(sel).addEventListener("input", scheduleSave);
    });

    utils.$("#sp-context-toggle").addEventListener("click", function () {
      var c = utils.$("#sp-context");
      c.hidden = !c.hidden;
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
