import * as THREE from 'three'

/**
 * Stylised 3D avatar of Rahul (memoji-style), built from primitives:
 * swept dark hair, full beard, curled moustache, suit + blue tie.
 * Head turns toward the cursor, eyes track it, blinks at random,
 * eyebrows lift on click.
 */
export function createAvatar(canvas: HTMLCanvasElement, reduced: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50)
  camera.position.set(0, -0.35, 8.2)
  camera.lookAt(0, -0.45, 0)

  // ---------- lights ----------
  scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x1a1410, 1.1))
  const key = new THREE.DirectionalLight(0xfff1e6, 2.4)
  key.position.set(2.5, 3, 4)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x38bdf8, 2.2)
  rim.position.set(-3.5, 1.5, -2.5)
  scene.add(rim)
  const rim2 = new THREE.DirectionalLight(0xa3e635, 0.45)
  rim2.position.set(3.5, -0.5, -2)
  scene.add(rim2)

  // ---------- materials ----------
  const skin = new THREE.MeshPhysicalMaterial({ color: 0xd9a27f, roughness: 0.5, sheen: 0.5, sheenColor: new THREE.Color(0xffc9a8), clearcoat: 0.15, clearcoatRoughness: 0.6 })
  const hair = new THREE.MeshStandardMaterial({ color: 0x1a1310, roughness: 0.72 })
  const beardMat = new THREE.MeshStandardMaterial({ color: 0x1d1512, roughness: 0.85 })
  const white = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, clearcoat: 1 })
  const iris = new THREE.MeshPhysicalMaterial({ color: 0x4a2a17, roughness: 0.25, clearcoat: 1 })
  const pupil = new THREE.MeshBasicMaterial({ color: 0x0a0605 })
  const lip = new THREE.MeshStandardMaterial({ color: 0xa8585a, roughness: 0.45 })
  const suit = new THREE.MeshPhysicalMaterial({ color: 0x151a22, roughness: 0.6, sheen: 0.4, sheenColor: new THREE.Color(0x3a4658) })
  const shirt = new THREE.MeshStandardMaterial({ color: 0xf4f6f8, roughness: 0.55 })
  const tie = new THREE.MeshPhysicalMaterial({ color: 0x1f3fb0, roughness: 0.35, clearcoat: 0.6 })

  const avatar = new THREE.Group()
  scene.add(avatar)
  const head = new THREE.Group()
  head.position.y = 0.15
  avatar.add(head)

  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, p: [number, number, number], s: [number, number, number] = [1, 1, 1], r: [number, number, number] = [0, 0, 0]) => {
    const o = new THREE.Mesh(g, m)
    o.position.set(...p); o.scale.set(...s); o.rotation.set(...r)
    return o
  }
  const S = (r: number, w = 48, h = 32) => new THREE.SphereGeometry(r, w, h)

  // ---------- head ----------
  head.add(mesh(S(1), skin, [0, 0, 0], [0.9, 1.08, 0.94]))
  // ears
  for (const sx of [-1, 1]) head.add(mesh(S(0.2, 24, 16), skin, [sx * 0.9, 0.02, -0.05], [0.42, 1, 0.7]))
  // nose
  head.add(mesh(S(0.11, 32, 24), skin, [0, -0.06, 0.95], [0.78, 1.2, 0.9]))
  for (const sx of [-1, 1]) head.add(mesh(S(0.058, 20, 16), skin, [sx * 0.075, -0.15, 0.91]))

  // ---------- hair ----------
  const cap = mesh(new THREE.SphereGeometry(1.0, 48, 32, 0, Math.PI * 2, 0, 1.45), hair, [0, 0.06, -0.06], [0.95, 1.08, 1.0], [-0.42, 0, 0])
  head.add(cap)
  // side-swept front volume (quiff)
  head.add(mesh(S(0.5, 40, 24), hair, [0.08, 0.86, 0.42], [1.55, 0.55, 0.9], [-0.25, 0, -0.12]))
  head.add(mesh(S(0.4, 32, 20), hair, [-0.42, 0.74, 0.38], [1.1, 0.6, 0.9], [-0.2, 0, 0.35]))
  head.add(mesh(S(0.5, 40, 24), hair, [0, 0.9, 0.12], [1.62, 0.6, 1.5]))
  // short sides
  for (const sx of [-1, 1]) head.add(mesh(S(0.34, 24, 16), hair, [sx * 0.8, 0.3, -0.18], [0.35, 0.85, 0.95]))

  // ---------- eyebrows ----------
  const brows: THREE.Mesh[] = []
  for (const sx of [-1, 1]) {
    const b = mesh(new THREE.CapsuleGeometry(0.05, 0.24, 6, 12), hair, [sx * 0.31, 0.34, 0.86], [1, 1, 0.7], [0, sx * 0.25, Math.PI / 2 + sx * 0.06])
    brows.push(b); head.add(b)
  }

  // ---------- eyes ----------
  const eyes: THREE.Group[] = []
  const lids: THREE.Mesh[] = []
  for (const sx of [-1, 1]) {
    const socket = new THREE.Group()
    socket.position.set(sx * 0.31, 0.12, 0.74)
    head.add(socket)
    const eye = new THREE.Group()
    socket.add(eye)
    eye.add(mesh(S(0.165, 32, 24), white, [0, 0, 0]))
    eye.add(mesh(S(0.098, 32, 24), iris, [0, 0, 0.128], [1, 1, 0.42]))
    eye.add(mesh(S(0.05, 24, 16), pupil, [0, 0, 0.158], [1, 1, 0.35]))
    eye.add(mesh(S(0.022, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }), [0.035, 0.04, 0.17]))
    eyes.push(eye)
    const lid = mesh(new THREE.SphereGeometry(0.178, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), skin, [0, 0, 0])
    lid.rotation.x = -0.55
    socket.add(lid)
    lids.push(lid)
    // soft lower lid
    socket.add(mesh(new THREE.SphereGeometry(0.176, 32, 16, 0, Math.PI * 2, Math.PI * 0.62, Math.PI * 0.38), skin, [0, 0, 0], [1, 1, 1], [0.35, 0, 0]))
  }

  // ---------- beard ----------
  const beard = mesh(new THREE.SphereGeometry(1.0, 48, 32, Math.PI / 2 - 1.5, 3.0, 2.02, Math.PI - 2.02), beardMat, [0, 0.02, 0.02], [0.935, 1.1, 0.985])
  head.add(beard)
  head.add(mesh(S(0.5, 40, 24), beardMat, [0, -0.86, 0.36], [1.05, 0.62, 0.9]))
  for (const sx of [-1, 1]) {
    head.add(mesh(S(0.3, 24, 16), beardMat, [sx * 0.8, -0.18, 0.12], [0.42, 0.95, 0.75]))      // sideburn
    head.add(mesh(S(0.36, 32, 20), beardMat, [sx * 0.55, -0.55, 0.38], [0.85, 0.9, 0.85]))      // jaw
  }
  head.add(mesh(S(0.5, 40, 24), beardMat, [0, -0.66, 0.6], [0.95, 0.42, 0.62]))                // around the mouth

  // mouth + lips (sit in front of the beard)
  head.add(mesh(new THREE.TorusGeometry(0.12, 0.032, 12, 32, Math.PI * 0.7), lip, [0, -0.44, 0.9], [1, 0.75, 0.8], [0, 0, Math.PI + Math.PI * 0.15]))

  // handlebar moustache
  for (const sx of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sx * 0.02, -0.33, 0.99),
      new THREE.Vector3(sx * 0.17, -0.35, 0.97),
      new THREE.Vector3(sx * 0.33, -0.43, 0.88),
      new THREE.Vector3(sx * 0.44, -0.5, 0.76),
      new THREE.Vector3(sx * 0.5, -0.44, 0.7),
      new THREE.Vector3(sx * 0.47, -0.37, 0.7),
    ])
    head.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.058, 12, false), beardMat))
    head.add(mesh(S(0.058, 16, 12), beardMat, [sx * 0.47, -0.37, 0.7]))
  }
  head.add(mesh(S(0.08, 20, 14), beardMat, [0, -0.33, 0.98], [1.3, 0.8, 0.7]))

  // ---------- neck, suit, shirt, tie ----------
  avatar.add(mesh(new THREE.CylinderGeometry(0.38, 0.44, 0.6, 32), skin, [0, -1.0, -0.05]))
  avatar.add(mesh(S(1, 48, 32), suit, [0, -2.35, -0.1], [1.75, 0.95, 0.9]))
  avatar.add(mesh(new THREE.ConeGeometry(0.42, 0.9, 3), shirt, [0, -1.6, 0.66], [1, 1, 0.2], [0, 0, Math.PI]))
  avatar.add(mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.22, 32, 1, true), shirt, [0, -1.42, -0.04]))
  avatar.add(mesh(S(0.085, 20, 14), tie, [0, -1.46, 0.72], [1.1, 0.9, 0.7]))
  avatar.add(mesh(new THREE.ConeGeometry(0.12, 0.75, 4), tie, [0, -1.92, 0.78], [1, 1, 0.35], [Math.PI, Math.PI / 4, 0]))

  // ---------- interaction ----------
  const target = new THREE.Vector2(0, 0)
  const smooth = new THREE.Vector2(0, 0)
  window.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect()
    const cx = r.left + r.width / 2, cy = r.top + r.height * 0.4
    target.set(THREE.MathUtils.clamp((e.clientX - cx) / (window.innerWidth * 0.5), -1, 1), THREE.MathUtils.clamp((e.clientY - cy) / (window.innerHeight * 0.5), -1, 1))
  }, { passive: true })

  let browLift = 0
  canvas.closest('section')?.addEventListener('pointerdown', () => { browLift = 1 })

  let nextBlink = 1.5, blinkT = -1
  const clock = new THREE.Clock()
  const look = new THREE.Vector3()
  let visible = false, raf = 0

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  function frame() {
    raf = requestAnimationFrame(frame)
    if (!visible) return
    const dt = Math.min(clock.getDelta(), 0.05)
    const t = clock.elapsedTime
    smooth.lerp(target, reduced ? 1 : 1 - Math.pow(0.001, dt))

    head.rotation.y = smooth.x * 0.45
    head.rotation.x = smooth.y * 0.22 + (reduced ? 0 : Math.sin(t * 1.3) * 0.015)
    head.rotation.z = -smooth.x * 0.05
    avatar.position.y = reduced ? 0 : Math.sin(t * 1.6) * 0.02
    avatar.rotation.y = smooth.x * 0.12

    // eyes look at a point in front of the face that follows the cursor
    for (const eye of eyes) {
      look.set(smooth.x * 0.9, -smooth.y * 0.6, 3)
      eye.lookAt(eye.parent!.localToWorld(look))
    }

    // blink
    if (!reduced) {
      nextBlink -= dt
      if (nextBlink <= 0 && blinkT < 0) { blinkT = 0; nextBlink = 2.5 + Math.random() * 3 }
    }
    let lidA = -0.55
    if (blinkT >= 0) {
      blinkT += dt
      const k = blinkT / 0.16
      const c = k < 0.5 ? k * 2 : 2 - k * 2
      lidA = -0.55 + (1.45 + 0.55) * Math.max(0, c)
      if (k >= 1) blinkT = -1
    }
    lidA -= browLift * 0.2
    for (const l of lids) l.rotation.x = lidA

    browLift = Math.max(0, browLift - dt * 1.6)
    brows.forEach((b) => (b.position.y = 0.33 + browLift * 0.07 + Math.max(0, -smooth.y) * 0.03))

    renderer.render(scene, camera)
  }
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { clock.getDelta(); resize() } })
  io.observe(canvas)
  frame()

  return { dispose() { cancelAnimationFrame(raf); io.disconnect(); renderer.dispose() } }
}
