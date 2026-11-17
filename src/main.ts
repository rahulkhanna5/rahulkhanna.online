import './styles.css'
import { leagueRows, renderContent } from './content'
import { $, initBall, initEmail, initNav } from './floor'

renderContent()
initNav(['about', 'journey', 'work', 'research', 'contact'])
initBall({ x: 0.66, y: 0.56, mx: 0.74, my: 0.27 })
initEmail()

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

// the hint has done its job once the reader has scrolled
const hint = $('#hint')
window.addEventListener('scroll', () => hint.classList.add('gone'), { passive: true, once: true })
