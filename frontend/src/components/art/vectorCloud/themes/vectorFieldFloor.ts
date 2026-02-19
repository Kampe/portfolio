/**
 * RETROWAVE TRIANGULAR PRISM TUNNEL
 * Trippy neon tunnel flying experience
 *
 * Visual: Camera inside a long triangular prism tunnel, flying forward toward
 * dark vanishing point. Cyan wireframe grid on walls, thick hot-pink neon rails
 * along triangle edges, magenta/purple emissive panels scattered on walls.
 * Dark background with intense bloom and haze.
 *
 * Motion: Forward flight + subtle camera roll + micro bob for disorienting effect.
 * Grid/panels rush past creating sense of high speed. Infinite tunnel via recycling.
 *
 * Technical: Custom triangle prism geometry, emissive materials, procedural grid shader,
 * strong bloom + fog, frame-rate independent motion
 *
 * Performance: ~60fps desktop, 40-50fps mobile
 */

import * as THREE from 'three'
import { SynthesizedPattern } from '../synthesis'
import { ThemeSetupResult, ThemeInteractionState, ThemeConfig } from './themeTypes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const CONFIG: ThemeConfig = {
  name: 'Retrowave Tunnel',
  description: 'Trippy retrowave triangular prism tunnel with neon grid and rails',
  colors: {
    primary: '#ff1493', // hot pink
    secondary: '#00ffff', // cyan
    tertiary: '#ff00ff', // magenta
  },
  performance: {
    targetFps: 60,
  },
}

// Cyan grid shader for tunnel walls
const gridVertexShader = `
  uniform float scrollSpeed;

  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vWorldPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const gridFragmentShader = `
  uniform float scrollOffset;

  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vec2 uv = vUv;

    // Apply scroll offset to create movement
    uv.y += scrollOffset;

    // Create cyan wireframe grid with smooth lines
    float gridScale = 0.15;
    vec2 grid = abs(fract(uv / gridScale) - 0.5) * 2.0;
    float gridLine = min(grid.x, grid.y);
    float line = smoothstep(0.08, 0.02, gridLine);

    // Cyan color with intensity
    vec3 gridColor = vec3(0.0, 1.0, 1.0) * line * 0.9;

    // Fade with distance (depth along Z)
    float depth = clamp((vWorldPos.z + 50.0) / 100.0, 0.0, 1.0);
    gridColor *= mix(0.2, 1.0, depth);

    // Bright emissive output
    gl_FragColor = vec4(gridColor, 1.0);
  }
