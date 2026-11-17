/** What every page of the hall shares: the reduced-motion switch, the nav and its
 *  mobile menu, and the ball. */

export const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector(s) as T

// Add ?reduced to the URL in dev to preview the reduced-motion version.
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || (import.meta.env.DEV && new URLSearchParams(location.search).has('reduced'))
document.documentElement.classList.toggle('reduced', reduced)

/** The nav: mobile menu, plus marking which of `sections` is being read. */
export function initNav(sections: string[] = []) {
  const links = $('#nav-links'), menuBtn = $('#menu-btn')
  function setMenu(open: boolean) {
    links.classList.toggle('open', open)
    menuBtn.setAttribute('aria-expanded', String(open))
    menuBtn.textContent = open ? 'Close' : 'Menu'
  }
  menuBtn.addEventListener('click', () => setMenu(!links.classList.contains('open')))
  links.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMenu(false) })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false) })

  if (!sections.length || !('IntersectionObserver' in window)) return
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

/* ---------- the ball ----------
   It lies on the floor, so when the page scrolls it goes with the floor. The
   edges of the window push it along, which is how scrolling dribbles it down
   the page. The pointer kicks it. Positions are in window coordinates;
   velocities are relative to the floor, in pixels per second. */
export function initBall(start: { x: number; y: number; mx: number; my: number }) {
  const nav = $('#nav'), ball = $('#ball'), skin = $('#ball-skin')
  if (reduced) { ball.classList.add('still'); return }

  let r = ball.offsetWidth / 2
  const narrow = innerWidth < 720
  let x = innerWidth * (narrow ? start.mx : start.x), y = innerHeight * (narrow ? start.my : start.y)
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
