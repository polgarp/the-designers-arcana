---
target: the gallery index (src/pages/index.astro)
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-08-20T06-21-46Z
slug: src-pages-index-astro
---
# Design Critique — The Designer's Arcana, gallery index

**Method: dual-agent** (A: design review, isolated · B: detector + browser evidence, isolated)
**Target:** `src/pages/index.astro` · **Mode: Experience** · Reviewed at 1440x900 and 390x844, local dev (2/78 plates) and production polgarp.com (6/78)

> Local working copy has 2 art SVGs in `public/cards/art/`; production has 6. Counts below are production.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | "6 of 78 revealed / 8%" sits at the bottom of a 5,259px scroll (12.8 mobile screens). |
| 2 | Match System / Real World | 3 | Strong vocabulary (Sealed/Revealed, "after The Chariot"). Undercut by "Motif" — a coined term on a page nothing links to. |
| 3 | User Control and Freedom | 3 | Filter state lives only in memory: not shareable, not bookmarkable, lost on navigate-away. |
| 4 | Consistency and Standards | 2 | On themes/[id] the oxblood pills are inert <li>s while the grey pills below are links. Accent means "dead," neutral means "clickable." |
| 5 | Error Prevention | 3 | No dead links in prod, but `cursor: zoom-in` + "Zoom" hint sit on card backs, promising a payoff that isn't there. |
| 6 | Recognition Rather Than Recall | 2 | 72 tiles are visually identical and unlabeled. Nothing distinguishes card 3 from card 19. |
| 7 | Flexibility and Efficiency | 2 | The filter rail IS the efficiency layer and it half-works. No counts, no favourable default, no deep-linkable state. |
| 8 | Aesthetic and Minimalist Design | 3 | Palette, type ladder, two-scale shadow system excellent. Loses a point to the 38-pill wall and the masked reading column. |
| 9 | Error Recovery | 3 | 404 is on-voice with a clear exit, but 900px of empty cream. A tarot 404 with no card is a missed layup. |
| 10 | Help and Documentation | 1 | The About page IS documentation and it's outstanding — reachable only via a 39x17px corner link. Index's only <h1> is .sr-only. |
| **Total** | | **24/40** | **Needs work — a strong artifact behind a weak frame** |

## Design Specificity Verdict

**Authored, and unusually so — but the authoring is concentrated in the artifact and the detail page, not in the index's composition or interaction.**

Product-specific: the tile IS the card (aspect-ratio 300/450, object-fit contain, two-stop navy drop-shadow following the rounded alpha, no box/border); face-down as a first-class state (CardBack.astro is a 180°-symmetric emblem, not a grey rectangle); the suit taxonomy as argument (Pencils/Mugs/Cursors/Pixels with locked tokens propagating to rail dot, progress bar, About swatch); the disciplined type triad (Marcellus / Plex Mono / Spectral Italic used once per surface as a voice); "after The Chariot" as writing-as-interface.

Category-interchangeable: the window chrome, the left facet rail, the auto-fill minmax() grid, the progress strip (reads like a CI dashboard), the 999px keyword pills.

**Sharpest specificity failure: the card back is louder than the artwork.** The back is a dense polychrome mandala at full bleed; the finished plates are airy line drawings. In a grid of five the eye lands on the backs and skips the art. The placeholder outshouts the artifact — a direct inversion of the Experience-mode bar.

**Deterministic scan:** static detector over `src/pages src/components` returned `[]` — 0 findings, exit 0. Verified real (synthetic probe returned 3 findings/exit 2; .astro is in the scanned set). Every font-family resolves through a var(--font-*) token; zero `transition: all`; zero raw cubic-bezier. The markup layer is genuinely clean.

Rendered-DOM engine: 40 x `undersized-ui-text` (index 22, card 14, about 4), 4 x `tiny-text` (11.84px body on /about), 3 x `line-length` (~93 chars on /about). The three most-used font sizes on the index are all below 13px — 10px (13 uses), 9.6px (10 uses), 12.8px (9 uses).

