/**
 * TERRAIN VISUALIZATION WITH FLOW FIELD
 * Camera flying over generative landscape with glowing point cloud
 * Points plotted to terrain, moving via curl noise flow fields
 */

import * as THREE from 'three'
import gsap from 'gsap'
import { synthesizePattern, SynthesizedPattern } from './synthesis'
import { createGlowSpriteTexture, createGlowMaterial } from './glowSprite'
import { curlNoise, verticalFlow } from './flowField'

export interface SophisticatedSceneSetup {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  update: (
    time: number,
    mousePos: THREE.Vector3 | null,
    energizedLevel: number,
    clickPulseIntensity: number
  ) => void
  dispose: () => void
}

// Improved Perlin-like noise for procedural terrain
const perlinNoise = (x: number, y: number, seed: number = 0): number => {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453
  return n - Math.floor(n)
}

const smoothstep = (t: number): number => {
  return t * t * (3 - 2 * t)
}

// Fractal Brownian Motion (FBM) for rich terrain
const fbm = (x: number, z: number, time: number, octaves: number = 4): number => {
  let value = 0
  let amplitude = 1
  let frequency = 1
  let maxValue = 0

  for (let i = 0; i < octaves; i++) {
    const sampleX = x * frequency + time * 0.00001
    const sampleZ = z * frequency + time * 0.00002
    value += amplitude * (perlinNoise(sampleX, sampleZ, i) * 2 - 1)
    maxValue += amplitude
    amplitude *= 0.5
    frequency *= 2.1
  }

  return value / maxValue
}

const terrainHeight = (x: number, z: number, time: number): number => {
  const fbmValue = fbm(x * 0.008, z * 0.008, time, 6)
  const ridge = Math.abs(fbmValue) // Ridge effect for visual richness
  const secondLayer = fbm(x * 0.015, z * 0.015, time, 3) // Additional noise detail
  const height = (fbmValue * 28 + ridge * 18 + secondLayer * 8)
  return height
}

