# MotionHub

Assistant de production vidéo pour motion designer (workflow After Effects / Adobe).
Application desktop **Electron** avec une interface web, réutilisable telle quelle dans un navigateur (mode dégradé).

## Fonctionnalités

| Outil | Description | Mode |
|---|---|---|
| **Mes Projets** | Regroupe toutes tes productions même réparties sur plusieurs disques. Aperçu du rendu final (miniature), exploration récursive des fichiers, ouverture dans l'explorateur. | Desktop |
| **Proxys** | Génère de vrais proxys ProRes ou H.264 via ffmpeg, avec barre de progression. Sortie dans un sous-dossier `_PROXIES`. | Desktop |
| **Inspecteur** | Analyse un dossier par glisser-déposer : arborescence, tri par type, poids. | Web + Desktop |
| **Assistant Auto** | Génère des scripts `.jsx` pour After Effects (proxies, structure, marqueurs, easing, sequencer, cleaner). | Web + Desktop |
| **Bibliothèque d'expressions** | Expressions AE prêtes à copier. | Web + Desktop |
| **Nomenclature / Checklist / Calculatrices** | Outils de production (nommage, checklist de rendu persistée, frames↔temps, estimateur de poids). | Web + Desktop |

## Développement

```bash
npm install      # installe Electron + ffmpeg-static + ffprobe-static
npm start        # lance l'application desktop
npm run dev      # idem avec les DevTools ouverts
```

Version web (mode dégradé, sans accès disque ni ffmpeg) : servir le dossier avec n'importe quel serveur statique, p. ex. `python -m http.server`.

## Build de l'installateur Windows

```bash
npm run dist
```

> ⚠️ **Sur ce PC**, le build échoue si la sortie est sur le disque `E:` (OneDrive/Windows Defender
> verrouillent les binaires Electron pendant l'extraction → `EPERM rename win-unpacked`).
> Contournement fiable : sortir le build vers le disque `C:` :
>
> ```bash
> npx electron-builder --config.directories.output=C:/Users/GABGA/AppData/Local/Temp/mh_release
> ```
>
> Fix propre : ajouter le dossier du projet aux exclusions de Windows Defender, ou sortir le projet de OneDrive.

## Architecture

```
electron/
  main.js      # processus principal : fenêtre + handlers IPC (fichiers, projets, proxys)
  preload.js   # pont sécurisé window.motionHub (contextIsolation, pas de nodeIntegration)
  store.js     # persistance JSON (userData)
  media.js     # ffmpeg/ffprobe : sonde, proxys, miniatures, détection du rendu
js/
  utils.js     # helpers (DOM, presse-papiers, téléchargement, toast, format)
  data.js      # données : expressions AE + modèles de scripts .jsx + types de fichiers
  app.js       # navigation + logique des outils web
  projects.js  # gestion des projets (desktop)
  proxy.js     # génération de proxys (desktop)
index.html · style.css
```

Le renderer n'accède jamais directement à Node : toute opération système passe par `window.motionHub`
(exposé par le preload), qui relaie des appels IPC contrôlés vers le processus principal.
