/* =========================================================
   CSInterface — sous-ensemble minimal du pont CEP d'Adobe.
   Fournit evalScript() (JS -> ExtendScript) et les infos hôte.
   Le runtime CEP injecte window.__adobe_cep__.
   ========================================================= */
function CSInterface() {}

CSInterface.prototype.hostEnvironment = function () {
  try { return JSON.parse(window.__adobe_cep__.getHostEnvironment()); }
  catch (e) { return {}; }
};

/** Identifiant de l'appli hôte : "PPRO" (Premiere) ou "AEFT" (After Effects). */
CSInterface.prototype.getApplicationID = function () {
  var env = this.hostEnvironment();
  return env.appName || "";
};

CSInterface.prototype.getHostEnvironment = function () {
  return this.hostEnvironment();
};

/** Exécute du code ExtendScript dans l'hôte ; callback reçoit la chaîne de retour. */
CSInterface.prototype.evalScript = function (script, callback) {
  if (typeof callback !== "function") callback = function () {};
  try {
    window.__adobe_cep__.evalScript(script, callback);
  } catch (e) {
    callback("EvalScript error: " + e);
  }
};

/** Ouvre une URL dans le navigateur par défaut du système. */
CSInterface.prototype.openURLInDefaultBrowser = function (url) {
  try { window.cep.util.openURLInDefaultBrowser(url); } catch (e) {}
};

/** Thème de couleur de l'hôte (pour s'y adapter si besoin). */
CSInterface.prototype.getHostEnvironmentColor = function () {
  try { return JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo; }
  catch (e) { return null; }
};