export const createSophisticatedScene = (canvas: HTMLCanvasElement): SophisticatedSceneSetup => {
  const width = window.innerWidth
  const height = window.innerHeight

  // ===== SCENE SETUP =====
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x080812)
  scene.fog = new THREE.FogExp2(0x080812, 0.0018)

  // ===== CAMERA =====
  const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 5000)
  camera.position.set(0, 120, 150)
  camera.lookAt(0, 0, 0)

  // ===== RENDERER =====
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  })

  const dpr = Math.min(window.devicePixelRatio, 2)
  renderer.setPixelRatio(dpr)
  renderer.setSize(width, height)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.3

  // ===== TERRAIN MESH (REDUCED SUBDIVISIONS FOR PERFORMANCE) =====
  const terrainGeometry = new THREE.PlaneGeometry(900, 900, 60, 60) // Reduced from 140x140
  const terrainPositions = terrainGeometry.getAttribute('position') as THREE.BufferAttribute
  const posArray = terrainPositions.array as Float32Array

  // Deform plane into wavy terrain using FBM
  for (let i = 0; i < posArray.length; i += 3) {
    const x = posArray[i]
    const z = posArray[i + 1]
    posArray[i + 2] = terrainHeight(x, z, 0)
  }
  terrainPositions.needsUpdate = true
  terrainGeometry.rotateX(-Math.PI / 2.5)
  terrainGeometry.computeVertexNormals()

  const terrainMaterial = new THREE.MeshBasicMaterial({
    color: 0x0f1e3d,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  })
  const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial)
  scene.add(terrainMesh)

  // ===== GLOWING POINT CLOUD SYSTEM =====
  // Grid-based point placement for better coverage
  const gridSize = 32  // 32x32 = 1024 points for denser field
  const spacing = 900 / gridSize
  const particleCount = gridSize * gridSize
  const particlesGeometry = new THREE.BufferGeometry()

  const particlePositions = new Float32Array(particleCount * 3)
  const particleVelocities = new Float32Array(particleCount * 3)
  const particlePhases = new Float32Array(particleCount)

  let idx = 0
  for (let gx = 0; gx < gridSize; gx++) {
    for (let gz = 0; gz < gridSize; gz++) {
      const x = (gx / gridSize - 0.5) * 900 + (Math.random() - 0.5) * spacing * 0.4
      const z = (gz / gridSize - 0.5) * 900 + (Math.random() - 0.5) * spacing * 0.4
      const terrainY = terrainHeight(x, z, 0)
      const y = terrainY + 12 + Math.random() * 6

      particlePositions[idx * 3] = x
      particlePositions[idx * 3 + 1] = y
      particlePositions[idx * 3 + 2] = z

      particleVelocities[idx * 3] = 0
      particleVelocities[idx * 3 + 1] = 0
      particleVelocities[idx * 3 + 2] = 0

      particlePhases[idx] = Math.random() * Math.PI * 2

      idx++
    }
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

  // Create glow sprite texture and material
  const glowTexture = createGlowSpriteTexture()
  const particleMaterial = createGlowMaterial(glowTexture)

  const particles = new THREE.Points(particlesGeometry, particleMaterial)
  scene.add(particles)

  // ===== LIGHTING =====
  const ambientLight = new THREE.AmbientLight(0x1a3a5a, 0.3)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0x00d4ff, 0.7)
  dirLight.position.set(250, 180, 250)
  scene.add(dirLight)

  const rimLight = new THREE.PointLight(0x7700ff, 1.2, 1000)
  rimLight.position.set(-350, 120, -350)
  scene.add(rimLight)

  // ===== CAMERA FLIGHT PATH =====
  // Dramatic flight path with wider coverage and higher altitude for visual impact
  const flightPath = [
    new THREE.Vector3(0, 200, 350),      // Center high
    new THREE.Vector3(400, 150, -400),   // Far corner low-ish
    new THREE.Vector3(-450, 180, 300),   // Opposite corner
    new THREE.Vector3(350, 120, -350),   // Deep dive low
    new THREE.Vector3(-300, 200, -400),  // Far side high
    new THREE.Vector3(0, 160, 0),        // Center for breath
  ]

  let currentPathIndex = 0
  let cameraLookTarget = new THREE.Vector3(0, 30, 0)
  let isFlying = false
  let flightTimeout: NodeJS.Timeout | null = null

  const animateCameraPath = () => {
    if (!isFlying && flightPath.length > 0) {
      isFlying = true
      const nextPoint = flightPath[currentPathIndex]
      currentPathIndex = (currentPathIndex + 1) % flightPath.length

      gsap.to(camera.position, {
        x: nextPoint.x,
        y: nextPoint.y,
        z: nextPoint.z,
        duration: 18,
        ease: 'power1.inOut',
        onUpdate: () => {
          // Look ahead in flight direction with smooth damping
          cameraLookTarget.x = nextPoint.x * 0.2
          cameraLookTarget.y = nextPoint.y * 0.1 + 20
          cameraLookTarget.z = nextPoint.z * 0.2
        },
        onComplete: () => {
          isFlying = false
          // Small delay between waypoints for dramatic pause
          flightTimeout = setTimeout(() => animateCameraPath(), 800)
        }
      })
    }
  }

  // Start camera flight after scene stabilizes
  const startFlightPath = () => {
    if (flightPath.length > 0) {
      animateCameraPath()
    }
  }
  setTimeout(startFlightPath, 500)

  // ===== ANIMATION STATE =====
  const update = (
    time: number,
    mousePos: THREE.Vector3 | null,
    energizedLevel: number,
    clickPulseIntensity: number
  ) => {
    const pattern: SynthesizedPattern = synthesizePattern(time)

    // ===== UPDATE TERRAIN =====
    const terrainPos = terrainGeometry.getAttribute('position') as THREE.BufferAttribute
    const terrainPosArray = terrainPos.array as Float32Array

    // Update every Nth vertex to reduce computation (skip some for performance)
    for (let i = 0; i < terrainPosArray.length; i += 9) {
      const x = terrainPosArray[i]
      const z = terrainPosArray[i + 1]
      terrainPosArray[i + 2] = terrainHeight(x, z, time)
    }
    terrainPos.needsUpdate = true

    // ===== UPDATE PARTICLE SYSTEM WITH FLOW FIELD =====
    const positions = particlesGeometry.getAttribute('position') as THREE.BufferAttribute
    const posArray = positions.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      const px = posArray[i3]
      const py = posArray[i3 + 1]
      const pz = posArray[i3 + 2]

      // Get terrain height at particle x,z
      const terrainY = terrainHeight(px, pz, time)
      const baseHeight = terrainY + 12

      // Apply curl noise flow field
      const flow = curlNoise(px, py, pz, time)
      particleVelocities[i3] += flow.x * 0.08
      particleVelocities[i3 + 1] += flow.y * 0.06
      particleVelocities[i3 + 2] += flow.z * 0.08

      // Vertical flow with gentle oscillation
      const vFlow = verticalFlow(px, pz, time)
      particleVelocities[i3 + 1] += vFlow * 0.04

      // Subtle oscillation around base height (music visualizer effect)
      const oscillation = Math.sin(time * 0.0002 + particlePhases[i]) * 6
      const targetHeight = baseHeight + oscillation

      // Smooth attraction to target height
      const heightDiff = targetHeight - py
      particleVelocities[i3 + 1] += heightDiff * 0.015

      // Apply velocities
      posArray[i3] += particleVelocities[i3] * 0.016
      posArray[i3 + 1] += particleVelocities[i3 + 1] * 0.016
      posArray[i3 + 2] += particleVelocities[i3 + 2] * 0.016

      // Soft boundaries with wrapping
      const boundRadius = 450
      const dist = Math.sqrt(posArray[i3] * posArray[i3] + posArray[i3 + 2] * posArray[i3 + 2])
      if (dist > boundRadius) {
        const ratio = boundRadius / dist
        posArray[i3] *= ratio
        posArray[i3 + 2] *= ratio
        particleVelocities[i3] *= -0.5
        particleVelocities[i3 + 2] *= -0.5
      }

      // Damping
      particleVelocities[i3] *= 0.95
      particleVelocities[i3 + 1] *= 0.94
      particleVelocities[i3 + 2] *= 0.95

      // Click pulse: radial burst
      if (clickPulseIntensity > 0.1) {
        const dx = posArray[i3]
        const dz = posArray[i3 + 2]
        const d = Math.sqrt(dx * dx + dz * dz)
        if (d > 0.1) {
          const force = clickPulseIntensity * 3
          particleVelocities[i3] += (dx / d) * force
          particleVelocities[i3 + 2] += (dz / d) * force
          particleVelocities[i3 + 1] += clickPulseIntensity * 5
        }
      }
    }

    positions.needsUpdate = true

    // ===== UPDATE PARTICLE MATERIAL =====
    particleMaterial.opacity = 0.7 + pattern.spatialFlow * 0.2
    particleMaterial.size = 3.5 + pattern.lightIntensity * 1.2

    // ===== UPDATE CAMERA LOOK TARGET =====
    camera.lookAt(cameraLookTarget)

    // ===== UPDATE LIGHTS =====
    rimLight.intensity = 1.2 + pattern.lightIntensity * 0.5
    dirLight.intensity = 0.7 + pattern.spatialFlow * 0.25
  }

  // Handle resize
  const handleResize = () => {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight
    camera.aspect = newWidth / newHeight
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, newHeight)
  }

  window.addEventListener('resize', handleResize)

  // Render function
  const renderFrame = (time: number, mousePos: THREE.Vector3 | null, energizedLevel: number, clickPulseIntensity: number) => {
    update(time, mousePos, energizedLevel, clickPulseIntensity)
    renderer.render(scene, camera)
  }

  // Cleanup
  const dispose = () => {
    window.removeEventListener('resize', handleResize)
    if (flightTimeout) clearTimeout(flightTimeout)
    // Kill all GSAP animations for this scene
    gsap.killTweensOf([camera.position])

    terrainGeometry.dispose()
    terrainMaterial.dispose()
    particlesGeometry.dispose()
    particleMaterial.dispose()
    glowTexture.dispose()
    renderer.dispose()
  }

  return {
    scene,
    camera,
    renderer,
    update: renderFrame,
    dispose,
  }
}
