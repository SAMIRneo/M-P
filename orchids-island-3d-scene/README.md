# orchids-island-3d-scene — Hub 3D

Ce dossier est le Hub central du métaverse : la scène 3D interactive (île), l’entrée principale, et l’orchestrateur de lancement.

## Rôle

- Point d’entrée (UI + scène 3D)
- Navigation / interactions (téléport, points d’intérêt, liens)
- Orchestration des serveurs via `launcher.mjs`

## Stack

- Next.js (App Router) + React
- Three.js (scène et interactions)
- TypeScript (UI) + JS (moteur scène)
- Tailwind

## Scripts

Depuis ce dossier :

```bash
npm install
npm run dev
```

Orchestration métaverse (utilisée par le lanceur racine) :

```bash
npm run metaverse
```

Lint / build :

```bash
npm run lint
npm run build
```

