/* =========================================================
   Point d'entrée ExtendScript du panneau Slate.
   Inclut l'utilitaire JSON et les deux hôtes. Les API propres
   à chaque appli ne sont appelées que par le bon namespace
   (SlatePr.* en Premiere, SlateAe.* en After Effects), choisi
   côté panneau selon CSInterface.getApplicationID().
   ========================================================= */
#include "_util.jsx"
#include "premiere.jsx"
#include "aftereffects.jsx"
