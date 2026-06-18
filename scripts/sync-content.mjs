// Sync deck content from the source-of-truth repo (product-design-tarot)
// into this showcase. Copies card data + any finished art SVGs.
// Source path is configurable so the same script runs locally and in CI.
//
//   CONTENT_REPO_PATH=../product-design-tarot node scripts/sync-content.mjs
//
// Readiness is derived later from which art SVGs landed here.

import { cp, mkdir, readdir, rm, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const content = resolve(root, process.env.CONTENT_REPO_PATH ?? '../product-design-tarot');

const srcCards = join(content, 'data', 'cards.json');
const srcArt = join(content, 'public', 'cards', 'art');
const dstData = join(root, 'src', 'data');
const dstArt = join(root, 'public', 'cards', 'art');

if (!existsSync(srcCards)) {
  console.error(`✗ cards.json not found at ${srcCards}`);
  console.error(`  Set CONTENT_REPO_PATH to the product-design-tarot checkout.`);
  process.exit(1);
}

// 1. card data
await mkdir(dstData, { recursive: true });
await copyFile(srcCards, join(dstData, 'cards.json'));
console.log(`✓ cards.json → src/data/`);

// 2. finished art (only .svg; ignore README/placeholders)
await rm(dstArt, { recursive: true, force: true });
await mkdir(dstArt, { recursive: true });
let copied = 0;
if (existsSync(srcArt)) {
  for (const entry of await readdir(srcArt, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.svg') && !entry.name.startsWith('_')) {
      await copyFile(join(srcArt, entry.name), join(dstArt, entry.name));
      copied++;
    }
  }
}
console.log(`✓ ${copied} card art SVG(s) → public/cards/art/`);
