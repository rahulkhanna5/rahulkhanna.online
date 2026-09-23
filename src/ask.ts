import { KB, type KBEntry } from './data'

/**
 * "Ask my portfolio": a tiny retrieval engine that runs in the browser.
 * TF-IDF vectors over the knowledge base + cosine similarity.
 * No external AI service is called.
 */
const STOP = new Set('a an the is are was were be to of and or in on for with what which who how does do did you your his he him about at by from as it its this that i me my can tell show any has have use used'.split(' '))
const SYN: Record<string, string> = {
  powerbi: 'power', dashboards: 'dashboard', pipelines: 'pipeline', models: 'model', projects: 'project',
  patents: 'patent', papers: 'paper', skills: 'skill', tools: 'skill', tech: 'skill', stack: 'skill',
  certificates: 'certification', certifications: 'certification', ml: 'machine', ai: 'machine',
  job: 'role', jobs: 'role', roles: 'role', hire: 'role', college: 'education', university: 'education',
  degree: 'education', mail: 'email', reach: 'contact', forecast: 'forecasting', predict: 'prediction',
  oil: 'oilsense', crude: 'oilsense', scrape: 'scraping', scraped: 'scraping', etl: 'pipeline',
}

function tokens(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9.+# ]/g, ' ').split(/\s+/)
    .map((w) => w.replace(/\.$/, ''))
    .filter((w) => w && !STOP.has(w))
    .map((w) => SYN[w] ?? (w.length > 4 && w.endsWith('s') ? w.slice(0, -1) : w))
}

const docs = KB.map((e) => {
  const toks = [...tokens(e.title), ...tokens(e.title), ...tokens(e.tags), ...tokens(e.tags), ...tokens(e.text)]
  const tf = new Map<string, number>()
  toks.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1))
  return { e, tf, len: toks.length }
})
const df = new Map<string, number>()
docs.forEach((d) => d.tf.forEach((_, t) => df.set(t, (df.get(t) ?? 0) + 1)))
const idf = (t: string) => Math.log((docs.length + 1) / ((df.get(t) ?? 0) + 1)) + 1
const vecs = docs.map((d) => {
  const v = new Map<string, number>()
  let n = 0
  d.tf.forEach((c, t) => { const w = (c / d.len) * idf(t); v.set(t, w); n += w * w })
  return { v, n: Math.sqrt(n) }
})

export function search(q: string): { entry: KBEntry; score: number }[] {
  const qt = tokens(q)
  if (!qt.length) return []
  const qv = new Map<string, number>()
  qt.forEach((t) => qv.set(t, (qv.get(t) ?? 0) + idf(t)))
  let qn = 0; qv.forEach((w) => (qn += w * w)); qn = Math.sqrt(qn)
  return vecs
    .map((d, i) => {
      let dot = 0
      qv.forEach((w, t) => { const dw = d.v.get(t); if (dw) dot += w * dw })
      return { entry: docs[i].e, score: dot / (qn * d.n || 1) }
    })
    .filter((r) => r.score > 0.02)
    .sort((a, b) => b.score - a.score)
}

const SUGGEST = ['What does Rahul do?', 'Show me a Power BI project', 'How accurate is OilSense?', 'Tell me about the patents', 'Which roles is he open to?', 'How do I contact him?']

export function initAsk() {
  const panel = document.getElementById('ask')!
  const log = document.getElementById('ask-log')!
  const sugg = document.getElementById('ask-suggest')!
  const fab = document.querySelector('.ask-fab') as HTMLElement
  let greeted = false

  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
  function add(html: string, who: 'me' | 'bot') {
    const d = document.createElement('div')
    d.className = `msg ${who}`
    d.innerHTML = html
    log.appendChild(d)
    log.scrollTop = log.scrollHeight
  }
  function renderSuggest(list: string[]) {
    sugg.innerHTML = list.map((s) => `<button type="button">${esc(s)}</button>`).join('')
  }

  function answer(q: string) {
    add(esc(q), 'me')
    const res = search(q)
    setTimeout(() => {
      if (!res.length) {
        add(`<b>I couldn't find that one.</b>Try asking about projects, skills, patents, education or how to get in touch. Or email <a href="mailto:rahulkhanna6593@gmail.com">rahulkhanna6593@gmail.com</a>.`, 'bot')
        renderSuggest(SUGGEST.slice(0, 4))
        return
      }
      const top = res[0]
      add(`<b>${esc(top.entry.title)}<span class="score">match ${(top.score * 100).toFixed(0)}%</span></b>${esc(top.entry.text)}${top.entry.href ? `<br><a href="${top.entry.href}" data-jump>Go to section →</a>` : ''}`, 'bot')
      const related = res.slice(1, 4).map((r) => r.entry.title)
      renderSuggest(related.length ? related : SUGGEST.slice(0, 4))
    }, 260)
  }

  function open() {
    panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); fab.classList.add('away')
    if (!greeted) {
      greeted = true
      add(`<b>Hi, I'm Rahul's portfolio.</b>Ask me about his projects, skills, research or how to reach him. I match your question against his portfolio data right here in your browser.`, 'bot')
      renderSuggest(SUGGEST)
    }
  }
  function close() { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); fab.classList.remove('away') }

  document.querySelectorAll('[data-open-ask]').forEach((b) => b.addEventListener('click', open))
  document.getElementById('ask-close')!.addEventListener('click', close)
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close() })
  sugg.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button'); if (b) answer(b.textContent || '')
  })
  log.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a[data-jump]') as HTMLAnchorElement | null
    if (a && window.innerWidth < 820) close()
  })
}
