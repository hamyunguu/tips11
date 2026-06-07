# BFCM 2024 — Print-Shop Edition

An interactive web experience built with **React + Vite + Three.js**, reworked around a print-shop concept.

A retro CRT terminal boots up, then reveals a hero printer. Click any part of the
machine to open a 3D ring-bound booklet (page-flip with sound) zoomed into that
component. There's a hidden console with a snake game, too.

## Highlights

- **CRT boot sequence** — BIOS-style terminal with progressive line reveal and a flash-out fade.
- **Hero machine** — a clean, front-on printer on a neutral studio backdrop.
- **Clickable hit-areas** — hover for an info card, click to open the matching booklet page and zoom into that part of the machine.
- **3D booklet** — Three.js `SkinnedMesh` pages with bone-driven curl/flip, ring binding, lighting and shadows; drag-to-flip + keyboard nav.
- **Audio** — per-interaction page-turn / flip / shuffle sounds (Howler).
- **Easter egg** — the power button toggles a CRT console with a DVD-style bouncer and a Snake mini-game.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5174  (add ?fastboot to skip the boot intro during dev)
npm run build    # production build → dist/
npm run preview
```

## Tech

React 18 · Vite 6 · Three.js · Framer Motion · Howler.js

## Notes

This started as a faithful study clone of Stripe's BFCM 2024 microsite and is being
reskinned toward a print-shop identity. Some booklet content is still placeholder.
Third-party fonts, imagery and audio are used for educational/demo purposes only.

## Controls

- **Click a machine part** — open that page · **drag** — flip pages · **N/P** or arrows — next/prev
- **M / Space** — toggle the manual · **A** — mute audio · **T** — reveal all hit-areas
- Power button on the machine — open the console · **Enter** — play Snake · **Esc** — quit
