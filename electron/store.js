"use strict";

/**
 * Persistance simple sur disque (JSON) dans le dossier userData d'Electron.
 * Évite une dépendance externe pour un besoin trivial.
 */
const fs = require("fs");
const path = require("path");

class Store {
  constructor(filePath, defaults) {
    this.path = filePath;
    this.data = this._load(defaults || {});
  }

  _load(defaults) {
    try {
      const raw = fs.readFileSync(this.path, "utf-8");
      return Object.assign({}, defaults, JSON.parse(raw));
    } catch (e) {
      return Object.assign({}, defaults);
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this._save();
    return value;
  }

  _save() {
    try {
      fs.mkdirSync(path.dirname(this.path), { recursive: true });
      fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("[store] Échec de sauvegarde :", e);
    }
  }
}

module.exports = Store;
