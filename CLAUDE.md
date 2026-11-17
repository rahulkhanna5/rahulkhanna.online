# rahulkhanna.online

Personal portfolio for Rahul Khanna (Data Analyst / Data Engineer). Vite +
TypeScript, no framework, no runtime dependencies. Hosted on Vercel,
connected to this GitHub repo: every push to `main` deploys the live site;
other branches get a Vercel preview deployment.

## The design

The page is a multi-sport hall floor seen from above. The floor is one flat
blue; every game painted on it has its own line colour, and every kind of
work on the site does too:

| Line colour | Discipline (`Category`) |
|---|---|
| white | Data engineering (`de`) |
| yellow | Analytics & BI (`bi`) |
| red | Machine learning (`ml`) |
| green | Apps & products (`apps`) |

The mapping lives in `LINE` in `src/data.ts`. Project rows, the "four games"
cards and the toolkit groups all take their colour from it, so keep it the
single source.

- **Hero:** court lines paint themselves in once on load (SVG stroke draw);
  that is the page's one orchestrated motion.
- **The ball:** a yellow ball lies on the floor. Scrolling carries it with the
  page and the window edges push it along; the pointer kicks it. It sleeps
  when at rest and is a static decoration under reduced motion.
- **Scoresheets:** the featured project and the results list are cream
  paper "sheets" on the floor. The featured project (`PROJECTS[0]`) shows the
  OilSense model benchmark as a league table.
- **Journey:** a red running lane with a white mark per milestone and a
  chequered line for "Now".
- **Contact:** the red track with a chequered finish line.

Type: Big Shoulders Display (painted headings, uppercase) and Schibsted
Grotesk (body), both from Google Fonts.

## File map

| File | What it is |
|---|---|
| `index.html` | Page markup: hero, about, journey, work, research, contact, the ball; empty containers that `content.ts` fills |
| `src/main.ts` | Nav and mobile menu, current-section marking, league-table toggles, project deep links, email copy, the ball's physics |
| `src/content.ts` | Renders every content section from `data.ts` |
| `src/data.ts` | **All site content lives here**: `PROJECTS`, `OIL_RESULTS` (real model metrics), `STATS`, `ABOUT`, `JOURNEY`, `RESEARCH`, `PATENT_TOOLS`, `CERTS`, `TOOLS`, `CONTACT`, and the `LINE` colour legend |
| `src/styles.css` | Design tokens at the top (`:root`), then all component styles |
| `public/` | Static passthrough: `rahul.webp`, `resume.pdf`, `favicon.svg`, `dashboards/dailyrate/` (a standalone Zoho Analytics export, kept working as-is, linked from the site) |
| `vercel.json` | Framework: vite, build `npm run build`, output `dist` |

## Editing content

Everything a visitor reads (project descriptions, metrics, bio text, journey
entries) is in `src/data.ts`. Don't hardcode content into `.ts` logic files
or `index.html` beyond structural text (headings, labels).

**To add a project:** add an entry to `PROJECTS` in `src/data.ts` following
the existing shape. The first entry is the featured scoresheet; the rest
render as rows in the results list. Projects open by URL: `#project-<id>`.

**The résumé is the source of truth.** `public/resume.pdf` is the file the
site links to. When it changes, bring `ABOUT`, `JOURNEY`, `CERTS`, `TOOLS`
and `RESEARCH` in line with it. The toolkit lists only what the résumé
lists.

## Commands

```bash
npm install       # install deps
npm run dev        # local dev server (Vite, HMR)
npm run build       # tsc --noEmit && vite build — must pass with 0 type errors
```

`npm run build` runs the TypeScript type-check before bundling. A failing
build must not be pushed to `main`.

In dev, `__ball.get()` and `__ball.kick(x, y)` in the browser console read
and nudge the ball. Add `?reduced` to the URL to preview the reduced-motion
version.

## Rules

- **No invented numbers or claims.** Every metric, percentage, patent count
  or project fact on the site must trace back to something real (a résumé
  line, a public repo, a live report, an actual model result). If content
  needs a new figure, ask — don't estimate one to fill a gap.
- **Keep `prefers-reduced-motion` support.** With reduced motion the court
  lines appear already painted, the hero text doesn't wipe in, the league
  bars don't grow, and the ball sits still. `main.ts` adds `reduced` to
  `<html>`; `styles.css` honours both the class and the media query.
- **Animate a property from either CSS or JavaScript, never both.** The ball
  is moved by JavaScript (`transform`) and has no CSS transition; everything
  else is CSS.
- **Keep the line-colour legend honest.** A colour on the page means its
  discipline. Don't use white, yellow, red or green lines decoratively for
  anything else on the floor.
