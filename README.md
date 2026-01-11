# META — Metaverse Workspace

Ce workspace regroupe un métaverse web modulaire, pensé comme un écosystème d’applications spécialisées.

L’idée centrale : un Hub 3D temps-réel (l’île) sert de point d’entrée et de “portail”. Autour, des satellites apportent des capacités ciblées (connaissance, monde/carte, data/finance). Chaque module peut évoluer indépendamment, tout en gardant une cohérence d’UX et de DA.

## Vision (global)

- Un métaverse web accessible (navigateur, pas de client lourd) et performant (chargement progressif, rendu stylisé).
- Un univers “système solaire” : un Hub central + des satellites interconnectés.
- Une base technique moderne : Next.js/React, TypeScript strict, Three.js, Tailwind, avec des conventions de qualité (lint, structure claire).

## Structure

```
META/
├─ orchids-island-3d-scene/    Hub 3D (Next.js + Three.js)
├─ gnosis-app/                 Satellite “Savoir / Wiki” (Next.js)
├─ GLOBErts/                   Satellite “Monde / Carte” (Vite + React)
├─ charts/                     Satellite “Finance / Data” (Vite + React)
└─ START_METAVERSE.bat         Lanceur racine (Windows)
```

Chaque dossier a son propre README :
- [README](file:///c:/Users/samir/Desktop/META/orchids-island-3d-scene/README.md) (Hub 3D)
- [README](file:///c:/Users/samir/Desktop/META/gnosis-app/README.md) (Gnosis)
- [README](file:///c:/Users/samir/Desktop/META/GLOBErts/README.md) (Globe)
- [README](file:///c:/Users/samir/Desktop/META/charts/README.md) (Charts)

## Prérequis

- Node.js LTS
- Windows (pour `START_METAVERSE.bat`)

## Lancement (recommandé)

Depuis `META/`, double-clique sur `START_METAVERSE.bat`.

Ce lanceur :
- vérifie Node.js
- installe les dépendances de chaque module présent
- démarre l’orchestration via le Hub (`orchids-island-3d-scene` → `npm run metaverse`)

Accès : http://localhost:3000

## Lancement manuel (développement)

Hub (orchestrateur) :

```bash
cd orchids-island-3d-scene
npm install
npm run metaverse
```

Satellites (au besoin, séparément) :

```bash
cd gnosis-app && npm install && npm run dev
cd ../GLOBErts && npm install && npm run dev
cd ../charts && npm install && npm run dev
```

## Conventions

- Les apps Next.js vivent dans `src/app` (App Router).
- Le Hub 3D gère la scène Three.js côté client, et expose des portails/interactions vers les satellites.
- Objectif : conserver une cohérence de style et de navigation, tout en laissant chaque module itérer vite.
