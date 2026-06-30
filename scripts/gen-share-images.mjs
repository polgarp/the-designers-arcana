// Build-time share images. For every card compose two PNGs on cream:
//   public/og/<id>.png     1200×630  → link unfurls / og:image
//   public/share/<id>.png  1080×1350 → downloadable "info image"
// Pure Node: Satori (compose → SVG) + resvg (→ PNG). No browser.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const C = {
  cream: '#efe8da', paper: '#f3eee2', ink: '#1b2233',
  ink60: '#5a6072', ink30: '#a7a394', house: '#7a2d2d',
};
const SUIT = {
  pencils: '#d9a441', mugs: '#3f7a5f', cursors: '#6b89a8', pixels: '#7a2d2d',
};

const fontFile = (pkg, file) =>
  readFileSync(join(root, 'node_modules/@fontsource', pkg, 'files', file));
const fonts = [
  { name: 'Marcellus', weight: 400, style: 'normal', data: fontFile('marcellus', 'marcellus-latin-400-normal.woff') },
  { name: 'Plex', weight: 400, style: 'normal', data: fontFile('ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff') },
  { name: 'Plex', weight: 500, style: 'normal', data: fontFile('ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff') },
  { name: 'Spectral', weight: 400, style: 'italic', data: fontFile('spectral', 'spectral-latin-400-italic.woff') },
];

// hyperscript → Satori element. Satori requires every <div> to declare
// display explicitly, so default it to flex unless set.
const h = (type, props = {}, ...children) => {
  if (type === 'div') {
    const style = props.style ?? {};
    if (style.display === undefined) props = { ...props, style: { display: 'flex', ...style } };
  }
  return { type, props: { ...props, children: children.flat() } };
};

const ROMAN = [[10,'X'],[9,'IX'],[8,'VIII'],[7,'VII'],[6,'VI'],[5,'V'],[4,'IV'],[3,'III'],[2,'II'],[1,'I']];
const roman = (n) => { if (n === 0) return '0'; let o = ''; for (const [v,s] of ROMAN) while (n>=v){o+=s;n-=v;} return o; };
const numeralFor = (c) => {
  if (c.arcana === 'major') return roman(c.number);
  return { 1:'ACE', 11:'PAGE', 12:'KNIGHT', 13:'QUEEN', 14:'KING' }[c.number] ?? roman(c.number);
};

const label = (t, color = C.ink60) =>
  h('div', { style: { fontFamily: 'Plex', fontSize: 18, letterSpacing: 3, textTransform: 'uppercase', color } }, t);

// A placeholder card (or the art, when present) sized w×h.
function cardEl(card, w, h2) {
  const accent = card.suit ? SUIT[card.suit] : C.house;
  const artPath = join(root, 'public/cards/art', `${card.id}.svg`);
  if (existsSync(artPath)) {
    const dataUri = 'data:image/svg+xml;base64,' + readFileSync(artPath).toString('base64');
    // card fill is the same cream as the bg → a rounded shadow reads it as a card
    return h('img', {
      src: dataUri, width: w, height: h2,
      style: {
        objectFit: 'contain',
        borderRadius: Math.round(w * 0.0577), // matches the SVG's rx=96 / 1664
        boxShadow: '0 3px 6px rgba(27,34,51,0.12), 0 16px 44px rgba(27,34,51,0.24)',
      },
    });
  }
  return h('div', {
    style: {
      width: w, height: h2, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-between', background: C.paper, border: `2px solid ${C.ink}`,
      padding: w * 0.07, position: 'relative',
    },
  },
    h('div', { style: { fontFamily: 'Marcellus', fontSize: w * 0.12, color: C.ink, letterSpacing: 2 } }, numeralFor(card)),
    h('div', { style: { display: 'flex', width: w * 0.34, height: w * 0.34, borderRadius: w, border: `1px solid ${C.ink30}` } }),
    h('div', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        width: '86%', minHeight: w * 0.2, border: `1px solid ${C.ink}`, padding: '8px 6px',
        fontFamily: 'Marcellus', fontSize: w * 0.072, textTransform: 'uppercase',
        letterSpacing: 1, color: C.ink, lineHeight: 1.05,
      },
    }, card.name),
  );
}

function chips(card) {
  const accent = card.suit ? SUIT[card.suit] : C.house;
  return h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 } },
    card.keywords.slice(0, 5).map((k, i) =>
      h('div', {
        style: {
          fontFamily: 'Plex', fontSize: 18, color: i === 0 ? accent : C.ink60,
          border: `1px solid ${i === 0 ? accent : C.ink30}`, borderRadius: 999, padding: '4px 14px',
        },
      }, k),
    ),
  );
}

const SITE_URL = 'polgarp.com/the-designers-arcana';

const wordmark = () =>
  h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
    h('div', { style: { display: 'flex', width: 12, height: 12, background: C.house, transform: 'rotate(45deg)' } }),
    h('div', { style: { fontFamily: 'Marcellus', fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: C.ink } }, "The Designer's Arcana"),
  );

