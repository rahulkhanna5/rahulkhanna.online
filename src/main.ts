import './styles.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createHero, HERO_POINTS } from './hero'
import { createStack } from './stack'
import { initAsk } from './ask'
import { PROJECTS, CATEGORY_LABEL, OIL_RESULTS, type Project } from './data'

gsap.registerPlugin(ScrollTrigger)

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector(s) as T
const $$ = <T extends HTMLElement = HTMLElement>(s: string) => Array.from(document.querySelectorAll(s)) as T[]
const CAT_COLOR: Record<string, string> = { de: 'var(--c-de)', bi: 'var(--c-bi)', ml: 'var(--c-ml)', apps: 'var(--c-apps)' }

/* ---------- smooth scroll ---------- */
let lenis: Lenis | null = null
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis!.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}
function scrollTo(target: string) {
  const el = document.querySelector(target) as HTMLElement | null
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 })
  else el.scrollIntoView()
}
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
  if (!a) return
  const href = a.getAttribute('href')!
  if (href.length < 2) return
  e.preventDefault()
  closeMenu()
  scrollTo(href)
})

/* ---------- hero ---------- */
const hudStage = $('#hud-stage'), hudPts = $('#hud-points'), hudCur = $('#hud-cursor')
hudPts.textContent = HERO_POINTS().toLocaleString('en-IN')
let hero: ReturnType<typeof createHero> | null = null
try {
  hero = createHero($<HTMLCanvasElement>('#hero-canvas'), (s) => (hudStage.textContent = s), (x, z) => (hudCur.textContent = `(${x.toFixed(2)}, ${z.toFixed(2)})`), reduced)
} catch {
  hudStage.textContent = 'static'
}

ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: 'bottom top', onUpdate: (s) => hero?.setScroll(s.progress) })

// rotating word
const words = ['pipelines', 'dashboards', 'models', 'data products']
let wi = 0
const swap = $('#swap')
if (!reduced) setInterval(() => {
  wi = (wi + 1) % words.length
  gsap.to(swap, { opacity: 0, y: -8, duration: 0.25, onComplete: () => { swap.textContent = words[wi]; gsap.fromTo(swap, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }) } })
}, 2600)

/* ---------- loader ---------- */
document.body.classList.add('loading')
function runLoader(): Promise<void> {
  const loader = $('#loader'), fill = $('#loader-fill'), rows = $('#loader-rows'), status = $('#loader-status')
  if (reduced) { loader.classList.add('done'); return Promise.resolve() }
  return new Promise((resolve) => {
    const total = 12480
    const o = { p: 0 }
    const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve()
    gsap.to(o, {
      p: 1, duration: 1.6, ease: 'power2.inOut',
      onUpdate: () => {
        fill.style.width = `${o.p * 100}%`
        rows.textContent = `rows read: ${Math.round(o.p * total).toLocaleString('en-IN')}`
        if (o.p > 0.55) status.textContent = 'deduplicating · 0 conflicts'
        if (o.p > 0.85) status.textContent = 'schema validated ✓'
      },
      onComplete: () => {
        fontsReady.then(() => setTimeout(() => { loader.classList.add('done'); resolve() }, 250))
      },
    })
  })
}

function intro() {
  document.body.classList.remove('loading')
  hero?.start()
  if (reduced) return
  gsap.to('.hero-title .line > span', { y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.05 })
  gsap.from(['.eyebrow', '.hero-sub', '.hero-cta', '.hud'], { opacity: 0, y: 20, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.35 })
}

/* ---------- nav ---------- */
const nav = $('#nav')
let lastY = 0
window.addEventListener('scroll', () => {
  const y = window.scrollY
  nav.classList.toggle('scrolled', y > 40)
  nav.classList.toggle('hide', y > lastY && y > 500 && !document.body.classList.contains('menu-open'))
  lastY = y
}, { passive: true })
const burger = $('#burger'), links = $('#nav-links')
function closeMenu() { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open') }
burger.addEventListener('click', () => {
  const open = !links.classList.contains('open')
  links.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open)
})
;['about', 'work', 'research', 'stack', 'contact'].forEach((id) => {
  ScrollTrigger.create({
    trigger: `#${id}`, start: 'top 45%', end: 'bottom 45%',
    onToggle: (s) => { const a = links.querySelector(`a[href="#${id}"]`); a?.classList.toggle('active', s.isActive) },
  })
})

/* ---------- reveals & counters ---------- */
function reveals() {
  if (reduced) { $$('.reveal').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none' }); return }
  $$('.reveal').forEach((el) => {
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
  })
}
$$('[data-count]').forEach((el) => {
  const target = parseFloat(el.dataset.count!)
  const dec = parseInt(el.dataset.decimals || '0')
  const suf = el.dataset.suffix ?? ''
  const set = (v: number) => (el.textContent = v.toFixed(dec) + suf)
  if (reduced) { set(target); return }
  const o = { v: 0 }
  ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: target, duration: 1.6, ease: 'power2.out', onUpdate: () => set(o.v) }) })
})

