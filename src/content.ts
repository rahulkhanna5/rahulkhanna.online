import {
  ABOUT, ABOUT_CARD_CAT, CATEGORY_LABEL, CERTS, CONTACT, JOURNEY, LINE, OIL_RESULTS, PATENT_TOOLS, PROJECTS, RESEARCH, STATS,
  TOOLS, type Category, type Project,
} from './data'

/** Fills the page from src/data.ts. */

export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
const fill = (id: string, html: string) => { document.getElementById(id)!.innerHTML = html }

/** A short stroke of floor paint in a discipline's colour, with the discipline named for screen readers. */
export const stroke = (c: Category, label = true) =>
  `<span class="stroke" style="--c:${LINE[c].colour}">${label ? `<span class="sr">${CATEGORY_LABEL[c]}</span>` : ''}</span>`
const cats = (p: Project) =>
  `<span class="cats" title="${p.cats.map((c) => CATEGORY_LABEL[c]).join(', ')}">${p.cats.map((c) => stroke(c)).join('')}</span>`

function links(p: Project) {
  if (!p.links.length) return ''
  // other sites open in a new tab; pages of this site open in place
  const out = (href: string) => (href.startsWith('/') ? '' : ' target="_blank" rel="noopener"')
  return `<p class="links">${p.links.map((l) => `<a href="${l.href}"${out(l.href)}>${esc(l.label)}</a>`).join('')}</p>`
}
const detail = (p: Project) => `
  <div class="detail">
    <div>
      <h4>The problem</h4>
      <p>${esc(p.problem)}</p>
      <h4>Result</h4>
      <ul class="ticks">${p.outcome.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
    </div>
    <div>
      <h4>What I built</h4>
      <ul>${p.built.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
    </div>
  </div>
  <p class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</p>
  ${links(p)}
  ${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}`

/** The featured project gets a whole scoresheet, with its model benchmark as a league table. */
function featured(p: Project) {
  return `
  <article class="sheet feature" id="project-${p.id}">
    <div class="feature-copy">
      <p class="meta">${cats(p)}<span>${p.cats.map((c) => CATEGORY_LABEL[c]).join(' and ')}, ${p.year}</span></p>
      <h3>${esc(p.title)}</h3>
      <p class="kicker">${esc(p.kicker)}</p>
      <p>${esc(p.summary)}</p>
      <ul class="ticks">${p.outcome.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
      <details class="more">
        <summary>How it was built</summary>
        <p>${esc(p.problem)}</p>
        <ul>${p.built.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      </details>
      <p class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</p>
      ${links(p)}
    </div>
    <div class="league" id="league">
      <div class="league-head">
        <h4>Model league table</h4>
        <div class="seg" role="group" aria-label="Oil benchmark">
          <button data-k="target" data-v="Brent" aria-pressed="true">Brent</button><button data-k="target" data-v="WTI" aria-pressed="false">WTI</button>
        </div>
        <div class="seg" role="group" aria-label="Forecast horizon">
          <button data-k="h" data-v="1" aria-pressed="true">1-day</button><button data-k="h" data-v="7" aria-pressed="false">7-day</button>
        </div>
      </div>
      <table>
        <thead><tr><th scope="col">Pos</th><th scope="col">Model</th><th scope="col" class="num">MAPE</th><th scope="col" class="num">R²</th><th scope="col" class="num">MAE</th></tr></thead>
        <tbody id="league-rows"></tbody>
      </table>
      <p class="league-foot">Forecast error on the held-out test set, lowest first. MAE is in US dollars. The stacked model combines the other three.</p>
    </div>
  </article>`
}

const row = (p: Project) => `
  <details class="row" id="project-${p.id}">
    <summary>
      <span class="row-title"><b>${esc(p.title)}</b><span>${esc(p.kicker)}</span></span>
      <span class="row-sum">${esc(p.summary)}</span>
      <span class="row-side">${cats(p)}<span class="year">${p.year}</span></span>
    </summary>
    ${detail(p)}
  </details>`

/** Rows of the league table for one target and horizon, best model first. */
export function leagueRows(target: string, horizon: string) {
  const rows = [...OIL_RESULTS[`${target}-${horizon}`]].sort((a, b) => a.mape - b.mape)
  const worst = Math.max(...rows.map((r) => r.mape))
  return rows.map((r, i) => `
    <tr${i === 0 ? ' class="top"' : ''}>
      <td>${i + 1}</td>
      <th scope="row">${r.model}<i class="bar" style="--w:${((r.mape / worst) * 100).toFixed(1)}%"></i></th>
      <td class="num">${r.mape.toFixed(2)}%</td><td class="num">${r.r2.toFixed(3)}</td><td class="num">${r.mae.toFixed(2)}</td>
    </tr>`).join('')
}

export function renderContent() {
  fill('about-copy', `
    <p class="lead">${esc(ABOUT.lead)}</p>
    ${ABOUT.paragraphs.map((t) => `<p>${esc(t)}</p>`).join('')}
    <p>${esc(ABOUT.offClock)}</p>`)

  // manual flip-scoreboard cards, the kind that sit on an umpire's table
  fill('stats', STATS.map((s) => `
    <div class="flip"><b>${s.value.toFixed(s.decimals ?? 0)}${s.suffix ?? ''}</b><span>${esc(s.label)}</span></div>`).join(''))

  fill('games', ABOUT.cards.map((c, i) => `
    <div class="game">${stroke(ABOUT_CARD_CAT[i], false)}<h4>${esc(c.title)}</h4><p>${esc(c.text)}</p></div>`).join(''))

  fill('timeline', JOURNEY.map((j) => `
    <li${j.now ? ' class="now"' : ''}>
      <p class="when">${esc(j.when)}</p>
      <h3>${esc(j.title)}</h3>
      ${j.where ? `<p class="where">${esc(j.where)}</p>` : ''}${j.text ? `<p>${esc(j.text)}</p>` : ''}
    </li>`).join(''))

  const [first, ...rest] = PROJECTS
  fill('featured', featured(first))
  fill('projects', rest.map(row).join(''))
  fill('league-rows', leagueRows('Brent', '1'))

  fill('research-sheet', `
    <table class="records">
      <thead><tr><th scope="col">Status</th><th scope="col">Title</th><th scope="col">Reference</th></tr></thead>
      <tbody>${RESEARCH.map((r) => `<tr><td><span class="tag ${r.kind}">${esc(r.status)}</span></td><th scope="row">${esc(r.title)}</th><td>${esc(r.meta)}</td></tr>`).join('')}</tbody>
    </table>
    <h4>Patent search</h4>
    <p class="stack">${PATENT_TOOLS.map((t) => `<span>${esc(t)}</span>`).join('')}</p>
    <h4>Certifications</h4>
    <ul class="certs">${CERTS.map((c) => `<li><b>${esc(c.title)}</b><span>${esc(c.by)}</span></li>`).join('')}</ul>`)

  fill('tools', TOOLS.map((g) => `
    <div class="tool-group" style="--c:${LINE[g.line].colour}"><h4>${esc(g.name)}</h4><ul>${g.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join(''))

  fill('socials', CONTACT.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join(''))
}
