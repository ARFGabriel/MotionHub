/* =========================================================
   JOURNAL D'ACTIVITÉ
   Historique persistant des jobs (proxy, transcode, LUT,
   frames, séquence, surveillance). Alimente le dashboard.
   ========================================================= */
(function (MH) {
  "use strict";

  var KEY = "mh:activity";
  var MAX = 60;
  var listeners = [];

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function save(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {}
  }

  // entry : { type, label, output? }
  function log(entry) {
    var list = load();
    list.unshift({
      type: entry.type || "job",
      label: entry.label || "",
      output: entry.output || null,
      time: Date.now(),
    });
    if (list.length > MAX) list = list.slice(0, MAX);
    save(list);
    listeners.forEach(function (cb) {
      try { cb(list); } catch (e) {}
    });
  }

  function list() {
    return load();
  }

  function clear() {
    save([]);
    listeners.forEach(function (cb) { cb([]); });
  }

  function onChange(cb) {
    listeners.push(cb);
  }

  MH.activity = { log: log, list: list, clear: clear, onChange: onChange };
})(window.MH = window.MH || {});
