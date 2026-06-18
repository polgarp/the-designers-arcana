// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site, served under the account's custom domain:
// https://polgarp.com/the-designers-arcana/
// All internal links/assets go through import.meta.env.BASE_URL so the
// base path is honored in both dev and prod.
export default defineConfig({
  site: 'https://polgarp.com',
  base: '/the-designers-arcana',
});
