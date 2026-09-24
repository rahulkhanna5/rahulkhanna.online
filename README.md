# rahulkhanna.online

Personal portfolio of Rahul Khanna, data analyst and data engineer.

Built with Vite + TypeScript, Three.js (hero point cloud), GSAP + Lenis (scroll animation) and Matter.js (tech-stack physics). No framework, no backend.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

## Where to edit things

| What | File |
|---|---|
| Projects, case studies, OilSense benchmark numbers | `src/data.ts` → `PROJECTS`, `OIL_RESULTS` |
| "Ask my portfolio" answers | `src/data.ts` → `KB` (add an entry: title, text, tags, section link) |
| Tech-stack bubbles | `src/stack.ts` → `TOOLS` |
| Page text (about, journey, research, contact) | `index.html` |
| Colours, fonts, layout | `src/styles.css` (tokens at the top) |
| Photo, résumé, favicon | `public/` |

The old Zoho DailyRate dashboard still lives at `/dashboards/dailyrate/`.

## Features

- **Hero:** ~10k points go from noise → k-means clusters → a live "loss surface" that ripples under the cursor. Falls back to a static surface with reduced motion.
- **Case-study drawer:** problem → what I built → outcome for each project. OilSense has an interactive model-benchmark chart (real test-set results); HR Attrition embeds the live Power BI report.
- **Ask my portfolio:** TF-IDF search over `KB` that runs in the browser. No API keys, nothing to host.
- **Accessibility:** keyboard-closable drawer and chat, `prefers-reduced-motion` support, readable fallbacks on touch devices.

## Deploy

The repo is connected to Vercel. `vercel.json` tells Vercel to build with Vite and serve `dist/`, so pushing to `main` redeploys the site.