`

// Create triangular prism tunnel geometry
const createTrianglePrismTunnel = (width: number, height: number, depth: number, segmentsZ: number) => {
  const geometry = new THREE.BufferGeometry()

  // Triangle dimensions (isoceles triangle)
  const radius = 4 // Distance from center to vertex
  const angle = (Math.PI * 2) / 3 // 120 degrees for each vertex

  // Vertices array
  const vertices: number[] = []
  const indices: number[] = []

  // Create vertices for the prism (front and back faces, plus sides)
  for (let z = 0; z <= segmentsZ; z++) {
    const zPos = (z / segmentsZ) * depth - depth / 2

    // Three vertices of the triangle at this Z
    for (let i = 0; i < 3; i++) {
      const theta = angle * i
      const x = Math.cos(theta) * radius
      const y = Math.sin(theta) * radius
      vertices.push(x, y, zPos)
    }
  }

  // Create indices for triangle faces (3 rectangle faces per segment)
  for (let z = 0; z < segmentsZ; z++) {
    for (let i = 0; i < 3; i++) {
      const current = z * 3
      const next = (z + 1) * 3

      const v0 = current + i
      const v1 = current + ((i + 1) % 3)
      const v2 = next + i
      const v3 = next + ((i + 1) % 3)

      // Two triangles per face
      indices.push(v0, v2, v1)
      indices.push(v1, v2, v3)
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1))
  geometry.computeVertexNormals()

  // Generate UVs for grid mapping
  const uvs: number[] = []
  for (let z = 0; z <= segmentsZ; z++) {
    for (let i = 0; i < 3; i++) {
      uvs.push((i / 3), (z / segmentsZ))
    }
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))

  return geometry
}

// Create neon rail geometry (thin rectangle along an edge)
const createRailGeometry = (p1: THREE.Vector3, p2: THREE.Vector3, thickness: number) => {
  const geometry = new THREE.BufferGeometry()

  // Direction along the rail (Z axis for these rails)
  const direction = new THREE.Vector3().subVectors(p2, p1).normalize()

  // Get perpendicular from center to edge point
  const edgeDir = new THREE.Vector3(p1.x, p1.y, 0).normalize()

  // Perpendicular outward from tunnel center
  const perpendicular = new THREE.Vector3(-edgeDir.y, edgeDir.x, 0)

  const halfThick = thickness / 2
  const vertices = [
    p1.x - perpendicular.x * halfThick,
    p1.y - perpendicular.y * halfThick,
    p1.z,
    p1.x + perpendicular.x * halfThick,
    p1.y + perpendicular.y * halfThick,
    p1.z,
    p2.x + perpendicular.x * halfThick,
    p2.y + perpendicular.y * halfThick,
    p2.z,
    p2.x - perpendicular.x * halfThick,
    p2.y - perpendicular.y * halfThick,
    p2.z,
  ]

  const indices = [0, 1, 2, 0, 2, 3]

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1))

  return geometry
}

export const createVectorFieldFloorTheme = (
  canvas: HTMLCanvasElement,
  userConfig?: Partial<ThemeConfig>
): ThemeSetupResult => {
  const width = window.innerWidth
  const height = window.innerHeight

  // ===== SCENE SETUP =====
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000) // Pure black
  scene.fog = new THREE.FogExp2(0x000000, 0.035) // Haze for depth

  // ===== CAMERA =====
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 500)
  camera.position.set(0, 0, 0) // Center inside tunnel

  // ===== RENDERER =====
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  const dpr = Math.min(window.devicePixelRatio, 1.5)
  renderer.setPixelRatio(dpr)
  renderer.setSize(width, height)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2

  // ===== POSTPROCESSING =====
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  // Strong bloom for neon glow
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 2.0, 0.8, 0.2)
  composer.addPass(bloomPass)

  // ===== TUNNEL GEOMETRY =====
  const tunnelGeometry = createTrianglePrismTunnel(8, 8, 200, 100)

  const gridUniforms = {
    scrollOffset: { value: 0 },
  }

  const gridMaterial = new THREE.ShaderMaterial({
    uniforms: gridUniforms,
    vertexShader: gridVertexShader,
    fragmentShader: gridFragmentShader,
    emissive: 0x00ffff,
    emissiveIntensity: 0.5,
    side: THREE.DoubleSide,
  })

  const tunnelMesh = new THREE.Mesh(tunnelGeometry, gridMaterial)
  scene.add(tunnelMesh)

  // ===== NEON RAILS (hot pink) =====
  const railGeometries = []
  const railRadius = 4
  const angle = (Math.PI * 2) / 3

  for (let i = 0; i < 3; i++) {
    const theta1 = angle * i
    const theta2 = angle * ((i + 1) % 3)

    const p1 = new THREE.Vector3(
      Math.cos(theta1) * railRadius,
      Math.sin(theta1) * railRadius,
      -100
    )
    const p2 = new THREE.Vector3(
      Math.cos(theta1) * railRadius,
      Math.sin(theta1) * railRadius,
      100
    )

    const railGeo = createRailGeometry(p1, p2, 0.15)
    railGeometries.push(railGeo)

    const railMaterial = new THREE.MeshBasicMaterial({
      color: 0xff1493,
      emissive: 0xff1493,
      emissiveIntensity: 1.0,
      side: THREE.DoubleSide,
    })

    const railMesh = new THREE.Mesh(railGeo, railMaterial)
    scene.add(railMesh)
  }

  // ===== EMISSIVE PANELS =====
  const panelMeshes: THREE.Mesh[] = []
  const panelCount = 40

  for (let i = 0; i < panelCount; i++) {
    const panelWidth = 0.8 + Math.random() * 0.6
    const panelHeight = 0.6 + Math.random() * 0.5
    const panelGeo = new THREE.PlaneGeometry(panelWidth, panelHeight)

    // Random color between magenta shades
    const hue = 0.75 + Math.random() * 0.15 // Purple to magenta range
    const panelColor = new THREE.Color().setHSL(hue, 0.95, 0.4)

    const panelMaterial = new THREE.MeshBasicMaterial({
      color: panelColor,
      emissive: panelColor,
      emissiveIntensity: 0.8,
      side: THREE.DoubleSide,
    })

    const panelMesh = new THREE.Mesh(panelGeo, panelMaterial)

    // Random position on tunnel walls
    const faceIndex = Math.floor(Math.random() * 3)
    const theta = angle * faceIndex + Math.random() * 0.3 - 0.15
    const radius = railRadius * 0.85
    const x = Math.cos(theta) * radius
    const y = Math.sin(theta) * radius
    const z = (Math.random() - 0.5) * 180 - 50

    panelMesh.position.set(x, y, z)

    // Random rotation for visual variety
    panelMesh.rotation.z = Math.random() * Math.PI * 2

    scene.add(panelMesh)
    panelMeshes.push(panelMesh)
  }

  // ===== CAMERA STATE =====
  let cameraZ = 0
  let cameraRoll = 0

  const handleResize = () => {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight
    camera.aspect = newWidth / newHeight
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, newHeight)
    composer.setSize(newWidth, newHeight)
  }

  window.addEventListener('resize', handleResize)

  // ===== UPDATE LOOP =====
  const update = (
    time: number,
    pattern: SynthesizedPattern,
    interaction: ThemeInteractionState
  ) => {
    const dt = interaction.deltaTime || 1 / 60

    // ===== CAMERA MOVEMENT =====
    // Forward motion (smooth and contemplative)
    cameraZ += 0.018 * (1.0 + pattern.lightIntensity * 0.2) * (60 * dt)

    // Subtle oscillating roll (disorienting)
    cameraRoll = Math.sin(time * 0.0002) * 0.08 + Math.cos(time * 0.0003) * 0.05

    // Micro bob (up/down)
    const bobAmount = Math.sin(time * 0.0002) * 0.2 + Math.cos(time * 0.0004) * 0.15

    // Apply camera transforms
    camera.position.z = cameraZ % 100 - 50 // Wrap camera within tunnel bounds
    camera.position.y = bobAmount
    camera.rotation.z = cameraRoll

    // ===== UPDATE GRID SCROLL =====
    gridUniforms.scrollOffset.value = (cameraZ / 10) % 1

    // ===== RECYCLE PANELS =====
    for (const panel of panelMeshes) {
      if (panel.position.z < cameraZ - 80) {
        // Recycle to front
        const faceIndex = Math.floor(Math.random() * 3)
        const theta = angle * faceIndex + Math.random() * 0.3 - 0.15
        const radius = railRadius * 0.85
        const x = Math.cos(theta) * radius
        const y = Math.sin(theta) * radius
        panel.position.set(x, y, cameraZ + 100 + Math.random() * 20)
        panel.lookAt(0, 0, cameraZ)
      }
    }
  }

  // ===== DISPOSAL =====
  const dispose = () => {
    window.removeEventListener('resize', handleResize)
    tunnelGeometry.dispose()
    gridMaterial.dispose()
    for (const geo of railGeometries) {
      geo.dispose()
    }
    for (const panel of panelMeshes) {
      panel.geometry.dispose()
      if (panel.material instanceof THREE.Material) {
        panel.material.dispose()
      }
    }
    composer.dispose()
    renderer.dispose()
  }

  return {
    scene,
    camera,
    renderer,
    composer,
    update,
    dispose,
  }
}