/* ---------- timeline ---------- */
if (!reduced) {
  gsap.to('#tl-fill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#timeline', start: 'top 60%', end: 'bottom 60%', scrub: true } })
}
$$('.tl-item').forEach((el) => {
  if (reduced) { el.classList.add('on'); return }
  ScrollTrigger.create({ trigger: el, start: 'top 60%', onEnter: () => el.classList.add('on'), onLeaveBack: () => el.classList.remove('on') })
})

/* ---------- projects ---------- */
const grid = $('#projects')
function sparkline(p: Project) {
  if (p.id !== 'oilsense') return ''
  const v = OIL_RESULTS['Brent-1'].map((r) => r.mape)
  const max = 7
  const bars = v.map((m, i) => {
    const h = (m / max) * 70
    const lbl = ['LSTM', 'XGB', 'LGBM', 'Stack'][i]
    return `<rect x="${i * 44}" y="${76 - h}" width="30" height="${h}" rx="4" fill="${i === v.length - 1 ? 'url(#gb)' : '#273241'}"/><text x="${i * 44 + 15}" y="86" text-anchor="middle" fill="${i === v.length - 1 ? '#a3e635' : '#5d6876'}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="7">${lbl}</text>`
  }).join('')
  return `<svg class="p-spark" viewBox="0 0 170 100" aria-hidden="true"><defs><linearGradient id="gb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#a3e635"/><stop offset="1" stop-color="#38bdf8"/></linearGradient></defs>${bars}<text x="0" y="98" fill="#5d6876" font-family="JetBrains Mono, ui-monospace, monospace" font-size="7">Brent 1-day MAPE · lower is better</text></svg>`
}
grid.innerHTML = PROJECTS.map((p, i) => `
  <div class="p-item${i === 0 ? ' featured' : ''}" data-cats="${p.cats.join(' ')}" data-id="${p.id}">
  <button class="p-card" data-id="${p.id}" aria-label="Open case study: ${p.title}">
    <div class="p-top">
      <span class="mono">${p.index} · ${p.year}</span>
      <span class="p-cats">${p.cats.map((c) => `<span class="p-cat"><i class="sw" style="--c:${CAT_COLOR[c]}"></i>${CATEGORY_LABEL[c]}</span>`).join('')}</span>
    </div>
    ${i === 0 ? sparkline(p) : ''}
    <h3>${p.title}</h3>
    <p class="p-kicker">${p.kicker}</p>
    <p class="p-sum">${p.summary}</p>
    <div class="p-foot">
      <div class="p-stack">${p.stack.slice(0, 5).map((s) => `<span>${s}</span>`).join('')}</div>
      <span class="p-open" aria-hidden="true">→</span>
    </div>
  </button></div>`).join('')

$$('.p-card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${e.clientX - r.left}px`)
    card.style.setProperty('--my', `${e.clientY - r.top}px`)
  })
  card.addEventListener('click', () => openDrawer(card.dataset.id!))
})
if (!reduced) gsap.from('.p-item', { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '#projects', start: 'top 85%' } })

$('#filters').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest('.chip') as HTMLElement | null
  if (!b) return
  $$('#filters .chip').forEach((c) => { c.classList.toggle('active', c === b); c.setAttribute('aria-selected', String(c === b)) })
  const f = b.dataset.filter!
  $$('.p-item').forEach((c) => {
    const show = f === 'all' || c.dataset.cats!.split(' ').includes(f)
    c.classList.toggle('hidden', !show)
    c.classList.toggle('featured', f === 'all' && c.dataset.id === 'oilsense')
  })
  if (!reduced) gsap.fromTo('.p-item:not(.hidden)', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 })
  ScrollTrigger.refresh()
})

