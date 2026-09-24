import Matter from 'matter-js'

type Group = 'de' | 'bi' | 'ml' | 'apps'
interface Tool { name: string; group: Group; w: number }

export const TOOLS: Tool[] = [
  { name: 'Python', group: 'de', w: 3 },
  { name: 'SQL', group: 'de', w: 3 },
  { name: 'PostgreSQL', group: 'de', w: 2.4 },
  { name: 'MySQL', group: 'de', w: 1.6 },
  { name: 'Supabase', group: 'de', w: 1.7 },
  { name: 'REST APIs', group: 'de', w: 2 },
  { name: 'Selenium', group: 'de', w: 1.4 },
  { name: 'BeautifulSoup', group: 'de', w: 1.5 },
  { name: 'Git', group: 'de', w: 1.3 },
  { name: 'Power BI', group: 'bi', w: 2.6 },
  { name: 'DAX', group: 'bi', w: 1.6 },
  { name: 'Tableau', group: 'bi', w: 2 },
  { name: 'Excel', group: 'bi', w: 2 },
  { name: 'Pandas', group: 'bi', w: 2.4 },
  { name: 'NumPy', group: 'bi', w: 1.5 },
  { name: 'Seaborn', group: 'bi', w: 1.3 },
  { name: 'scikit-learn', group: 'ml', w: 2.2 },
  { name: 'XGBoost', group: 'ml', w: 1.7 },
  { name: 'LightGBM', group: 'ml', w: 1.6 },
  { name: 'TensorFlow', group: 'ml', w: 1.7 },
  { name: 'Jupyter', group: 'ml', w: 1.4 },
  { name: 'LangChain', group: 'ml', w: 1.4 },
]

const COLORS: Record<Group, string> = { de: '#38bdf8', bi: '#fbbf24', ml: '#a3e635', apps: '#c084fc' }

export function createStack(stage: HTMLElement, canvas: HTMLCanvasElement, list: HTMLUListElement) {
  // accessible / fallback list
  list.innerHTML = TOOLS.map((t) => `<li style="border-color:${COLORS[t.group]}55">${t.name}</li>`).join('')

  const { Engine, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter
  const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0012 } })
  const ctx = canvas.getContext('2d')!
  let W = 0, H = 0, dpr = 1
  let walls: Matter.Body[] = []
  let highlight: Group | 'all' = 'all'
  const bodies: { b: Matter.Body; t: Tool; r: number; a: number }[] = []

  function scaleR() {
    const base = Math.min(W, 1200)
    return base < 600 ? 13 : base < 900 ? 17 : 21
  }

  function buildWalls() {
    Composite.remove(engine.world, walls)
    const th = 200
    walls = [
      Bodies.rectangle(W / 2, H + th / 2, W * 3, th, { isStatic: true }),
      Bodies.rectangle(-th / 2, H / 2, th, H * 4, { isStatic: true }),
      Bodies.rectangle(W + th / 2, H / 2, th, H * 4, { isStatic: true }),
    ]
    Composite.add(engine.world, walls)
  }

  function resize() {
    const rect = stage.getBoundingClientRect()
    W = rect.width; H = rect.height
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = W * dpr; canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    buildWalls()
  }
  resize()

  let dropped = false
  function drop() {
    if (dropped) return
    dropped = true
    const k = scaleR()
    TOOLS.forEach((t, i) => {
      const r = k * (1.2 + t.w * 0.9)
      const x = r + Math.random() * (W - 2 * r)
      const b = Bodies.circle(x, -200 - i * 55, r, { restitution: 0.55, friction: 0.05, frictionAir: 0.012, density: 0.0014 })
      bodies.push({ b, t, r, a: 1 })
      setTimeout(() => Composite.add(engine.world, b), i * 60)
    })
  }

  const mouse = Mouse.create(canvas)
  // let the page scroll normally over the canvas
  const m = mouse as unknown as { element: HTMLElement; mousewheel: EventListener; mousemove: EventListener; mousedown: EventListener; mouseup: EventListener }
  m.element.removeEventListener('wheel', m.mousewheel)
  m.element.removeEventListener('mousewheel', m.mousewheel)
  m.element.removeEventListener('DOMMouseScroll', m.mousewheel)
  // on touch screens, keep page scrolling instead of dragging bubbles
  m.element.removeEventListener('touchmove', m.mousemove)
  m.element.removeEventListener('touchstart', m.mousedown)
  m.element.removeEventListener('touchend', m.mouseup)
  const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } })
  Composite.add(engine.world, mc)
  mouse.pixelRatio = 1

  let hover: Matter.Body | null = null
  Events.on(mc, 'mousemove', () => {
    const p = mouse.position
    hover = null
    for (const o of bodies) if (Matter.Vector.magnitude(Matter.Vector.sub(o.b.position, p)) < o.r) hover = o.b
    canvas.style.cursor = hover ? 'grab' : 'default'
  })

  // nudge bubbles when a filter is picked
  function setHighlight(g: Group | 'all') {
    highlight = g
    for (const o of bodies) {
      if (g !== 'all' && o.t.group === g) Body.applyForce(o.b, o.b.position, { x: (Math.random() - 0.5) * 0.02, y: -0.06 * o.b.mass })
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H)
    for (const o of bodies) {
      const target = highlight === 'all' || o.t.group === highlight ? 1 : 0.18
      o.a += (target - o.a) * 0.12
      const { x, y } = o.b.position
      const c = COLORS[o.t.group]
      ctx.globalAlpha = o.a
      const g = ctx.createRadialGradient(x - o.r * 0.35, y - o.r * 0.4, o.r * 0.1, x, y, o.r)
      g.addColorStop(0, '#1b2430')
      g.addColorStop(1, '#0d1219')
      ctx.beginPath(); ctx.arc(x, y, o.r, 0, Math.PI * 2)
      ctx.fillStyle = g; ctx.fill()
      ctx.lineWidth = o.b === hover ? 2 : 1.2
      ctx.strokeStyle = c; ctx.stroke()
      ctx.fillStyle = '#e6edf3'
      const fs = Math.max(11, Math.min(o.r * 0.36, 17))
      ctx.font = `500 ${fs}px Inter, system-ui, sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(o.t.name, x, y, o.r * 1.75)
    }
    ctx.globalAlpha = 1
  }

  let raf = 0, visible = false, last = performance.now()
  function loop(now: number) {
    raf = requestAnimationFrame(loop)
    if (!visible) { last = now; return }
    const dt = Math.min(now - last, 32); last = now
    Engine.update(engine, dt)
    draw()
  }
  raf = requestAnimationFrame(loop)

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible && e.intersectionRatio > 0.25) drop()
  }, { threshold: [0, 0.25, 0.5] })
  io.observe(stage)

  let rt = 0
  window.addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(resize, 150) })

  return { setHighlight, dispose() { cancelAnimationFrame(raf); io.disconnect() } }
}
