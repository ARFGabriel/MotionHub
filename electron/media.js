"use strict";

/**
 * Couche média : encapsule ffmpeg / ffprobe (binaires embarqués via
 * ffmpeg-static / ffprobe-static — aucune installation système requise).
 * Fournit : sondage des métadonnées, génération de proxys, miniatures.
 */
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Une fois l'app empaquetée (asar), les binaires sont extraits dans
// « app.asar.unpacked » : on redirige les chemins en conséquence.
// En développement, le remplacement est sans effet.
const unpack = (p) => (p ? p.replace("app.asar" + require("path").sep, "app.asar.unpacked" + require("path").sep).replace("app.asar/", "app.asar.unpacked/") : p);
const ffmpegPath = unpack(require("ffmpeg-static"));
const ffprobePath = unpack(require("ffprobe-static").path);

const VIDEO_EXTS = ["mp4", "mov", "mkv", "avi", "mxf", "m4v", "webm"];

function isVideo(filePath) {
  var ext = (filePath.split(".").pop() || "").toLowerCase();
  return VIDEO_EXTS.indexOf(ext) !== -1;
}

/** Renvoie une promesse résolue avec les métadonnées du média. */
function probe(filePath) {
  return new Promise(function (resolve, reject) {
    var args = ["-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", filePath];
    var out = "";
    var p = spawn(ffprobePath, args);
    p.stdout.on("data", function (d) {
      out += d;
    });
    p.on("error", reject);
    p.on("close", function (code) {
      if (code !== 0) return reject(new Error("ffprobe a échoué (code " + code + ")"));
      try {
        var json = JSON.parse(out);
        var v = (json.streams || []).find(function (s) {
          return s.codec_type === "video";
        }) || {};
        resolve({
          duration: parseFloat((json.format && json.format.duration) || v.duration || 0),
          width: v.width || 0,
          height: v.height || 0,
          codec: v.codec_name || "",
          fps: parseFps(v.r_frame_rate),
          size: parseInt((json.format && json.format.size) || 0, 10),
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}

function parseFps(str) {
  if (!str) return 0;
  var parts = String(str).split("/");
  var n = parseFloat(parts[0]);
  var d = parseFloat(parts[1] || "1");
  return d ? Math.round((n / d) * 100) / 100 : 0;
}

/**
 * Génère un proxy pour `input`.
 * opts : { format: 'prores'|'h264', scale: 0.5|0.25, outDir?: string }
 * onProgress(percent 0..100) est appelé pendant l'encodage.
 */
function generateProxy(input, opts, onProgress) {
  opts = opts || {};
  var scale = opts.scale || 0.5;
  var format = opts.format || "prores";

  return probe(input).then(function (meta) {
    var dir = opts.outDir || path.join(path.dirname(input), "_PROXIES");
    fs.mkdirSync(dir, { recursive: true });
    var base = path.basename(input, path.extname(input));
    var ext = format === "prores" ? ".mov" : ".mp4";
    var output = path.join(dir, base + "_PROXY" + ext);

    var vf = "scale=trunc(iw*" + scale + "/2)*2:trunc(ih*" + scale + "/2)*2";
    var args = ["-y", "-i", input, "-vf", vf];

    if (format === "prores") {
      args = args.concat(["-c:v", "prores_ks", "-profile:v", "0", "-c:a", "pcm_s16le"]);
    } else {
      args = args.concat(["-c:v", "libx264", "-crf", "23", "-preset", "fast", "-c:a", "aac", "-b:a", "128k"]);
    }
    args = args.concat(["-progress", "pipe:1", "-nostats", output]);

    return new Promise(function (resolve, reject) {
      var p = spawn(ffmpegPath, args);
      var errBuf = "";

      p.stdout.on("data", function (chunk) {
        String(chunk)
          .split("\n")
          .forEach(function (line) {
            var m = line.match(/out_time_us=(\d+)/);
            if (m && meta.duration > 0 && typeof onProgress === "function") {
              var pct = (parseInt(m[1], 10) / 1e6 / meta.duration) * 100;
              onProgress(Math.max(0, Math.min(99, Math.round(pct))));
            }
          });
      });
      p.stderr.on("data", function (d) {
        errBuf += d;
        if (errBuf.length > 4000) errBuf = errBuf.slice(-4000);
      });
      p.on("error", reject);
      p.on("close", function (code) {
        if (code === 0) {
          if (typeof onProgress === "function") onProgress(100);
          var st = fs.statSync(output);
          resolve({ output: output, size: st.size });
        } else {
          reject(new Error("Encodage échoué (code " + code + ") : " + errBuf.slice(-300)));
        }
      });
    });
  });
}

/**
 * Extrait une image (frame) d'une vidéo vers un cache et renvoie son chemin.
 * Mise en cache par (chemin + mtime) pour éviter de régénérer.
 */
function extractThumbnail(input, cacheDir) {
  return new Promise(function (resolve, reject) {
    try {
      fs.mkdirSync(cacheDir, { recursive: true });
      var st = fs.statSync(input);
      var key = crypto.createHash("md5").update(input + ":" + st.mtimeMs).digest("hex");
      var output = path.join(cacheDir, key + ".jpg");
      if (fs.existsSync(output)) return resolve(output);

      // Prend une frame vers 10% de la durée (évite un écran noir en tête).
      probe(input)
        .then(function (meta) {
          var seek = meta.duration > 0 ? Math.max(0.5, meta.duration * 0.1) : 0.5;
          var args = ["-y", "-ss", String(seek), "-i", input, "-vframes", "1", "-vf", "scale=480:-1", output];
          var p = spawn(ffmpegPath, args);
          p.on("error", reject);
          p.on("close", function (code) {
            if (code === 0 && fs.existsSync(output)) resolve(output);
            else reject(new Error("Miniature échouée (code " + code + ")"));
          });
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

/** Cherche récursivement (peu profond) la vidéo la plus récente d'un dossier. */
function findLatestRender(dir, maxDepth) {
  maxDepth = maxDepth == null ? 2 : maxDepth;
  var best = null;

  function walk(current, depth) {
    if (depth > maxDepth) return;
    var entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (e) {
      return;
    }
    entries.forEach(function (entry) {
      var full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full, depth + 1);
      } else if (isVideo(full)) {
        try {
          var st = fs.statSync(full);
          if (!best || st.mtimeMs > best.mtime) best = { path: full, mtime: st.mtimeMs };
        } catch (e) {}
      }
    });
  }

  walk(dir, 0);
  return best;
}

/* =========================================================
   BOÎTE À OUTILS MÉDIA
   ========================================================= */

/** Exécute ffmpeg avec suivi de progression basé sur une durée connue. */
function runFfmpeg(args, duration, onProgress, spawnOpts) {
  return new Promise(function (resolve, reject) {
    var p = spawn(ffmpegPath, args.concat(["-progress", "pipe:1", "-nostats"]), spawnOpts || {});
    var errBuf = "";
    p.stdout.on("data", function (chunk) {
      String(chunk)
        .split("\n")
        .forEach(function (line) {
          var m = line.match(/out_time_us=(\d+)/);
          if (m && duration > 0 && typeof onProgress === "function") {
            var pct = (parseInt(m[1], 10) / 1e6 / duration) * 100;
            onProgress(Math.max(0, Math.min(99, Math.round(pct))));
          }
        });
    });
    p.stderr.on("data", function (d) {
      errBuf += d;
      if (errBuf.length > 4000) errBuf = errBuf.slice(-4000);
    });
    p.on("error", reject);
    p.on("close", function (code) {
      if (code === 0) {
        if (typeof onProgress === "function") onProgress(100);
        resolve();
      } else {
        reject(new Error("ffmpeg a échoué (code " + code + ") : " + errBuf.slice(-300)));
      }
    });
  });
}

/** Préréglages de transcodage / livraison. video[] = args ffmpeg. */
var TRANSCODE_PRESETS = {
  youtube: {
    label: "YouTube (H.264 1080p)",
    ext: ".mp4",
    args: ["-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart"],
  },
  vertical: {
    label: "Vertical 9:16 (Reels/TikTok)",
    ext: ".mp4",
    args: [
      "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
      "-c:v", "libx264", "-crf", "20", "-preset", "fast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart",
    ],
  },
  review: {
    label: "Review client (léger H.264)",
    ext: ".mp4",
    args: ["-vf", "scale=-2:720", "-c:v", "libx264", "-crf", "26", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart"],
  },
  prores_hq: {
    label: "ProRes 422 HQ (.mov)",
    ext: ".mov",
    args: ["-c:v", "prores_ks", "-profile:v", "3", "-pix_fmt", "yuv422p10le", "-c:a", "pcm_s16le"],
  },
  dnxhr_hq: {
    label: "DNxHR HQ (Resolve/Avid, .mov)",
    ext: ".mov",
    args: ["-c:v", "dnxhd", "-profile:v", "dnxhr_hq", "-pix_fmt", "yuv422p", "-c:a", "pcm_s16le"],
  },
  webm: {
    label: "WebM (VP9, web)",
    ext: ".webm",
    args: ["-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-c:a", "libopus"],
  },
  mp3: {
    label: "Audio seul (MP3)",
    ext: ".mp3",
    args: ["-vn", "-c:a", "libmp3lame", "-q:a", "2"],
  },
};

/** Transcode `input` selon un preset. */
function transcode(input, presetId, onProgress) {
  var preset = TRANSCODE_PRESETS[presetId];
  if (!preset) return Promise.reject(new Error("Preset inconnu : " + presetId));
  return probe(input).then(function (meta) {
    var dir = path.join(path.dirname(input), "_EXPORTS");
    fs.mkdirSync(dir, { recursive: true });
    var base = path.basename(input, path.extname(input));
    var output = path.join(dir, base + "_" + presetId + preset.ext);
    var args = ["-y", "-i", input].concat(preset.args, [output]);
    return runFfmpeg(args, meta.duration, onProgress).then(function () {
      var st = fs.statSync(output);
      return { output: output, size: st.size };
    });
  });
}

/** Analyse un fichier choisi pour détecter une séquence d'images numérotée. */
function detectSequence(firstFile) {
  var dir = path.dirname(firstFile);
  var name = path.basename(firstFile);
  var ext = path.extname(name);
  var stem = name.slice(0, -ext.length);
  var m = stem.match(/^(.*?)(\d+)$/);
  if (!m) return null;
  var prefix = m[1];
  var digits = m[2].length;
  var start = parseInt(m[2], 10);
  var pattern = prefix + "%0" + digits + "d" + ext;

  // Compte les fichiers correspondants pour info.
  var re = new RegExp("^" + prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\d{" + digits + "}" + ext.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i");
  var count = 0;
  try {
    fs.readdirSync(dir).forEach(function (f) {
      if (re.test(f)) count++;
    });
  } catch (e) {}

  return { dir: dir, pattern: pattern, patternPath: path.join(dir, pattern), start: start, count: count, ext: ext.toLowerCase() };
}

/** Encode une séquence d'images en vidéo. opts : { fps, format:'h264'|'prores' } */
function renderSequence(firstFile, opts, onProgress) {
  opts = opts || {};
  var seq = detectSequence(firstFile);
  if (!seq) return Promise.reject(new Error("Aucune numérotation détectée dans ce fichier."));
  var fps = opts.fps || 25;
  var format = opts.format || "h264";
  var outExt = format === "prores" ? ".mov" : ".mp4";
  var stem = seq.pattern.replace(/%0\d+d.*$/, "").replace(/[_.-]+$/, "") || "sequence";
  var output = path.join(seq.dir, "_" + stem + outExt);

  var args = ["-y", "-framerate", String(fps), "-start_number", String(seq.start), "-i", seq.patternPath];
  if (format === "prores") {
    args = args.concat(["-c:v", "prores_ks", "-profile:v", "3", "-pix_fmt", "yuv422p10le"]);
  } else {
    args = args.concat(["-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]);
  }
  args.push(output);

  var duration = seq.count > 0 ? seq.count / fps : 0;
  return runFfmpeg(args, duration, onProgress).then(function () {
    var st = fs.statSync(output);
    return { output: output, size: st.size, frames: seq.count };
  });
}

/** Extrait des images d'une vidéo. opts : { every: secondes } ou { count: N } */
function extractFrames(input, opts) {
  opts = opts || {};
  return probe(input).then(function (meta) {
    var dir = path.join(path.dirname(input), "_FRAMES");
    fs.mkdirSync(dir, { recursive: true });
    var base = path.basename(input, path.extname(input));
    var fpsFilter;
    if (opts.count && meta.duration > 0) {
      fpsFilter = "fps=" + opts.count / meta.duration;
    } else {
      var every = opts.every || 5;
      fpsFilter = "fps=1/" + every;
    }
    var outPattern = path.join(dir, base + "_%03d.jpg");
    var args = ["-y", "-i", input, "-vf", fpsFilter, "-q:v", "2", outPattern];
    return runFfmpeg(args, 0, null).then(function () {
      var files = fs.readdirSync(dir).filter(function (f) {
        return f.indexOf(base + "_") === 0 && f.endsWith(".jpg");
      });
      return { dir: dir, count: files.length };
    });
  });
}

function listPresets() {
  return Object.keys(TRANSCODE_PRESETS).map(function (id) {
    return { id: id, label: TRANSCODE_PRESETS[id].label };
  });
}

/** Construit les arguments ffmpeg à partir d'une spec de preset personnalisé. */
function specToArgs(spec) {
  var args = [];
  var s = parseFloat(spec.scale || 1);
  if (s && s !== 1) args.push("-vf", "scale=trunc(iw*" + s + "/2)*2:trunc(ih*" + s + "/2)*2");

  var q = spec.quality || "medium";
  if (spec.codec === "h264") {
    args.push("-c:v", "libx264", "-crf", q === "high" ? "18" : q === "low" ? "28" : "23", "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart");
  } else if (spec.codec === "h265") {
    args.push("-c:v", "libx265", "-crf", q === "high" ? "20" : q === "low" ? "30" : "26", "-preset", "medium", "-pix_fmt", "yuv420p", "-tag:v", "hvc1", "-movflags", "+faststart");
  } else if (spec.codec === "prores") {
    args.push("-c:v", "prores_ks", "-profile:v", q === "high" ? "3" : q === "low" ? "0" : "2", "-pix_fmt", "yuv422p10le");
  } else if (spec.codec === "dnxhr") {
    args.push("-c:v", "dnxhd", "-profile:v", q === "high" ? "dnxhr_hqx" : q === "low" ? "dnxhr_sq" : "dnxhr_hq", "-pix_fmt", "yuv422p");
  }

  var lossless = spec.codec === "prores" || spec.codec === "dnxhr";
  if (spec.audio === "none") args.push("-an");
  else if (spec.audio === "aac") args.push("-c:a", "aac", "-b:a", "256k");
  else args.push("-c:a", lossless ? "pcm_s16le" : "copy");
  return args;
}

function extForCodec(codec) {
  return codec === "prores" || codec === "dnxhr" ? ".mov" : ".mp4";
}

/** Transcode selon un preset personnalisé (spec libre côté renderer). */
function transcodeCustom(input, spec, onProgress) {
  spec = spec || {};
  return probe(input).then(function (meta) {
    var dir = path.join(path.dirname(input), "_EXPORTS");
    fs.mkdirSync(dir, { recursive: true });
    var base = path.basename(input, path.extname(input));
    var safe = (spec.name || "custom").replace(/[^\w-]+/g, "_");
    var output = path.join(dir, base + "_" + safe + extForCodec(spec.codec));
    var args = ["-y", "-i", input].concat(specToArgs(spec), [output]);
    return runFfmpeg(args, meta.duration, onProgress).then(function () {
      var st = fs.statSync(output);
      return { output: output, size: st.size };
    });
  });
}

/** Applique une LUT (.cube) à une vidéo et exporte un aperçu H.264. */
function applyLut(input, cubePath, onProgress) {
  return probe(input).then(function (meta) {
    var dir = path.join(path.dirname(input), "_LUT");
    fs.mkdirSync(dir, { recursive: true });
    var base = path.basename(input, path.extname(input));
    var output = path.join(dir, base + "_LUT.mp4");

    // On exécute ffmpeg depuis le dossier de la LUT et on la référence par
    // son nom seul : évite l'échappement pénible des chemins Windows (« : » « \ »)
    // dans le graphe de filtres.
    var cubeDir = path.dirname(cubePath);
    var cubeName = path.basename(cubePath);
    var args = [
      "-y", "-i", input,
      "-vf", "lut3d=file='" + cubeName + "'",
      "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-pix_fmt", "yuv420p", "-c:a", "copy",
      output,
    ];
    return runFfmpeg(args, meta.duration, onProgress, { cwd: cubeDir }).then(function () {
      var st = fs.statSync(output);
      return { output: output, size: st.size };
    });
  });
}

module.exports = {
  ffmpegPath: ffmpegPath,
  ffprobePath: ffprobePath,
  isVideo: isVideo,
  probe: probe,
  generateProxy: generateProxy,
  extractThumbnail: extractThumbnail,
  findLatestRender: findLatestRender,
  transcode: transcode,
  detectSequence: detectSequence,
  renderSequence: renderSequence,
  extractFrames: extractFrames,
  listPresets: listPresets,
  applyLut: applyLut,
  transcodeCustom: transcodeCustom,
};