False positives overridden: `cream-palette` (3) — #EFE8DA is a stated paper-stock anchor, not an AI default. `all-caps-body` (4) — all are eyebrow labels; only the char threshold trips. Lightbox ✕ 1:1 contrast — inside a `display:none` <dialog>, sits on a dark backdrop when open.

**Visual overlays: not available.** Injection attempted in full and failed — Chrome Local Network Access blocked localhost:4321 -> localhost:8400; the injected script never executed. No user-visible overlay exists. The same rule set was run through the detector's headless browser engine instead. Live server stopped cleanly.

## Overall Impression

A genuinely lovely object behind a door nobody can find. The illustrated card detail page is excellent work. The problem is arithmetic: 6 of 78 tiles link anywhere, an ~8% hit rate per click, and nothing visually distinguishes a live tile from a dead one. Visitors tap a card back, nothing happens, and conclude the site is broken.

**Biggest opportunity:** the best version of this homepage already exists inside your own code. Filter to "Revealed" and you get a calm, gallery-like page. That's the page — it's just not the one you land on.

## What's Working

1. **The card-as-object rendering is a real system with a stated rationale.** --card-lift (tight, for grid tiles) and --card-lift-lg (larger, for detail/lightbox), with a comment explaining why: cards sit on the same cream as the page, so the shadow does the separating, and the blur must stay tight in the grid or it merges across neighbours. drop-shadow (not box-shadow) follows the card's rounded alpha.

2. **The accessibility floor you did build is solid.** Measured across three pages: 0 missing alt, 0 empty alt, 0 links/buttons with empty accessible names, <html lang="en">, one <h1> per page, clean H1->H2 order, zero console errors, zero failed requests, zero horizontal overflow at 390px. All 8 first-tab elements matched :focus-visible with a 2px oxblood outline at 7.69:1. No `outline: none` anywhere. Body ink on cream: 13.02:1.

3. **The reading structure on the detail page is authored, not templated.** Upright -> Reversed -> flavor (Spectral italic, ✦ in house colour) -> "The parallel" borrows tarot's own reading grammar. Constraining blocks to 58ch inside a wider column and demoting "The parallel" to --fs-sm in --ink-60 are both correct calls.

## Priority Issues

### [P0] The placeholder wins the page, and dead tiles are indistinguishable from live ones
**What.** 72 of 78 tiles are dense polychrome mandalas; the 6 finished plates are airy line drawings. The backs win outright. Finished plates carry `loading="lazy"` (CardTile.astro:37), so on a 5,259px page they render last. Because `linkable` requires `ready || dev`, sealed tiles are <div>s in production — the hover lift only fires on a.tile, so no cursor change, no lift, no cue separating openable from not.
**Why it matters.** An Experience surface must let the artifact lead. This hides the artifact inside its own placeholder and makes finding the 8% a guessing game. On touch there isn't even a cursor to change. The failure mode isn't "unfinished" — it's "broken."
**Fix.** (a) Reduce the back's presence in the grid context only — accents to --ink-30 or ~0.55 opacity; leave the detail-page back at full strength. (b) Make Revealed the default filter state, "All 78" the deliberate second click. (c) Remove loading="lazy" from ready tiles.
**Suggested command:** /impeccable layout

### [P0] The index never says what this is — and on mobile the one line that explains it is display:none
**What.** The only heading is <h1 class="sr-only">. The tagline sits at 0.82rem in the header, and WindowChrome's @media (max-width: 640px) sets .brand__tag { display: none }. At 390x844 the first card appears at y=468: 55% of the first screen is chrome plus a 281px filter rail of nine text labels.
**Why it matters.** The framing that would rescue every other problem already exists — the About lead: "A tarot for people who ship. Seventy-eight cards for the parts of being a product designer no one warns you about." It's hidden behind a 39x17px corner link. A visitor who never clicks ABOUT never learns what this is.
**Fix.** Real masthead above the grid: the About lead at --fs-lg/--fs-xl in --font-italic, plus one status line from the ProgressStrip. On mobile collapse the FilterRail into a horizontally-scrolling chip row so cards land above 400px. Hide the version string on small screens, never the tagline.
**Suggested command:** /impeccable layout

