import * as THREE from 'three'

/**
 * Hero scene: points begin as random noise, settle into k-means style clusters,
 * then spread into a moving "loss surface" that ripples under the cursor.
 */
export interface HeroApi {
  start(): void
  setScroll(p: number): void
  dispose(): void
}

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uM1;       // noise -> clusters
  uniform float uM2;       // clusters -> surface
  uniform vec2  uMouse;    // surface-space mouse (x,z)
  uniform float uMouseOn;
  uniform float uPixel;
  attribute vec3 aNoise;
  attribute vec3 aCluster;
  attribute vec3 aGrid;
  attribute float aGroup;
  attribute float aRand;
  varying vec3 vColor;
  varying float vAlpha;

  vec3 groupColor(float g) {
    if (g < 0.5) return vec3(0.22, 0.74, 0.97);   // sky
    if (g < 1.5) return vec3(0.64, 0.90, 0.21);   // lime
    if (g < 2.5) return vec3(0.98, 0.75, 0.14);   // amber
    return vec3(0.75, 0.52, 0.99);                // violet
  }

  void main() {
    vec3 p = mix(aNoise, aCluster, smoothstep(0.0, 1.0, uM1));

    // surface: layered waves, like a slowly shifting loss landscape
    vec3 g = aGrid;
    float t = uTime * 0.35;
    float h = sin(g.x * 0.55 + t) * 0.55
            + cos(g.z * 0.45 - t * 1.3) * 0.45
            + sin((g.x + g.z) * 0.9 + t * 0.7) * 0.18;
    float d = distance(g.xz, uMouse);
    float ripple = uMouseOn * exp(-d * d * 0.35) * (0.9 + 0.25 * sin(d * 5.0 - uTime * 4.0));
    g.y = h + ripple;

    float m2 = smoothstep(0.0, 1.0, clamp(uM2 * 1.25 - aRand * 0.25, 0.0, 1.0));
    p = mix(p, g, m2);

    // gentle breathing while in noise / cluster states
    p += (1.0 - m2) * vec3(sin(uTime + aRand * 6.28), cos(uTime * 0.8 + aRand * 6.28), 0.0) * 0.04;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = mix(2.2, 1.7, m2) + aRand * 1.2 + ripple * 2.0;
    gl_PointSize = size * uPixel * (20.0 / -mv.z);

    vec3 surf = mix(vec3(0.16, 0.45, 0.62), vec3(0.55, 0.88, 1.0), clamp((g.y + 1.0) * 0.5, 0.0, 1.0));
    surf = mix(surf, vec3(0.64, 0.90, 0.21), clamp(ripple, 0.0, 1.0));
    vec3 base = mix(vec3(0.45, 0.52, 0.6), groupColor(aGroup), smoothstep(0.2, 1.0, uM1));
    vColor = mix(base, surf, m2);
    vAlpha = mix(0.9, 0.8, m2) * smoothstep(-30.0, -5.0, mv.z);
  }
`

const frag = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.1, r) * vAlpha;
    gl_FragColor = vec4(vColor, a);
  }
`

