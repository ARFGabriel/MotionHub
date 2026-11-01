/* =========================================================
   Hôte Premiere Pro (namespace SlatePr).
   Organisation du projet (bins), import des rushes, proxys,
   détection des médias manquants.
   ========================================================= */
var SlatePr = (function () {

  function findOrCreateBin(parent, name) {
    var kids = parent.children;
    for (var i = 0; i < kids.numItems; i++) {
      var it = kids[i];
      if (it && it.type === ProjectItemType.BIN && it.name === name) return it;
    }
    return parent.createBin(name);
  }

  function binFromPath(pathStr) {
    // "A/SOUS" -> crée/trouve A puis SOUS sous A, renvoie le dernier bin
    var segs = pathStr.split("/");
    var cur = app.project.rootItem;
    for (var i = 0; i < segs.length; i++) {
      var n = segs[i].replace(/^\s+|\s+$/g, "");
      if (n) cur = findOrCreateBin(cur, n);
    }
    return cur;
  }

  function collectClips(item, out) {
    var kids = item.children;
    if (!kids) return;
    for (var i = 0; i < kids.numItems; i++) {
      var it = kids[i];
      if (!it) continue;
      if (it.type === ProjectItemType.BIN) collectClips(it, out);
      else if (it.type === ProjectItemType.CLIP || it.type === ProjectItemType.FILE) out.push(it);
    }
  }

  function countItems(item) {
    var kids = item.children, n = 0;
    if (!kids) return 0;
    for (var i = 0; i < kids.numItems; i++) {
      var it = kids[i];
      if (!it) continue;
      n++;
      if (it.type === ProjectItemType.BIN) n += countItems(it);
    }
    return n;
  }

  return {
    info: function () {
      try {
        var proj = app.project;
        var seqs = 0;
        try { seqs = proj.sequences ? proj.sequences.numSequences : 0; } catch (e) {}
        return slateOk({
          host: "Premiere Pro",
          project: proj.name,
          path: proj.path || "",
          items: countItems(proj.rootItem),
          sequences: seqs
        });
      } catch (e) { return slateErr(e); }
    },

    createBins: function (pathsStr) {
      try {
        var paths = pathsStr.split("\n");
        var created = 0;
        for (var i = 0; i < paths.length; i++) {
          if (paths[i].replace(/\s/g, "") === "") continue;
          binFromPath(paths[i]);
          created++;
        }
        return slateOk({ created: created });
      } catch (e) { return slateErr(e); }
    },

    importRushes: function (binName) {
      try {
        var folder = Folder.selectDialog("Slate : choisir le dossier de rushes");
        if (!folder) return slateErr("Import annulé.");
        var exts = /\.(mp4|mov|mxf|mkv|avi|m4v|webm|wav|mp3|aif|aiff|flac|png|jpg|jpeg|tif|tiff|exr|dng|r3d|braw|ari)$/i;
        var files = folder.getFiles(function (f) { return (f instanceof File) && exts.test(f.name); });
        if (!files || !files.length) return slateErr("Aucun média trouvé dans ce dossier.");
        var bin = findOrCreateBin(app.project.rootItem, binName || "RUSHES");
        var paths = [];
        for (var i = 0; i < files.length; i++) paths.push(files[i].fsName);
        app.project.importFiles(paths, true, bin, false);
        return slateOk({ imported: files.length, bin: (binName || "RUSHES") });
      } catch (e) { return slateErr(e); }
    },

    missingMedia: function () {
      try {
        var items = [];
        collectClips(app.project.rootItem, items);
        var missing = [];
        for (var i = 0; i < items.length; i++) {
          var mp = "";
          try { mp = items[i].getMediaPath(); } catch (e) {}
          if (mp && !File(mp).exists) missing.push(items[i].name);
        }
        return slateOk({ total: items.length, missing: missing });
      } catch (e) { return slateErr(e); }
    },

    attachProxies: function () {
      try {
        var folder = Folder.selectDialog("Slate : choisir le dossier de proxys");
        if (!folder) return slateErr("Opération annulée.");
        var pfiles = folder.getFiles(function (f) { return f instanceof File; });
        var map = {};
        for (var i = 0; i < pfiles.length; i++) map[baseNoExt(pfiles[i].name).toLowerCase()] = pfiles[i].fsName;
        var items = [];
        collectClips(app.project.rootItem, items);
        var attached = 0, nomatch = 0;
        for (var j = 0; j < items.length; j++) {
          var mp = "";
          try { mp = items[j].getMediaPath(); } catch (e) {}
          if (!mp) { nomatch++; continue; }
          var base = baseNoExt(mp).toLowerCase();
          var cand = map[base] || map[base + "_proxy"] || map[base + "_prox"] || null;
          if (cand) { try { if (items[j].attachProxy(cand, 0)) attached++; else nomatch++; } catch (e2) { nomatch++; } }
          else nomatch++;
        }
        return slateOk({ attached: attached, nomatch: nomatch });
      } catch (e) { return slateErr(e); }
    }
  };
})();
