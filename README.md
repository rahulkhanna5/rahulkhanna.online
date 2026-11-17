# rahulkhanna.online

Personal portfolio of Rahul Khanna, data analyst and data engineer.

Built with Vite and TypeScript. No framework and no runtime dependencies. The design is a multi-sport hall floor: each kind of work has its own line colour, and there is a ball you can dribble down the page by scrolling. A second page, `/dashboards/`, shows Power BI reports page by page.

## Run locally

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

## Where to edit things

| What | File |
|---|---|
| All content: projects, OilSense benchmark numbers, about, journey, patents, certifications, toolkit, contact, dashboards | `src/data.ts` |
| Dashboard page images | `public/dashboards/shots/` |
| Résumé linked from the site | `public/resume.pdf` |
| Colours, type and layout | `src/styles.css` (tokens at the top) |
| Page structure | `index.html`, `dashboards/index.html` |

Pushing to `main` deploys the live site on Vercel.
