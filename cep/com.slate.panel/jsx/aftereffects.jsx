/* =========================================================
   Hôte After Effects (namespace SlateAe).
   Organisation du projet (dossiers), import des rushes, proxys,
   détection des médias manquants.
   ========================================================= */
var SlateAe = (function () {

  function findOrCreateFolder(parent, name) {
    // parent = FolderItem (ou app.project pour la racine)
    var items = (parent === app.project) ? app.project.items : parent.items;
    for (var i = 1; i <= items.length; i++) {
      var it = items[i];
      if (it instanceof FolderItem && it.name === name) return it;
    }
    var f = app.project.items.addFolder(name);
    if (parent !== app.project) f.parentFolder = parent;
    return f;
  }

  function folderFromPath(pathStr) {
    var segs = pathStr.split("/");
    var cur = app.project;
    for (var i = 0; i < segs.length; i++) {
      var n = segs[i].replace(/^\s+|\s+$/g, "");
      if (n) cur = findOrCreateFolder(cur, n);
    }
    return cur;
  }

  function countComps() {
    var n = 0;
    for (var i = 1; i <= app.project.numItems; i++) {
      if (app.project.item(i) instanceof CompItem) n++;
    }
    return n;
  }

  return {
    info: function () {
      try {
        var proj = app.project;
        var name = proj.file ? proj.file.name : "Projet sans titre";
        return slateOk({
          host: "After Effects",
          project: name,
          path: proj.file ? proj.file.fsName : "",
          items: proj.numItems,
          comps: countComps()
        });
      } catch (e) { return slateErr(e); }
    },

    createFolders: function (pathsStr) {
      try {
        app.beginUndoGroup("Slate : créer les dossiers");
        var paths = pathsStr.split("\n");
        var created = 0;
        for (var i = 0; i < paths.length; i++) {
          if (paths[i].replace(/\s/g, "") === "") continue;
          folderFromPath(paths[i]);
          created++;
        }
        app.endUndoGroup();
        return slateOk({ created: created });
      } catch (e) { app.endUndoGroup(); return slateErr(e); }
    },

    importRushes: function (folderName) {
      try {
        var folder = Folder.selectDialog("Slate : choisir le dossier de rushes");
        if (!folder) return slateErr("Import annulé.");
        var exts = /\.(mp4|mov|mxf|mkv|avi|m4v|webm|wav|mp3|aif|aiff|flac|png|jpg|jpeg|tif|tiff|exr|dng|psd|ai)$/i;
        var files = folder.getFiles(function (f) { return (f instanceof File) && exts.test(f.name); });
        if (!files || !files.length) return slateErr("Aucun média trouvé dans ce dossier.");
        app.beginUndoGroup("Slate : importer les rushes");
        var dest = findOrCreateFolder(app.project, folderName || "RUSHES");
        var imported = 0;
        for (var i = 0; i < files.length; i++) {
          try {
            var io = new ImportOptions(files[i]);
            var item = app.project.importFile(io);
            item.parentFolder = dest;
            imported++;
          } catch (e1) {}
        }
        app.endUndoGroup();
        return slateOk({ imported: imported, folder: (folderName || "RUSHES") });
      } catch (e) { app.endUndoGroup(); return slateErr(e); }
    },

    missingMedia: function () {
      try {
        var missing = [], total = 0;
        for (var i = 1; i <= app.project.numItems; i++) {
          var it = app.project.item(i);
          if (it instanceof FootageItem && it.mainSource && (it.mainSource instanceof FileSource)) {
            total++;
            if (it.footageMissing) missing.push(it.name);
          }
        }
        return slateOk({ total: total, missing: missing });
      } catch (e) { return slateErr(e); }
    },

    attachProxies: function () {
      try {
        var folder = Folder.selectDialog("Slate : choisir le dossier de proxys");
        if (!folder) return slateErr("Opération annulée.");
        var pfiles = folder.getFiles(function (f) { return f instanceof File; });
        var map = {};
        for (var i = 0; i < pfiles.length; i++) map[baseNoExt(pfiles[i].name).toLowerCase()] = pfiles[i];
        app.beginUndoGroup("Slate : attacher les proxys");
        var attached = 0, nomatch = 0;
        for (var j = 1; j <= app.project.numItems; j++) {
          var it = app.project.item(j);
          if (!(it instanceof FootageItem) || !it.mainSource || !(it.mainSource instanceof FileSource)) continue;
          var base = baseNoExt(it.name).toLowerCase();
          var cand = map[base] || map[base + "_proxy"] || map[base + "_prox"] || null;
          if (cand) { try { it.setProxy(cand); attached++; } catch (e2) { nomatch++; } }
          else nomatch++;
        }
        app.endUndoGroup();
        return slateOk({ attached: attached, nomatch: nomatch });
      } catch (e) { app.endUndoGroup(); return slateErr(e); }
    }
  };
})();
