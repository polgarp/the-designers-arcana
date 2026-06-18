// "Threads" — loose thematic groupings that run across the deck. Each is a
// cluster of related keywords; a card belongs to a thread if it shares any
// keyword. The buckets are deliberately generous so every card connects
// (no keyword left behind). Derived entirely from existing card keywords —
// the card content is untouched.

export interface Thread {
  id: string;
  label: string;
  blurb: string;
  seeds: string[];
}

export const THREADS: Thread[] = [
  {
    id: 'beginnings',
    label: 'Beginnings',
    blurb: 'Blank canvases, first tries, and the nerve to start.',
    seeds: ['beginning','beginnings','blank','blank-canvas','potential','innocence','naivety','first-time','discovery','exploration','curiosity','ideation','brainstorm','opportunity','hope','calling','founder','onboarding','candidate','audition','inspiration','breakthrough','learning','pmf','courage'],
  },
  {
    id: 'craft',
    label: 'Craft & Mastery',
    blurb: 'The long apprenticeship: rigor, taste, and the well-made thing.',
    seeds: ['craft','personal-craft','mastery','rigor','discipline','precision','diligence','quality','detail','taste','aesthetic','beauty','practice','study','pedantry','tokens','tools','depth','structure','system','bar','unit','technical-authority','consistency','practicality','stability','workshop'],
  },
  {
    id: 'vision',
    label: 'Vision & Strategy',
    blurb: 'Roadmaps, horizons, and the argument about where to go.',
    seeds: ['vision','strategy','roadmap','foresight','horizon','plan','direction','priorities','long-arc','long-game','long-term','scope','alignment','foundation','compass','purpose','expansion','stretch','hinge','milestone','product-management'],
  },
  {
    id: 'insight',
    label: 'Truth & Insight',
    blurb: 'What users actually do, and the discipline of seeing it.',
    seeds: ['truth','user-truth','insight','intuition','evidence','clarity','knowing','gut','wisdom','revelation','honesty','perspective','reflection','introspection','subconscious','pre-verbal','mind','intellect','synthesis','metrics','measurement','outcomes','visibility','research','validation','voice'],
  },
  {
    id: 'decisions',
    label: 'Decisions & Critique',
    blurb: 'Calls, trade-offs, and the feedback that sharpens them.',
    seeds: ['decision','choice','choices','critique','feedback','evaluation','judgment','trade-offs','tradeoff','discernment','directness','conflict','defense','fairness','ethics','accountability','lessons','presentation'],
  },
  {
    id: 'people',
    label: 'People & Empathy',
    blurb: 'Stakeholders, teammates, and the work of being understood.',
    seeds: ['empathy','stakeholders','collaboration','teamwork','team','community','partnership','kinship','togetherness','warmth','care','compassion','generosity','advocacy','diplomacy','negotiation','trust','connection','person','sharing','teaching','guidance','nurture','user','user-focus','charm','democratization','public-pain'],
  },
  {
    id: 'leadership',
    label: 'Leadership & Authority',
    blurb: 'Influence, stewardship, and what you do with a mandate.',
    seeds: ['leadership','authority','stewardship','management','headcount','influence','politics','establishment','doctrine','legacy','recognition','credit','promotion','success','victory','winning','confidence','drive','ambition','force','control','autonomy','self-direction','history','tradition','permission','approval'],
  },
  {
    id: 'endurance',
    label: 'Endurance & Grind',
    blurb: 'Deadlines, deep work, and staying upright through it.',
    seeds: ['endurance','stamina','perseverance','resilience','fortitude','willpower','focus','flow','rhythm','momentum','vitality','deadline','deadlines','haste','juggling','weight','burden','anxiety','worry','insomnia','fear','pain','stakes','challenge','friction','blocked','constraint','constraints','restriction','cost','scarcity','debt','underinvestment','deep-work','execution','ship','shipping','shortcut','necessity'],
  },
  {
    id: 'stillness',
    label: 'Patience & Stillness',
    blurb: 'Pauses, boundaries, and the answer you wait to give.',
    seeds: ['patience','pause','rest','calm','composure','presence','solitude','sanctuary','suspension','withdrawal','stealth','moonlight','moderation','boundaries','self-limit','gratitude','joy','harmony','balance','recovery'],
  },
  {
    id: 'growth',
    label: 'Growth & Compounding',
    blurb: 'Gardens, interest, and the things that build on themselves.',
    seeds: ['growth','abundance','compounding','self-perpetuating','scale','interest','garden','cycles','renewal','rebirth','nurture','fulfillment'],
  },
  {
    id: 'endings',
    label: 'Endings & Transition',
    blurb: 'Layoffs, launches, and the doorways between one thing and the next.',
    seeds: ['ending','endings','transition','change','shift','departure','passage','release','loss','grief','layoff','crisis','collapse','rock-bottom','rupture','reckoning','transformation','completion','celebration','nostalgia','memory','permanence','fate','give-up','movement','adaptation','integration'],
  },
  {
    id: 'shadow',
    label: 'Ego & Shadow',
    blurb: 'Hubris, illusion, and the costs you do not want to look at.',
    seeds: ['ego','hubris','illusion','fantasy','addiction','apathy','spiral','drift','shadow','identity','compromise','conflict','defense','betrayal','pyrrhic','cleverness','borrowing','vigilance','noise','missed-signal','uncertainty','trap','ethics','fairness','accountability'],
  },
];

export const threadById = new Map(THREADS.map((t) => [t.id, t]));

// Which threads a set of keywords belongs to (generous: any shared seed).
export function threadsForKeywords(keywords: string[]): string[] {
  const kw = new Set(keywords);
  return THREADS.filter((t) => t.seeds.some((s) => kw.has(s))).map((t) => t.id);
}
