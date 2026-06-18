// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://polgarp.github.io/the-designers-arcana/
// All internal links/assets go through import.meta.env.BASE_URL so the
// base path is honored in both dev and prod.
export default defineConfig({
  site: 'https://polgarp.github.io',
  base: '/the-designers-arcana',
});