// A labelled reading block for the portrait info-image.
function readBlock(name, text) {
  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
    h('div', { style: { fontFamily: 'Plex', fontSize: 17, letterSpacing: 3, textTransform: 'uppercase', color: C.house } }, name),
    h('div', { style: { fontFamily: 'Marcellus', fontSize: 25, color: C.ink, lineHeight: 1.38 } }, text),
  );
}

function ogTree(card) {
  return h('div', {
    style: { width: 1200, height: 630, display: 'flex', background: C.cream, padding: 64, gap: 56 },
  },
    h('div', { style: { display: 'flex', alignItems: 'center' } }, cardEl(card, 330, 495)),
    h('div', { style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: 18 } },
      wordmark(),
      h('div', { style: { fontFamily: 'Marcellus', fontSize: 64, color: C.ink, lineHeight: 1.0, marginTop: 6 } }, card.name),
      label(`${card.traditional_name}${card.arcana === 'major' ? ' · Major Arcana' : ''}`, C.house),
      h('div', { style: { fontFamily: 'Marcellus', fontSize: 27, color: C.ink, lineHeight: 1.45, marginTop: 6 } }, card.upright_meaning),
      chips(card),
    ),
  );
}

function portraitTree(card) {
  return h('div', {
    style: { width: 1080, height: 1350, display: 'flex', flexDirection: 'column', background: C.cream, padding: 64, gap: 20 },
  },
    // header: card + name, centered
    h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 } },
      cardEl(card, 452, 678),
      h('div', { style: { fontFamily: 'Marcellus', fontSize: 52, color: C.ink, textAlign: 'center' } }, card.name),
      h('div', { style: { fontFamily: 'Plex', fontSize: 18, letterSpacing: 3, textTransform: 'uppercase', color: C.house, textAlign: 'center' } },
        `${card.traditional_name}${card.arcana === 'major' ? ' · Major Arcana' : ''}`),
    ),
    // readings
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16, borderTop: `1px solid ${C.ink30}`, paddingTop: 20, marginTop: 4 } },
      readBlock('Upright', card.upright_meaning),
      readBlock('Reversed', card.reversed_meaning),
      h('div', { style: { fontFamily: 'Spectral', fontStyle: 'italic', fontSize: 26, color: C.ink60, lineHeight: 1.4 } }, card.flavor_text),
    ),
    h('div', { style: { display: 'flex', flex: 1 } }),
    // footer: wordmark + the page link
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, borderTop: `1px solid ${C.ink}`, paddingTop: 18 } },
      wordmark(),
      h('div', { style: { fontFamily: 'Plex', fontSize: 18, color: C.ink60 } }, `${SITE_URL}/cards/${card.id}`),
    ),
  );
}

async function render(tree, width, height, outPath) {
  const svg = await satori(tree, { width, height, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
  writeFileSync(outPath, png);
}

import { rmSync } from 'node:fs';

const cards = JSON.parse(readFileSync(join(root, 'src/data/cards.json'), 'utf8')).cards;
const ogDir = join(root, 'public/og');
const shareDir = join(root, 'public/share');
// Wipe stale output so secret (un-illustrated) cards never keep an image.
rmSync(ogDir, { recursive: true, force: true });
rmSync(shareDir, { recursive: true, force: true });
mkdirSync(ogDir, { recursive: true });
mkdirSync(shareDir, { recursive: true });

// Only illustrated cards get share images (the rest stay secret).
const ready = cards.filter((c) => existsSync(join(root, 'public/cards/art', `${c.id}.svg`)));
let n = 0;
for (const card of ready) {
  await render(ogTree(card), 1200, 630, join(ogDir, `${card.id}.png`));
  await render(portraitTree(card), 1080, 1350, join(shareDir, `${card.id}.png`));
  n++;
}
console.log(`✓ generated ${n * 2} share images (${n} illustrated card(s))`);

// Raster thumbnails for the gallery. A detailed SVG scaled inside a small
// <img> re-rasterizes (and shimmers) on resize; a fixed PNG just scales.
function rasterize(svgPath, width, outPath) {
  const svg = readFileSync(svgPath, 'utf8');
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: 'rgba(0,0,0,0)',
  }).render().asPng();
  writeFileSync(outPath, png);
}
const THUMB_W = 440; // ~2.5× the largest gallery tile
const backSvg = join(root, 'public/cards/back.svg');
if (existsSync(backSvg)) rasterize(backSvg, THUMB_W, join(root, 'public/cards/back-thumb.png'));
for (const card of ready) {
  rasterize(join(root, 'public/cards/art', `${card.id}.svg`), THUMB_W, join(root, 'public/cards/art', `${card.id}-thumb.png`));
}
console.log(`✓ thumbnails: back + ${ready.length} card(s)`);
