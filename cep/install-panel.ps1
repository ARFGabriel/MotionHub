# =========================================================
#  Installe le panneau Slate dans Adobe Premiere Pro & After Effects.
#  - Active le "PlayerDebugMode" (extensions non signées, mode dev).
#  - Copie l'extension dans le dossier CEP d'Adobe (par utilisateur).
#  A lancer dans PowerShell : clic droit > "Exécuter avec PowerShell"
#  ou :  powershell -ExecutionPolicy Bypass -File install-panel.ps1
# =========================================================

$ErrorActionPreference = "Stop"
$src  = Join-Path $PSScriptRoot "com.slate.panel"
$dest = Join-Path $env:APPDATA "Adobe\CEP\extensions\com.slate.panel"

if (-not (Test-Path $src)) { Write-Host "Introuvable : $src" -ForegroundColor Red; exit 1 }

# 1) PlayerDebugMode = 1 pour les versions CSXS courantes (CC 2019 -> 2025+)
foreach ($v in 9..12) {
    $key = "HKCU:\Software\Adobe\CSXS.$v"
    if (-not (Test-Path $key)) { New-Item -Path $key -Force | Out-Null }
    Set-ItemProperty -Path $key -Name "PlayerDebugMode" -Value "1" -Type String
}
Write-Host "PlayerDebugMode activé (CSXS.9 à CSXS.12)." -ForegroundColor Green

# 2) Copie de l'extension
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
New-Item -ItemType Directory -Path $dest -Force | Out-Null
Copy-Item (Join-Path $src "*") $dest -Recurse -Force
Write-Host "Panneau copié dans : $dest" -ForegroundColor Green

Write-Host ""
Write-Host "C'est prêt." -ForegroundColor Cyan
Write-Host "1. Ferme puis rouvre Premiere Pro / After Effects."
Write-Host "2. Menu Fenetre (Window) > Extensions > Slate."
