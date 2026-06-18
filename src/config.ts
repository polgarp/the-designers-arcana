// Single source for product-level copy + deck taxonomy.
// The name is intentionally one constant — easy to revisit later.

export const SITE = {
  name: "The Designer's Arcana",
  short: 'Arcana',
  version: 'v0.1',
  tagline: 'A working designer’s tarot.',
  description:
    'A product-design tarot — 78 cards of hard-won craft, illustrated one plate at a time.',
};

export type SuitKey = 'pencils' | 'mugs' | 'cursors' | 'pixels';

export const SUITS: Record<SuitKey, { label: string; domain: string; color: string }> = {
  pencils: { label: 'Pencils', domain: 'Vision · Strategy · Roadmaps', color: 'var(--mustard)' },
  mugs: { label: 'Mugs', domain: 'People · Empathy · Stakeholders', color: 'var(--teal)' },
  cursors: { label: 'Cursors', domain: 'Critique · Decisions · Comments', color: 'var(--slate)' },
  pixels: { label: 'Pixels', domain: 'Craft · Components · Polish', color: 'var(--oxblood)' },
};

export const suitOrderList: SuitKey[] = ['pencils', 'mugs', 'cursors', 'pixels'];

export const COURT_SENIORITY: Record<string, string> = {
  page: 'junior',
  knight: 'mid-level IC',
  queen: 'staff IC',
  king: 'manager / director',
};

export const NAV = [
  { label: 'Gallery', href: '', active: true },
  { label: 'Reading', href: '', soon: true },
  { label: 'Get the deck', href: '', soon: true },
];
