@echo off
setlocal EnableDelayedExpansion
title ORCHIDS ISLAND METAVERSE - LAUNCHER & INSTALLER (ROOT)
color 0B
cls

echo ======================================================================
echo.
echo      PYRAMIDAL SYSTEM - ORCHIDS ISLAND METAVERSE
echo      Installation et Lancement Automatise (Racine)
echo.
echo ======================================================================
echo.

:: 1. VERIFICATION DE NODE.JS
echo [CHECK] Verification de Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERREUR] Node.js n'est pas installe !
    echo Veuillez telecharger et installer Node.js depuis https://nodejs.org/
    echo.
    pause
    exit
)
echo [OK] Node.js detecte.
echo.

:: 2. HUB (orchids-island-3d-scene)
if not exist "orchids-island-3d-scene" (
    color 0C
    echo [ERREUR] Dossier Hub manquant : orchids-island-3d-scene
    echo.
    pause
    exit
)

echo [CHECK] Verification du HUB (orchids-island-3d-scene)...
if not exist "orchids-island-3d-scene\node_modules" (
    echo [INSTALL] Installation des dependances du HUB...
    pushd "orchids-island-3d-scene"
    call npm install
    if !errorlevel! neq 0 (
        popd
        echo [ERREUR] Echec de l'installation du Hub.
        pause
        exit
    )
    popd
    echo [OK] Dependances Hub installees.
) else (
    echo [OK] Dependances Hub pretes.
)
echo.

:: 3. VERIFICATION DES SATELLITES (optionnels)
set "SATELLITES=gnosis-app GLOBErts charts"

for %%S in (%SATELLITES%) do (
    if exist "%%S" (
        echo [CHECK] Verification de %%S...
        if not exist "%%S\node_modules" (
            echo [INSTALL] Installation des dependances pour %%S...
            pushd "%%S"
            call npm install
            popd
            echo [OK] %%S installe.
        ) else (
            echo [OK] %%S est pret.
        )
    ) else (
        color 0E
        echo [WARNING] SATELLITE MANQUANT : %%S
        echo           Le Hub se lancera quand meme.
        echo.
        color 0B
    )
)

echo.
echo ======================================================================
echo [INFO] Le portail d'acces principal sera :
echo.
echo        ---^>  http://localhost:3000  ^<---
echo.
echo [STATUS] Demarrage des moteurs...
echo ======================================================================
echo.

:: 4. Lancement du moteur de gestion Node.js (Hub)
pushd "orchids-island-3d-scene"
call npm run metaverse
popd

:: Si le serveur s'arrête ou crash
echo.
echo [ARRET] Le Metaverse a ete arrete.
pause
