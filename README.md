# The Designer's Arcana

A showcase for the Product Design Tarot — a slick, growing gallery of all
78 cards. Card text is complete; art is added one plate at a time, and the
site fills in as it lands (a card is "illustrated" when its art SVG exists).

Built with [Astro](https://astro.build), deployed to GitHub Pages:
**https://polgarp.github.io/the-designers-arcana/**

## How it works

- **Content lives in the source repo** `product-design-tarot` (private):
  card data at `data/cards.json`, finished art at `public/cards/art/<id>.svg`.
- `scripts/sync-content.mjs` copies that data + art into this project.
  Readiness is derived from which art files are present.
- `scripts/gen-share-images.mjs` composes per-card share images at build:
  `public/og/<id>.png` (1200×630 link unfurl) and
  `public/share/<id>.png` (1080×1350 downloadable info-image).
- Pages: a gallery home (window chrome, filter rail, progress strip) and
  one reading page per card.

Type system: **Fraunces** (display) · **IBM Plex Mono** (UI) ·
**Spectral Italic** (flavor). Palette + grammar inherited from the deck's
"Atelier Arcana" doctrine.

## Develop

```bash
npm install
npm run sync     # pull cards.json + art from ../product-design-tarot
npm run dev
```

`npm run build` runs `sync → gen-share-images → astro build` (via `prebuild`).
Point the sync at a different source with `CONTENT_REPO_PATH=../path npm run sync`.

## Deploy & auto-regeneration

`.github/workflows/deploy.yml` rebuilds and deploys on push, on manual
dispatch, daily on a schedule, and on a `content-updated` repository-dispatch.
Because the source repo is private, the workflow checks it out using a
repo secret:

- **`CONTENT_REPO_TOKEN`** — a fine-grained PAT with **read-only Contents**
  access to `polgarp/product-design-tarot`. Set via
  `gh secret set CONTENT_REPO_TOKEN`.

To rebuild instantly when you add a card, either run the workflow manually,
or add a workflow in `product-design-tarot` that dispatches `content-updated`
here on changes to `public/cards/art/**` or `data/cards.json`.

## Roadmap

Phase 2 (stubbed in nav): live readings, and a link to buy the deck.
