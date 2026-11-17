import './styles.css'
import { esc, stroke } from './content'
import { CATEGORY_LABEL, CONTACT, DASHBOARDS, type Dashboard } from './data'
import { $, initBall, initEmail, initNav } from './floor'

/** The dashboards page: every report from DASHBOARDS as a scoresheet with its pages. */

const SHOTS = '/dashboards/shots'
const no = (i: number) => `D${i + 1}`
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`

const shot = (d: Dashboard, page: string, i: number) => `
  <button class="shot${i === 0 ? ' on' : ''}" data-full="${SHOTS}/${d.id}-${i + 1}.jpg" data-title="${esc(`${d.title}: ${page}`)}"
    aria-label="${esc(`${page}, open full size`)}"${i === 0 ? '' : ' tabindex="-1" aria-hidden="true"'}>
    <img src="${SHOTS}/${d.id}-${i + 1}-sm.jpg" srcset="${SHOTS}/${d.id}-${i + 1}-sm.jpg 1200w, ${SHOTS}/${d.id}-${i + 1}.jpg 2400w"
      sizes="(max-width: 1000px) 100vw, 64vw" width="1200" height="684" loading="lazy" decoding="async"
      alt="${esc(`${d.title}, ${page} page`)}" />
  </button>`

function screen(d: Dashboard) {
  if (d.shots) {
    const tabs = d.pages.length > 1 ? `
      <div class="seg pages" role="group" aria-label="Report page">
        ${d.pages.map((p, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${esc(p)}</button>`).join('')}
      </div>` : ''
    return `${tabs}
      <div class="screen">${d.pages.map((p, i) => shot(d, p, i)).join('')}</div>
      <p class="screen-foot">Exported from Power BI. Select the page to see it full size.</p>`
  }
  return `
    <div class="screen live">
      <button class="play" data-src="${d.live}" data-title="${esc(d.title)}">
        <b>Load the live report</b>
        <span>${plural(d.pages.length, 'page')}, fully interactive. Loads from Microsoft Power BI.</span>
      </button>
    </div>
    <p class="screen-foot">Pages: ${d.pages.map(esc).join(', ')}.</p>`
}

const report = (d: Dashboard, i: number) => `
  <article class="sheet dash" id="${d.id}">
    <header class="dash-head">
      <p class="dash-no" aria-hidden="true">${no(i)}</p>
      <div>
        <p class="meta"><span class="cats">${d.cats.map((c) => stroke(c)).join('')}</span>
          <span>${d.cats.map((c) => CATEGORY_LABEL[c]).join(' and ')}, ${plural(d.pages.length, 'page')}</span>
          ${d.synthetic ? '<span class="tag">Synthetic data</span>' : ''}${d.live ? '<span class="tag live">Live</span>' : ''}</p>
        <h3>${esc(d.title)}</h3>
        <p class="kicker">${esc(d.kicker)}</p>
      </div>
    </header>
    ${screen(d)}
    <div class="dash-body">
      <div>
        <p>${esc(d.summary)}</p>
        <h4>What it shows</h4>
        <ul class="ticks">${d.findings.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      </div>
      <div>
        <h4>What I built</h4>
        <ul>${d.built.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
        <p class="stack">${d.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</p>
        <p class="note">${esc(d.data)}</p>
        ${d.related ? `<p class="links"><a href="${d.related.href}">${esc(d.related.label)}</a></p>` : ''}
      </div>
    </div>
  </article>`

const pages = DASHBOARDS.reduce((n, d) => n + d.pages.length, 0)
$('#dash-count').textContent = `${plural(DASHBOARDS.length, 'Power BI report')}, ${pages} pages`
$('#fixtures').innerHTML = DASHBOARDS.map((d, i) => `
  <li><a href="#${d.id}"><b>${no(i)}</b>${esc(d.title)}<span class="cats">${d.cats.map((c) => stroke(c, false)).join('')}</span></a></li>`).join('')
$('#reports').innerHTML = DASHBOARDS.map(report).join('')
$('#socials').innerHTML = CONTACT.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')

// the sheets were drawn after the browser looked for #id, so go there now
const target = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null
if (target) {
  const go = () => target.scrollIntoView({ behavior: 'instant' })
  if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true })
}

initNav()
initBall({ x: 0.76, y: 0.5, mx: 0.8, my: 0.2 })
initEmail()

/* ---------- page switcher: one report page on screen at a time ---------- */
const reports = $('#reports')
reports.addEventListener('click', (e) => {
  const t = e.target as HTMLElement
  const tab = t.closest('.pages button') as HTMLButtonElement | null
  if (tab) {
    const sheet = tab.closest('.dash')!, i = Number(tab.dataset.i)
    sheet.querySelectorAll('.pages button').forEach((b) => b.setAttribute('aria-pressed', String(b === tab)))
    sheet.querySelectorAll<HTMLElement>('.shot').forEach((s, j) => {
      s.classList.toggle('on', j === i)
      s.toggleAttribute('aria-hidden', j !== i)
      if (j === i) s.removeAttribute('tabindex'); else s.tabIndex = -1
    })
    return
  }
  const s = t.closest('.shot.on') as HTMLElement | null
  if (s) return openZoom(s.dataset.full!, s.dataset.title!)
  const play = t.closest('.play') as HTMLButtonElement | null
  if (play) {
    // swap the poster for Microsoft's viewer only when asked: it is heavy and sets its own cookies
    const frame = document.createElement('iframe')
    frame.src = play.dataset.src!
    frame.title = `${play.dataset.title}, live Power BI report`
    frame.allowFullscreen = true
    frame.loading = 'lazy'
    play.replaceWith(frame)
  }
})

/* ---------- full-size view ---------- */
const zoom = $('#zoom') as HTMLDialogElement, zoomImg = $('#zoom-img') as HTMLImageElement
function openZoom(src: string, title: string) {
  zoomImg.src = src
  zoomImg.alt = title
  $('#zoom-title').textContent = title
  zoom.showModal()
}
$('#zoom-close').addEventListener('click', () => zoom.close())
zoom.addEventListener('click', (e) => { if (e.target === zoom) zoom.close() })
