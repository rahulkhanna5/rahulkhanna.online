import './styles.css'
import { leagueRows, renderContent } from './content'

// Add ?reduced to the URL in dev to preview the reduced-motion version.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || (import.meta.env.DEV && new URLSearchParams(location.search).has('reduced'))
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector(s) as T

document.documentElement.classList.toggle('reduced', reduced)
renderContent()

/* ---------- nav ---------- */
const nav = $('#nav'), links = $('#nav-links'), menuBtn = $('#menu-btn')
function setMenu(open: boolean) {
  links.classList.toggle('open', open)
  menuBtn.setAttribute('aria-expanded', String(open))
  menuBtn.textContent = open ? 'Close' : 'Menu'
}
menuBtn.addEventListener('click', () => setMenu(!links.classList.contains('open')))
links.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMenu(false) })
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false) })

// mark the section being read
const sections = ['about', 'journey', 'work', 'research', 'contact']
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue
      links.querySelectorAll('a').forEach((a) => {
        if (a.getAttribute('href') === `#${en.target.id}`) a.setAttribute('aria-current', 'true')
        else a.removeAttribute('aria-current')
      })
    }
  }, { rootMargin: '-45% 0px -50% 0px' })
  sections.forEach((id) => io.observe($(`#${id}`)))
}

/* ---------- league table ---------- */
const league = $('#league'), leagueBody = $('#league-rows')
const pick = { target: 'Brent', h: '1' }
league.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest('.seg button') as HTMLButtonElement | null
  if (!b) return
  pick[b.dataset.k as 'target' | 'h'] = b.dataset.v!
  b.parentElement!.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
  leagueBody.innerHTML = leagueRows(pick.target, pick.h)
})

/* ---------- open a project linked by its address ---------- */
function openFromHash() {
  const el = location.hash.startsWith('#project-') ? document.querySelector(location.hash) : null
  if (el instanceof HTMLDetailsElement) el.open = true
}
window.addEventListener('hashchange', openFromHash)
openFromHash()

/* ---------- email copy ---------- */
const emailBtn = $('#email-btn'), emailState = $('#email-state')
emailBtn.addEventListener('click', async () => {
  const email = emailBtn.dataset.email!
  try { await navigator.clipboard.writeText(email); emailState.textContent = 'Copied' }
  catch { location.href = `mailto:${email}` }
  setTimeout(() => (emailState.textContent = 'Copy'), 2000)
})

/* ---------- the ball ----------
   It lies on the floor, so when the page scrolls it goes with the floor. The
   edges of the window push it along, which is how scrolling dribbles it down
   the page. The pointer kicks it. Positions are in window coordinates;
   velocities are relative to the floor, in pixels per second. */
const ball = $('#ball'), skin = $('#ball-skin')
if (reduced) {
  ball.classList.add('still')
} else {
  let r = ball.offsetWidth / 2
  let x = innerWidth * (innerWidth < 720 ? 0.74 : 0.66), y = innerHeight * (innerWidth < 720 ? 0.27 : 0.56)
  let vx = 0, vy = 0, spin = 0
  let lastScroll = scrollY, last = 0, kickedAt = 0, running = false
  const ptr = { x: -1e4, y: -1e4, vx: 0, vy: 0, t: 0 }
  const MAX = 2800

  const draw = () => {
    ball.style.transform = `translate3d(${(x - r).toFixed(1)}px, ${(y - r).toFixed(1)}px, 0)`
    skin.style.transform = `rotate(${spin.toFixed(1)}deg)`
  }
  const wake = () => { if (!running) { running = true; last = 0; requestAnimationFrame(step) } }

  function step(now: number) {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
    last = now
    const moved = scrollY - lastScroll
    lastScroll = scrollY
    const edge = moved / dt // how fast the window edges are sweeping over the floor

    y -= moved
    x += vx * dt
    y += vy * dt
    const slow = Math.exp(-dt * 1.5) // rolling resistance
    vx *= slow; vy *= slow

    const top = nav.offsetHeight + r, bottom = innerHeight - r
    if (y < top) { y = top; vy = edge > 0 ? Math.max(vy, edge * 1.25) : Math.abs(vy) * 0.6 }
    if (y > bottom) { y = bottom; vy = edge < 0 ? Math.min(vy, edge * 1.25) : -Math.abs(vy) * 0.6 }
    if (x < r) { x = r; vx = Math.abs(vx) * 0.7 }
    if (x > innerWidth - r) { x = innerWidth - r; vx = -Math.abs(vx) * 0.7 }

    // a moving pointer that reaches the ball kicks it
    const dx = x - ptr.x, dy = y - ptr.y, dist = Math.hypot(dx, dy)
    const speed = Math.hypot(ptr.vx, ptr.vy)
    if (dist < r + 12 && speed > 60 && now - kickedAt > 140 && now - ptr.t < 120) {
      vx += ptr.vx * 0.9 + (dx / (dist || 1)) * 160
      vy += ptr.vy * 0.9 + (dy / (dist || 1)) * 160
      kickedAt = now
    }
    const v = Math.hypot(vx, vy)
    if (v > MAX) { vx *= MAX / v; vy *= MAX / v }
    spin += ((vx + vy * 0.35) * dt / r) * 57.3
    draw()

    if (v < 3 && moved === 0) { vx = vy = 0; running = false } // at rest: stop until something happens
    else requestAnimationFrame(step)
  }

  window.addEventListener('scroll', wake, { passive: true })
  window.addEventListener('pointermove', (e) => {
    const now = performance.now(), dt = Math.max(8, now - ptr.t) / 1000
    ptr.vx = (e.clientX - ptr.x) / dt; ptr.vy = (e.clientY - ptr.y) / dt
    ptr.x = e.clientX; ptr.y = e.clientY; ptr.t = now
    if (Math.hypot(x - ptr.x, y - ptr.y) < r + 40) wake()
  }, { passive: true })
  // a tap or click next to the ball knocks it away from the finger
  window.addEventListener('pointerdown', (e) => {
    const dx = x - e.clientX, dy = y - e.clientY, dist = Math.hypot(dx, dy)
    if (dist > r + 26) return
    vx += (dx / (dist || 1)) * 900; vy += (dy / (dist || 1)) * 900
    wake()
  }, { passive: true })
  window.addEventListener('resize', () => {
    r = ball.offsetWidth / 2
    x = Math.min(innerWidth - r, Math.max(r, x)); y = Math.min(innerHeight - r, Math.max(nav.offsetHeight + r, y))
    draw()
  })
  draw()
  ball.classList.add('live')

  // Dev only: read or set the ball's state from the console.
  if (import.meta.env.DEV) {
    (window as unknown as { __ball: unknown }).__ball = {
      get: () => ({ x: Math.round(x), y: Math.round(y), vx: Math.round(vx), vy: Math.round(vy), running }),
      kick: (kx: number, ky: number) => { vx += kx; vy += ky; wake() },
    }
  }
}

// the hint has done its job once the reader has scrolled
const hint = $('#hint')
window.addEventListener('scroll', () => hint.classList.add('gone'), { passive: true, once: true })
