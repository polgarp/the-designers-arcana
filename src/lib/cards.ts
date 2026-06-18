// Load deck data, derive readiness from the filesystem (art SVG present?),
// and expose grouped/ordered views + counts for the gallery & detail pages.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import raw from '../data/cards.json';
import { SUITS, type SuitKey } from '../config';

export interface RawCard {
  id: string;
  name: string;
  traditional_name: string;
  arcana: 'major' | 'minor';
  suit: SuitKey | null;
  number: number;
  upright_meaning: string;
  reversed_meaning: string;
  flavor_text: string;
  keywords: string[];
  fit_rationale: string;
}

export interface Card extends RawCard {
  numeral: string;       // display numeral: "II", "ACE", "QUEEN", "0"…
  ready: boolean;        // a finished art SVG exists
  artHref: string | null;
  domain: string | null; // suit domain, for the rail
}

const deck = raw as { deck: any; cards: RawCard[] };

const ART_DIR = join(process.cwd(), 'public', 'cards', 'art');
const BASE = import.meta.env.BASE_URL; // honors GitHub Pages base path

const ROMAN: [number, string][] = [
  [10, 'X'], [9, 'IX'], [8, 'VIII'], [7, 'VII'], [6, 'VI'],
  [5, 'V'], [4, 'IV'], [3, 'III'], [2, 'II'], [1, 'I'],
];
function roman(n: number): string {
  if (n === 0) return '0';
  let out = '';
  for (const [v, s] of ROMAN) while (n >= v) { out += s; n -= v; }
  return out;
}

// Major: Roman 0–XXI. Minor: ACE / II–X / PAGE·KNIGHT·QUEEN·KING.
function numeralFor(c: RawCard): string {
  if (c.arcana === 'major') return roman(c.number);
  switch (c.number) {
    case 1: return 'ACE';
    case 11: return 'PAGE';
    case 12: return 'KNIGHT';
    case 13: return 'QUEEN';
    case 14: return 'KING';
    default: return roman(c.number);
  }
}

function decorate(c: RawCard): Card {
  const ready = existsSync(join(ART_DIR, `${c.id}.svg`));
  return {
    ...c,
    numeral: numeralFor(c),
    ready,
    artHref: ready ? `${BASE}cards/art/${c.id}.svg` : null,
    domain: c.suit ? SUITS[c.suit].domain : null,
  };
}

export const cards: Card[] = deck.cards.map(decorate);
export const byId = new Map(cards.map((c) => [c.id, c]));

export const majors = cards
  .filter((c) => c.arcana === 'major')
  .sort((a, b) => a.number - b.number);

export const suitOrder: SuitKey[] = ['pencils', 'mugs', 'cursors', 'pixels'];
export const minorsBySuit: Record<SuitKey, Card[]> = Object.fromEntries(
  suitOrder.map((s) => [s, cards.filter((c) => c.suit === s).sort((a, b) => a.number - b.number)]),
) as Record<SuitKey, Card[]>;

// Counts for the progress strip.
function tally(list: Card[]) {
  return { ready: list.filter((c) => c.ready).length, total: list.length };
}
export const progress = {
  all: tally(cards),
  majors: tally(majors),
  suits: Object.fromEntries(suitOrder.map((s) => [s, tally(minorsBySuit[s])])) as Record<
    SuitKey,
    { ready: number; total: number }
  >,
};

// Ordered flat list (majors, then suits) for prev/next on detail pages.
export const ordered: Card[] = [
  ...majors,
  ...suitOrder.flatMap((s) => minorsBySuit[s]),
];
