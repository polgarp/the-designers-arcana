import type { APIRoute } from 'astro';
import { detailCards } from '../lib/cards';
import { THREADS } from '../themes';
import { withBase } from '../lib/url';

// Self-rolled sitemap: home, about, the 12 motif pages, and the cards that
// actually have a page (revealed-only in production). Sealed cards have no
// URL, so they never leak here.
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://polgarp.com');
  const paths = [
    '',
    'about/',
    ...THREADS.map((t) => `themes/${t.id}/`),
    ...detailCards.map((c) => `cards/${c.id}/`),
  ];
  const urls = paths
    .map((p) => `  <url><loc>${new URL(withBase(p), base).href}</loc></url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
