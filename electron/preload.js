"use strict";

/**
 * Pont sécurisé entre le renderer (UI web) et le processus principal.
 * Le renderer n'accède JAMAIS directement à Node/fs : il passe par
 * `window.motionHub`, dont chaque méthode est un appel IPC contrôlé.
 */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("motionHub", {
  isDesktop: true,

  pickFolder: () => ipcRenderer.invoke("dialog:pickFolder"),
  pickVideos: () => ipcRenderer.invoke("dialog:pickVideos"),

  projects: {
    list: () => ipcRenderer.invoke("projects:list"),
    add: (folderPath) => ipcRenderer.invoke("projects:add", folderPath),
    remove: (id) => ipcRenderer.invoke("projects:remove", id),
    update: (id, patch) => ipcRenderer.invoke("projects:update", { id, patch }),
    mainFile: (dirPath) => ipcRenderer.invoke("projects:mainFile", dirPath),
    backup: (srcPath) => ipcRenderer.invoke("projects:backup", srcPath),
  },

  fs: {
    readDir: (dirPath) => ipcRenderer.invoke("fs:readDir", dirPath),
    folderSize: (dirPath) => ipcRenderer.invoke("fs:folderSize", dirPath),
  },

  system: {
    diskSpace: (paths) => ipcRenderer.invoke("system:diskSpace", paths),
  },

  update: {
    version: () => ipcRenderer.invoke("update:version"),
    check: () => ipcRenderer.invoke("update:check"),
    install: () => ipcRenderer.invoke("update:install"),
    onStatus: (cb) => {
      const listener = (_evt, data) => cb(data);
      ipcRenderer.on("update:status", listener);
      return () => ipcRenderer.removeListener("update:status", listener);
    },
  },

  media: {
    probe: (filePath) => ipcRenderer.invoke("media:probe", filePath),
    thumbnail: (filePath) => ipcRenderer.invoke("media:thumbnail", filePath),
    latestRender: (dirPath) => ipcRenderer.invoke("media:latestRender", dirPath),
    presets: () => ipcRenderer.invoke("media:presets"),
    pickImage: () => ipcRenderer.invoke("dialog:pickImage"),
    transcode: (jobId, input, presetId) => ipcRenderer.invoke("media:transcode", { jobId, input, presetId }),
    detectSequence: (firstFile) => ipcRenderer.invoke("media:detectSequence", firstFile),
    renderSequence: (jobId, firstFile, options) => ipcRenderer.invoke("media:renderSequence", { jobId, firstFile, options }),
    extractFrames: (input, options) => ipcRenderer.invoke("media:extractFrames", { input, options }),
    pickLut: () => ipcRenderer.invoke("dialog:pickLut"),
    applyLut: (jobId, input, cube) => ipcRenderer.invoke("media:applyLut", { jobId, input, cube }),
    transcodeCustom: (jobId, input, spec) => ipcRenderer.invoke("media:transcodeCustom", { jobId, input, spec }),
    onProgress: (cb) => {
      const listener = (_evt, data) => cb(data);
      ipcRenderer.on("media:progress", listener);
      return () => ipcRenderer.removeListener("media:progress", listener);
    },
  },

  proxy: {
    generate: (jobId, input, options) =>
      ipcRenderer.invoke("proxy:generate", { jobId, input, options }),
    onProgress: (cb) => {
      const listener = (_evt, data) => cb(data);
      ipcRenderer.on("proxy:progress", listener);
      return () => ipcRenderer.removeListener("proxy:progress", listener);
    },
  },

  watch: {
    start: (id, folder, mode, options) => ipcRenderer.invoke("watch:start", { id, folder, mode, options }),
    stop: (id) => ipcRenderer.invoke("watch:stop", id),
    list: () => ipcRenderer.invoke("watch:list"),
    onEvent: (cb) => {
      const listener = (_evt, data) => cb(data);
      ipcRenderer.on("watch:event", listener);
      return () => ipcRenderer.removeListener("watch:event", listener);
    },
  },

  shell: {
    open: (targetPath) => ipcRenderer.invoke("shell:open", targetPath),
    reveal: (targetPath) => ipcRenderer.invoke("shell:reveal", targetPath),
  },
});