function gauss() {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function createHero(
  canvas: HTMLCanvasElement,
  onStage: (s: string) => void,
  onCursor: (x: number, y: number) => void,
  reduced: boolean,
): HeroApi {
  const mobile = window.matchMedia('(max-width: 820px)').matches
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' })
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  renderer.setPixelRatio(dpr)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)

  const side = mobile ? 64 : 104
  const N = side * side
  const aNoise = new Float32Array(N * 3)
  const aCluster = new Float32Array(N * 3)
  const aGrid = new Float32Array(N * 3)
  const aGroup = new Float32Array(N)
  const aRand = new Float32Array(N)
  const ox = mobile ? 0 : 2.6
  const centers = [
    [-2.4 + ox, 1.3, 0.5],
    [2.6 + ox, 1.7, -0.8],
    [-0.6 + ox, -1.6, -0.6],
    [3.4 + ox, -1.2, 0.9],
  ]
  const W = 22, D = 14
  for (let i = 0; i < N; i++) {
    // noise: uniform in a flattened ball
    const r = 7 * Math.cbrt(Math.random())
    const th = Math.random() * Math.PI * 2
    const ph = Math.acos(2 * Math.random() - 1)
    aNoise[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.3 + ox * 0.6
    aNoise[i * 3 + 1] = r * Math.cos(ph) * 0.7
    aNoise[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th)
    // clusters
    const gi = i % 4
    const s = [0.75, 0.6, 0.7, 0.55][gi]
    aCluster[i * 3] = centers[gi][0] + gauss() * s
    aCluster[i * 3 + 1] = centers[gi][1] + gauss() * s
    aCluster[i * 3 + 2] = centers[gi][2] + gauss() * s
    aGroup[i] = gi
    // grid
    const gx = i % side, gz = Math.floor(i / side)
    aGrid[i * 3] = (gx / (side - 1) - 0.5) * W
    aGrid[i * 3 + 1] = 0
    aGrid[i * 3 + 2] = (gz / (side - 1) - 0.5) * D
    aRand[i] = Math.random()
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(aGrid.slice(), 3))
  geo.setAttribute('aNoise', new THREE.BufferAttribute(aNoise, 3))
  geo.setAttribute('aCluster', new THREE.BufferAttribute(aCluster, 3))
  geo.setAttribute('aGrid', new THREE.BufferAttribute(aGrid, 3))
  geo.setAttribute('aGroup', new THREE.BufferAttribute(aGroup, 1))
  geo.setAttribute('aRand', new THREE.BufferAttribute(aRand, 1))

  const uniforms = {
    uTime: { value: 0 },
    uM1: { value: reduced ? 1 : 0 },
    uM2: { value: reduced ? 1 : 0 },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uMouseOn: { value: 0 },
    uPixel: { value: dpr },
  }
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  scene.add(points)

  // camera path: front view for clusters -> tilted view for surface
  const camFront = new THREE.Vector3(0, 0, 13)
  const camSurf = new THREE.Vector3(0, 6.2, 10.5)
  const look = new THREE.Vector3(0, -0.3, 0)
  let scrollP = 0

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = w < 700 ? 60 : 45
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  // mouse -> ray hit on y=0 plane (in the points' local space)
  const ray = new THREE.Raycaster()
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const ndc = new THREE.Vector2()
  const hit = new THREE.Vector3()
  let mouseTarget = 0
  const onMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    if (e.clientY > rect.bottom) return
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    const inv = new THREE.Matrix4().copy(points.matrixWorld).invert()
    const r = ray.ray.clone().applyMatrix4(inv)
    if (r.intersectPlane(plane, hit)) {
      uniforms.uMouse.value.set(hit.x, hit.z)
      mouseTarget = 1
      onCursor(hit.x, hit.z)
    }
  }
  const onLeave = () => { mouseTarget = 0 }
  window.addEventListener('pointermove', onMove)
  document.addEventListener('pointerleave', onLeave)

  let raf = 0
  let running = false
  let visible = true
  const clock = new THREE.Clock()
  let t0 = 0
  let stage = ''
  const setStage = (s: string) => { if (s !== stage) { stage = s; onStage(s) } }

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
  io.observe(canvas)

  function frame() {
    raf = requestAnimationFrame(frame)
    if (!visible) return
    const el = clock.getElapsedTime()
    uniforms.uTime.value = el
    const t = el - t0
    if (!reduced) {
      // choreography: 0-1.2s noise, 1.2-3.2 clusters, 4.4-7 surface
      const m1 = Math.min(Math.max((t - 1.0) / 2.0, 0), 1)
      const m2 = Math.min(Math.max((t - 4.4) / 2.8, 0), 1)
      uniforms.uM1.value = m1
      uniforms.uM2.value = m2
      if (t < 1.1) setStage('noise')
      else if (m2 === 0) setStage(m1 < 1 ? 'k-means · fitting' : 'k = 4 · converged')
      else setStage(m2 < 1 ? 'projecting surface' : 'loss surface · live')
    } else setStage('loss surface · live')

    uniforms.uMouseOn.value += (mouseTarget - uniforms.uMouseOn.value) * 0.06

    const m2 = uniforms.uM2.value
    const e2 = m2 * m2 * (3 - 2 * m2)
    camera.position.lerpVectors(camFront, camSurf, e2)
    camera.position.y += scrollP * 3
    camera.position.z -= scrollP * 2
    camera.lookAt(look)
    points.rotation.y = (1 - e2) * Math.sin(el * 0.15) * 0.25 + scrollP * 0.4
    renderer.render(scene, camera)
  }

  return {
    start() {
      if (running) return
      running = true
      t0 = clock.getElapsedTime()
      frame()
    },
    setScroll(p: number) { scrollP = p },
    dispose() {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      renderer.dispose(); geo.dispose(); mat.dispose()
    },
  }
}

export const HERO_POINTS = () => (window.matchMedia('(max-width: 820px)').matches ? 64 * 64 : 104 * 104)