### [P1] The craft floor collapses at small sizes — type, targets, one contrast fail, no reduced-motion CSS
**What.**
- 40 instances of sub-13px functional text: 9.6px suit labels/counters, 9.92px v0.1, 10.56px About, 10px across the card page (Upright, Reversed, The parallel, all five keyword tags, Prev, Next).
- Tap targets: 11 of 89 index elements under 44x44. All nine .opt filter buttons are 23.4px tall with a 1.6px gap. a.about is 39.1x17. Card page: 10 of 12 — five keyword pills at 22px, both pager links at 35px. Identical at 390px — no mobile enlargement.
- One real contrast failure: rgb(167,163,148) on cream = 2.07:1 (needs 4.5:1) — the "/" separator in the brand lockup, all three pages. Separately --ink-60 passes at 5.14:1 but carries every small label down to 9.6px with 0.64 headroom.
- Zero prefers-reduced-motion rules in any stylesheet, against 166 elements on the index carrying a live animation or transition. The only handling is JS-side at FilterRail.astro:57, which gates the view-transition call but not the CSS layer.
**Fix.** min-height: 44px + padding: 0.6rem 0.75rem on .opt and .about under @media (pointer: coarse). Promote every label on a button or link off --fs-2xs to --fs-xs minimum. Darken the "/" to --ink-60. Add one @media (prefers-reduced-motion: reduce) block zeroing the tile transform, the transitions, and the four da-* keyframes.
**Suggested command:** /impeccable audit

### [P1] Filtering states the wrong number, and leaves no trace
**What.** FilterRail's toggle() hides tiles via style.display and hides emptied sections but never touches .section-head__count. Filter to Revealed and the header reads "Major Arcana — 22" above three cards. No counts in the rail, no live region, no "showing N of 78," no reset. Filter state isn't in the URL.
**Why it matters.** The one place the interface commits to a number, and under its most useful interaction it commits to the wrong one. It also removes any reason to press Revealed — nothing tells you six are behind it.
**Fix.** Write the visible count into .section-head__count (3 / 22 filtered). Static counts in the rail: Revealed 6 · Sealed 72 · Pencils 14. One aria-live="polite" status line. Mirror state into the URL query.
**Suggested command:** /impeccable clarify

### [P2] The Motifs tier is unreachable, and its chips invert affordance
**What.** Twelve hand-authored motif pages exist with real blurbs and curated cross-deck lists. querySelector('a[href*="themes"]') on the production homepage returns null. Only route in: find one of 6 live cards -> open it -> click an unlabelled keyword pill. On arrival the page opens with 38 oxblood chips that are inert <li>s, styled like the grey chips below that ARE links.
**Fix.** Add Motifs as a third rail group (or a strip under the masthead) listing all 12 with counts. Cut the 38-chip block on themes/[id] or reduce to the 5 most frequent seeds at --fs-2xs in --ink-60. Reserve --house on chips exclusively for links. Label the keyword list ("Also appears in"). Drop .kw-tag--lead.
**Suggested command:** /impeccable clarify

## Cognitive Load: 4 of 8 failures — critical

FAIL Single focus — five section headers, a nine-option rail, a five-bar strip, and 78 tiles compete. Nothing is the subject.
FAIL Chunking — sections run 22/14/14/14/14; Major Arcana alone is 22 undifferentiated items.
PASS Visual grouping.
FAIL Visual hierarchy — inverted; 72 placeholders outweigh 6 plates, and the governing status is the smallest, lowest element.
PASS One thing at a time.
FAIL Minimal choices — rail 9 buttons, card keywords 5 pills, motif header 38 chips.
PASS Working memory.
PASS Progressive disclosure.

