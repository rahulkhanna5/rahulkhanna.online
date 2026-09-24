# rahulkhanna.online

Personal portfolio for Rahul Khanna (Data Analyst / Data Engineer). Vite +
TypeScript, no framework. Hosted on Vercel, connected to this GitHub repo:
every push to `main` deploys the live site; other branches get a Vercel
preview deployment.

## File map

| File | What it is |
|---|---|
| `index.html` | Page markup — hero, about, journey, work, research, stack, contact, the "Ask my portfolio" panel |
| `src/main.ts` | App entry: page loader, Lenis smooth scroll + GSAP scroll animations, project cards + drawer, animated counters |
| `src/hero.ts` | Three.js point-cloud hero (noise → clusters → wave surface) |
| `src/stack.ts` | Matter.js physics bubbles for the tech-stack section |
| `src/ask.ts` | "Ask my portfolio" — in-browser TF-IDF search over `KB`, cosine similarity, no API call. Answers only come from clicking a suggestion chip; there is no free-text input (removed — see below) |
| `src/data.ts` | **All site content lives here**: `PROJECTS`, `OIL_RESULTS` (real model metrics), `KB` (the Q&A knowledge base for `ask.ts`) |
| `src/styles.css` | Design tokens at the top (`:root`), then all component styles |
| `public/` | Static passthrough — `rahul.webp`, `avatar.webp`, `resume.pdf`, `favicon.svg`, `dashboards/dailyrate/` (a standalone Zoho Analytics export, kept working as-is, linked from the site) |
| `vercel.json` | Framework: vite, build `npm run build`, output `dist` |

## Editing content

Everything a visitor reads — project descriptions, metrics, bio text, the
Q&A answers — is in `src/data.ts`. Don't hardcode content into `.ts` logic
files or `index.html` beyond structural text (headings, labels).

**To add a project:** add an entry to `PROJECTS` in `src/data.ts` following
the existing shape. `main.ts` renders cards and the detail drawer from this
array — no changes needed there unless the shape changes.

**To add a chat answer:** add an entry to `KB` in `src/data.ts` (`title`,
`tags`, `text`, optional `href` to jump to a page section). `ask.ts` builds
its TF-IDF index from `KB` automatically on load — no reindexing step.
Keep `tags` keyword-rich; that's what the search matches against.

## Commands

```bash
npm install       # install deps
npm run dev        # local dev server (Vite, HMR)
npm run build       # tsc --noEmit && vite build — must pass with 0 type errors
```

`npm run build` runs the TypeScript type-check before bundling. A failing
build must not be pushed to `main`.

## Rules

- **No invented numbers or claims.** Every metric, percentage, patent count
  or project fact on the site must trace back to something real (a résumé
  line, a repo, an actual model result). If content needs a new figure,
  ask — don't estimate one to fill a gap.
- **Keep `prefers-reduced-motion` support.** The hero, scroll animations and
  physics bubbles all have reduced-motion fallbacks. Preserve that path for
  any new animation.
- **Never pair a GSAP entrance animation with a CSS transition on the same
  opacity/transform property.** GSAP's ScrollTrigger drives those properties
  directly via inline styles; a CSS `transition` on the same property fights
  it and produces visible stutter or a stuck initial state. Animate either
  in GSAP or in CSS, not both, per element.

## The "Ask my portfolio" panel

Originally had a free-text input. It was removed because the TF-IDF matcher
has no vocabulary for conversational input (e.g. "hi") and would dead-end
with "I couldn't find that one." What remains: a fixed set of suggestion
chips (`SUGGEST` in `src/ask.ts`) that are guaranteed to match a `KB` entry,
plus follow-up chips generated from the next-best matches after each
answer. If you want free text back, it needs either a better fallback
(e.g. surface partial matches instead of a dead end) or a real backend —
don't just re-add the input without addressing why it was removed.
