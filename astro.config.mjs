// @ts-check
import { defineConfig } from 'astro/config';

// NOTE: `site` + `base` get set to the GitHub Pages path once the repo
// exists (e.g. base: '/the-designers-arcana'). Left at root for local dev.
export default defineConfig({
  site: 'https://example.github.io',
  // base: '/the-designers-arcana',
});
