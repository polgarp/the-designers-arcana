// Sync deck content from the source-of-truth deck repo into this showcase.
// Copies card data + any finished art SVGs. The source location is taken
// from CONTENT_REPO_PATH (set by CI), or a local, git-ignored `.content-path`
// file for local dev — so the deck repo isn't named in tracked source.
//
//   CONTENT_REPO_PATH=<path-to-deck-checkout> node scripts/sync-content.mjs
//
// Readiness is derived later from which art SVGs landed here.

import { cp, mkdir, readdir, rm, copyFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const pathFile = join(root, '.content-path');
const contentPath =
  process.env.CONTENT_REPO_PATH ??
  (existsSync(pathFile) ? readFileSync(pathFile, 'utf8').trim() : null);
if (!contentPath) {
  console.error('✗ No deck source path. Set CONTENT_REPO_PATH, or create a');
  console.error('  git-ignored `.content-path` file with the path to the deck checkout.');
  process.exit(1);
}
const content = resolve(root, contentPath);

const srcCards = join(content, 'data', 'cards.json');
const srcArt = join(content, 'public', 'cards', 'art');
const dstData = join(root, 'src', 'data');
const dstArt = join(root, 'public', 'cards', 'art');

if (!existsSync(srcCards)) {
  console.error(`✗ cards.json not found at ${srcCards}`);
  console.error(`  Check CONTENT_REPO_PATH / .content-path points at the deck checkout.`);
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

// 3. the shared card back, if the source provides one (_back.svg)
const srcBack = join(srcArt, '_back.svg');
const dstBack = join(root, 'public', 'cards', 'back.svg');
if (existsSync(srcBack)) {
  await copyFile(srcBack, dstBack);
  console.log(`✓ card back → public/cards/back.svg`);
} else {
  await rm(dstBack, { force: true });
  console.log(`· no _back.svg in source — using built-in card back`);
}
