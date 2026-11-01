/* =========================================================
   Utilitaires ExtendScript partagés (Premiere & After Effects).
   ExtendScript n'a pas JSON natif : encodeur minimal maison.
   ========================================================= */
var SlateJSON = {
  enc: function (v) {
    if (v === null || v === undefined) return "null";
    var t = typeof v;
    if (t === "number") return isFinite(v) ? String(v) : "null";
    if (t === "boolean") return v ? "true" : "false";
    if (t === "string") return SlateJSON.str(v);
    if (v instanceof Array) {
      var a = [];
      for (var i = 0; i < v.length; i++) a.push(SlateJSON.enc(v[i]));
      return "[" + a.join(",") + "]";
    }
    var p = [];
    for (var k in v) { if (v.hasOwnProperty(k)) p.push(SlateJSON.str(k) + ":" + SlateJSON.enc(v[k])); }
    return "{" + p.join(",") + "}";
  },
  str: function (s) {
    s = String(s);
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === '"' || c === "\\") out += "\\" + c;
      else if (c === "\n") out += "\\n";
      else if (c === "\r") out += "\\r";
      else if (c === "\t") out += "\\t";
      else out += c;
    }
    return '"' + out + '"';
  }
};

function slateOk(data) { return SlateJSON.enc({ ok: true, data: data }); }
function slateErr(msg) { return SlateJSON.enc({ ok: false, error: String(msg) }); }

/** Nom de fichier sans extension. */
function baseNoExt(name) {
  name = String(name);
  var slash = Math.max(name.lastIndexOf("/"), name.lastIndexOf("\\"));
  if (slash >= 0) name = name.substring(slash + 1);
  var dot = name.lastIndexOf(".");
  return dot > 0 ? name.substring(0, dot) : name;
}