/* ---------- drawer ---------- */
const drawer = $('#drawer'), dContent = $('#drawer-content')
function oilChart() {
  return `
  <div class="d-sec"><h4>Model benchmark · test set</h4>
    <div class="chart-card" id="oil-chart">
      <div class="chart-controls">
        <div class="seg" data-k="target"><button class="on" data-v="Brent">Brent</button><button data-v="WTI">WTI</button></div>
        <div class="seg" data-k="h"><button class="on" data-v="1">1-day</button><button data-v="7">7-day</button></div>
      </div>
      <div class="bars" id="oil-bars"></div>
      <p class="chart-foot mono">MAPE, lower is better · R² shown on hover · stacked = LSTM + XGBoost + LightGBM → Ridge</p>
    </div>
  </div>`
}
function drawOil(target: string, h: string) {
  const rows = OIL_RESULTS[`${target}-${h}`]
  const max = Math.max(...rows.map((r) => r.mape)) * 1.08
  const best = Math.min(...rows.map((r) => r.mape))
  const el = $('#oil-bars')
  el.innerHTML = rows.map((r) => `
    <div class="bar-row${r.mape === best ? ' best' : ''}" title="R² ${r.r2.toFixed(3)} · MAE ${r.mae.toFixed(2)} USD">
      <span>${r.model}</span><div class="bar"><i data-w="${(r.mape / max) * 100}"></i></div><span class="v">${r.mape.toFixed(2)}%</span>
    </div>`).join('')
  requestAnimationFrame(() => requestAnimationFrame(() => el.querySelectorAll('i').forEach((i) => ((i as HTMLElement).style.width = `${(i as HTMLElement).dataset.w}%`))))
}
function powerBi(p: Project) {
  return `<div class="d-sec"><h4>Live report</h4>
    <div class="embed"><span class="embed-ph mono">loading Power BI…</span>
    <iframe title="HR Attrition Power BI report" src="${p.links[0].href}" loading="lazy" allowfullscreen></iframe></div></div>`
}
function openDrawer(id: string) {
  const p = PROJECTS.find((x) => x.id === id)!
  dContent.innerHTML = `
    <span class="mono dim">${p.index} · ${p.cats.map((c) => CATEGORY_LABEL[c]).join(' · ')} · ${p.year}</span>
    <h3 class="d-title" id="drawer-title">${p.title}</h3>
    <p class="d-kicker">${p.kicker}</p>
    <div class="d-sec"><h4>The problem</h4><p>${p.problem}</p></div>
    ${p.special === 'powerbi' ? powerBi(p) : ''}
    ${p.special === 'oil-chart' ? oilChart() : ''}
    <div class="d-sec"><h4>What I built</h4><ul>${p.built.map((b) => `<li>${b}</li>`).join('')}</ul></div>
    <div class="d-sec outcome"><h4>Outcome</h4><ul>${p.outcome.map((b) => `<li>${b}</li>`).join('')}</ul></div>
    <div class="d-sec"><h4>Stack</h4><div class="p-stack">${p.stack.map((s) => `<span>${s}</span>`).join('')}</div></div>
    ${p.links.length ? `<div class="d-links">${p.links.map((l, i) => `<a class="btn ${i === 0 ? 'btn-primary' : 'btn-ghost'} small" href="${l.href}" target="_blank" rel="noopener">${l.label} ↗</a>`).join('')}</div>` : ''}
    ${p.note ? `<p class="d-note">${p.note}</p>` : ''}`
  drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false')
  lenis?.stop()
  const panel = drawer.querySelector('.drawer-panel') as HTMLElement
  panel.scrollTop = 0
  ;(drawer.querySelector('.drawer-close') as HTMLElement).focus({ preventScroll: true })
  if (p.special === 'oil-chart') {
    const state = { target: 'Brent', h: '1' }
    drawOil(state.target, state.h)
    $('#oil-chart').addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('.seg button') as HTMLElement | null
      if (!b) return
      const seg = b.parentElement!
      seg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b))
      if (seg.dataset.k === 'target') state.target = b.dataset.v!; else state.h = b.dataset.v!
      drawOil(state.target, state.h)
    })
  }
  history.replaceState(null, '', `#project-${id}`)
}
function closeDrawer() {
  if (!drawer.classList.contains('open')) return
  drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true')
  lenis?.start()
  history.replaceState(null, '', location.pathname + location.search)
  setTimeout(() => { if (!drawer.classList.contains('open')) dContent.innerHTML = '' }, 500)
}
drawer.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('[data-close-drawer]')) closeDrawer() })
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer() })


/* ---------- stack ---------- */
try {
  const stack = createStack($('#stack-stage'), $<HTMLCanvasElement>('#stack-canvas'), $<HTMLUListElement>('#stack-list'))
  $('#stack-filters').addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('.chip') as HTMLElement | null
    if (!b) return
    $$('#stack-filters .chip').forEach((c) => c.classList.toggle('active', c === b))
    stack.setHighlight(b.dataset.group as 'all')
  })
} catch {
  $('#stack').classList.add('no-physics')
}

/* ---------- email copy ---------- */
const emailBtn = $('#email-btn'), emailState = $('#email-state')
emailBtn.addEventListener('click', async () => {
  const email = emailBtn.dataset.email!
  try { await navigator.clipboard.writeText(email); emailState.textContent = 'copied ✓' }
  catch { location.href = `mailto:${email}` }
  setTimeout(() => (emailState.textContent = 'copy'), 2000)
})

/* ---------- cursor ---------- */
const cursor = $('#cursor')
if (window.matchMedia('(hover: hover)').matches && !reduced) {
  const pos = { x: -100, y: -100 }
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' })
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' })
  window.addEventListener('pointermove', (e) => { pos.x = e.clientX; pos.y = e.clientY; xTo(pos.x); yTo(pos.y); cursor.classList.add('on') })
  document.addEventListener('pointerover', (e) => {
    cursor.classList.toggle('hover', !!(e.target as HTMLElement).closest('a, button, .p-card, input'))
  })
  document.addEventListener('pointerleave', () => cursor.classList.remove('on'))
}

/* ---------- boot ---------- */
initAsk()
reveals()
runLoader().then(() => {
  intro()
  ScrollTrigger.refresh()
  const m = location.hash.match(/^#project-(.+)$/)
  if (m && PROJECTS.some((p) => p.id === m[1])) openDrawer(m[1])
})
