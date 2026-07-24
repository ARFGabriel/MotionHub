"use strict";

/**
 * Surveillance de dossier : détecte les nouveaux fichiers et n'agit
 * qu'une fois leur écriture terminée (taille stable), pour éviter de
 * traiter un fichier encore en cours de copie/rendu.
 * Module sans dépendance Electron → testable en Node pur.
 */
const fs = require("fs");
const path = require("path");

function createWatcher(folder, opts) {
  opts = opts || {};
  var stableMs = opts.stableMs || 2000;
  var filter = opts.filter || function () { return true; };
  var onNew = opts.onNew || function () {};

  var pending = new Set(); // fichiers en cours d'observation
  var done = new Set(); // déjà signalés (évite les doublons)

  function track(full) {
    if (pending.has(full) || done.has(full)) return;
    pending.add(full);
    var last = -1;
    var tick = function () {
      var st;
      try {
        st = fs.statSync(full);
      } catch (e) {
        pending.delete(full); // fichier disparu
        return;
      }
      if (st.size === last && st.size > 0) {
        pending.delete(full);
        done.add(full);
        onNew(full);
      } else {
        last = st.size;
        setTimeout(tick, stableMs);
      }
    };
    setTimeout(tick, stableMs);
  }

  var watcher = fs.watch(folder, { persistent: true }, function (event, filename) {
    if (!filename) return;
    var full = path.join(folder, filename);
    var st;
    try {
      st = fs.statSync(full);
    } catch (e) {
      return; // suppression / renommage sortant
    }
    if (st.isDirectory()) return;
    var ext = (filename.split(".").pop() || "").toLowerCase();
    if (!filter(ext)) return;
    track(full);
  });

  return {
    folder: folder,
    close: function () {
      try {
        watcher.close();
      } catch (e) {}
      pending.clear();
    },
  };
}

module.exports = { createWatcher: createWatcher };
