# Slate — panneau Adobe (Premiere Pro & After Effects)

Panneau dockable qui apporte Slate **à l'intérieur** de Premiere Pro et After
Effects : organisation du projet (bins/dossiers), import des rushes, gestion des
proxys et détection des médias manquants.

> Techno : extension **CEP** (HTML/JS/CSS + ExtendScript). Même stack que
> l'app Slate, donc le panneau évoluera avec elle.

## Installation (une fois)

1. Ferme Premiere Pro et After Effects.
2. Dans le dossier `cep/`, clic droit sur **`install-panel.ps1`** → *Exécuter avec PowerShell*.
   (ou dans un terminal : `powershell -ExecutionPolicy Bypass -File install-panel.ps1`)
3. Le script active le *PlayerDebugMode* (obligatoire pour une extension non
   signée) et copie le panneau dans
   `%APPDATA%\Adobe\CEP\extensions\com.slate.panel`.
4. Rouvre Premiere Pro ou After Effects → menu **Fenêtre › Extensions › Slate**.

Le panneau est **dockable** comme n'importe quel panneau natif.

## Ce que fait la V1

- **Projet** : nom du projet, nombre d'éléments, de séquences (Pr) / comps (AE).
- **Organiser le projet** : crée l'arborescence de bins/dossiers à partir d'un
  modèle (Montage, Multicam, Motion/VFX, Simple).
- **Rushes** : importe tous les médias d'un dossier dans le bin des rushes.
- **Proxys** : attache des proxys d'un dossier, **appariés par nom de fichier**
  (`clip.mov` → `clip.mov`, `clip_PROXY.mov`…).
- **Médias manquants** : liste les médias hors-ligne du projet.

## Développement / mise à jour

Les fichiers du panneau sont dans `cep/com.slate.panel/`. Après modification,
relance `install-panel.ps1` (il recopie), puis recharge le panneau
(ferme/rouvre le panneau, ou l'appli).

- UI : `index.html`, `css/panel.css`, `js/panel.js`
- Pont hôte : `js/CSInterface.js`
- Scripts hôte (ExtendScript) : `jsx/host.jsx` → `premiere.jsx` / `aftereffects.jsx`

## Désinstaller

Supprime le dossier `%APPDATA%\Adobe\CEP\extensions\com.slate.panel`.

## Limites connues (V1)

- Extension **non signée** → nécessite le PlayerDebugMode (fait par le script).
  Pour une diffusion propre, il faudra signer un paquet `.zxp`.
- Testé à l'écriture sur l'API ExtendScript standard de Pr/AE ; à valider sur
  ta version exacte (remonte-moi les erreurs du panneau).
- Génération de proxys : la V1 **attache** des proxys existants. La création
  automatique (via Media Encoder) viendra dans une prochaine version.