Decision points over the limit: filter rail (9, no counts), themes/[id] header (38 inert chips), card keywords (5, unlabelled).

## Emotional Journey

The peak is real and earned — the illustrated detail page, especially on mobile where art comes first. But the peak is statistically unreachable, and the valley is the majority state and unattended. In production detailCards filters to ready, so 72 cards have no page, no name, no meaning, no keywords. All 78 texts are finished and 92% is withheld to protect a reveal conceit the interface never sells as a mystery. 72 identical backs read as "unfinished," not "sealed."

End state the peak-end rule records: scrolling 12.8 mobile screens of identical backs to find "6 / 78 REVEALED · 8%" in 9.6px type.

## Persona Red Flags

**A. First-time visitor from a social share, iPhone.** OG image unfurls correctly. Then .brand__tag { display: none } removes the only explanation on exactly the device most shares open on. 281px of rail — eleven lines of mono before any image. First card at y=468. They tap a mandala: nothing. Tap another: nothing. They leave believing the site is broken. The .sr-only h1 is the site's only statement of identity and they can't see it.

**B. Hiring manager evaluating craft, desktop, 45 seconds.** First screen: 15 card backs, one plate at 162px at row 2 col 3 — a 1:15 ratio. Impression: "abandoned side project." They never scroll 5,259px to the counter, never click a 0.66rem --ink-60 corner link. Also: at 1440px the gallery column measures 895.41px while six 132px columns plus 20.8px gaps need 896.00px — short by 0.59px, so auto-fill drops to 5 columns, inflating every tile and adding a row per section.

**C. Returning visitor checking for new art.** Structurally unserved. No new badge, no dates, no changelog, no recency ordering — a new Cursors card lands 8,000px down. The only signal is the bottom counter, requiring a full scroll AND remembering last visit's number. Revealed shows all 6 in deck order with no indication which is new. No RSS, no follow, no notify.

## Minor Observations

- Arial leaks into the card page: button.cardzoom and button.lightbox__close declare no font-family, falling through to Chrome's UA control font — four elements off the type system.
- .read clips text mid-sentence with a 30px mask fade as the only cue; on illustrated cards this hides the entire Share block.
- The Share block isn't a share affordance — a 170px img and "right-click or long-press." No copy-link, no Web Share API, no click target.
- Zoom is undiscoverable on touch (.cardzoom__hint is hover/focus-visible only) and pointless on placeholders.
- A screen reader hears "Unrevealed card" 72 times on the index.
- alt="Card back" and aria-label="Unrevealed card" are two inconsistent labels for one object.
- On mobile, card detail orders keywords before the name.
- The About page's column is centered while the wordmark stays flush left — ~120px misalignment on that page only.
- The 404 shows no card, though the copy ("You drew a blank") is asking for one.
- The --fs-* ladder is declared then bypassed: 1.15rem/0.7rem in index.astro; 0.62/0.66/0.82rem in WindowChrome; 1.02/0.74rem in about.astro.
- Three names for one concept: THREADS / THREAD_TERM = "Motif" / route themes/.
- /about has 4 instances of 11.84px body copy at ~93 chars per line.

## Questions to Consider

1. What if the deck were face-UP by default, and "the rest" were one object rather than 72? Show the 6 finished plates large; represent the remaining 72 as a single fanned stack with "72 still sealed." You'd lose the completionist grid and gain a page that looks finished at every stage of completion.
2. The writing for all 78 cards is done. What is the reveal actually protecting? Opening all 78 readings would take you from a 6-page site to a 78-page site overnight and turn the artwork's arrival into an upgrade to pages people already know.
3. What is the tarot verb, and why is your only verb "filter"? Tarot's native interactions are draw, shuffle, cut, spread, reverse. If the primary action were "draw a card," the 404 would write itself and sealed cards would become anticipation instead of absence.
4. Is there a returning visitor at all? Everything is structured as a serial release, but nothing serves the person who comes back.
