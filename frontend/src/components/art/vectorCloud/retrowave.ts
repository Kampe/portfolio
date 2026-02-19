/**
 * RETROWAVE SPECTROGRAM
 * Fast-paced forward-flying camera over an infinite landscape
 * Grid of independent noise-animated points
 * Optimized for long-running animations without CPU degradation
 */

import * as THREE from 'three'
import { synthesizePattern, SynthesizedPattern } from './synthesis'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export interface RetrowaveSceneSetup {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  composer: EffectComposer
  update: (
    time: number,
    mousePos: THREE.Vector3 | null,
    energizedLevel: number,
    clickPulseIntensity: number
  ) => void
  dispose: () => void
}

// Perlin-like noise
const perlinNoise = (x: number, y: number, seed: number = 0): number => {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453
  return n - Math.floor(n)
}

const smoothstep = (t: number): number => t * t * (3 - 2 * t)

// Create a glow sprite texture for particles
const createGlowTexture = (): THREE.Texture => {
  const size = 64
  const textureCanvas = document.createElement('canvas')
  textureCanvas.width = size
  textureCanvas.height = size

  const ctx = textureCanvas.getContext('2d')!
  const centerX = size / 2
  const centerY = size / 2
  const maxRadius = size / 2

  // Radial gradient for glow sphere effect
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')    // Bright white center
  gradient.addColorStop(0.4, 'rgba(255, 150, 255, 0.7)')  // Magenta mid-tone
  gradient.addColorStop(0.7, 'rgba(150, 100, 255, 0.3)')  // Purple fade
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')            // Transparent edge

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(textureCanvas)
  texture.needsUpdate = true
  return texture
}

export const createRetrowaveScene = (
  canvas: HTMLCanvasElement
): RetrowaveSceneSetup => {
  const width = window.innerWidth
  const height = window.innerHeight

  // ===== SCENE =====
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0e27)
  scene.fog = new THREE.FogExp2(0x0a0e27, 0.003)

  // ===== CAMERA - FORWARD MOVEMENT =====
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
  // Start in middle of terrain plane for immediate immersion
  const terrainCenterZ = (120 * 40) / 2 // gridDepth * gridSpacing / 2
  camera.position.set(0, 120, terrainCenterZ)
  camera.lookAt(0, 120, terrainCenterZ + 500)

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
  renderer.toneMappingExposure = 1.5

  // ===== POSTPROCESSING - BLOOM FOR PSYCHEDELIC EFFECT =====
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.5, // strength
    0.4, // radius
    0.85  // threshold
  )
  composer.addPass(bloomPass)

  // ===== LANDSCAPE GRID OF POINTS =====
  // Create a 2D grid where each point has its own noise parameters
  const gridWidth = 32  // Points in X direction (wider)
  const gridDepth = 120  // Points in Z direction (much deeper, extending far into distance)
  const gridSpacing = 40 // Distance between points
  const totalPoints = gridWidth * gridDepth

  const pointGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(totalPoints * 3)
  const colors = new Float32Array(totalPoints * 3)
  const noiseFrequencies = new Float32Array(totalPoints) // Each point has unique frequency
  const noiseAmplitudes = new Float32Array(totalPoints) // Each point has unique amplitude
  const noisePhases = new Float32Array(totalPoints) // Each point has unique phase offset
  const glowiness = new Float32Array(totalPoints) // Random glow per point (0-1)

  // Initialize grid
  let idx = 0
  for (let z = 0; z < gridDepth; z++) {
    for (let x = 0; x < gridWidth; x++) {
      const px = (x - gridWidth / 2) * gridSpacing
      const pz = z * gridSpacing
      const py = 0

      positions[idx * 3] = px
      positions[idx * 3 + 1] = py
      positions[idx * 3 + 2] = pz

      // Each point gets independent noise parameters
      noiseFrequencies[idx] = 0.0002 + Math.random() * 0.0005
      noiseAmplitudes[idx] = 5 + Math.random() * 15
      noisePhases[idx] = Math.random() * Math.PI * 2
      // Random glow (only some points glow brightly, most are dimmer)
      glowiness[idx] = Math.random() * Math.random() // Biased toward lower values

      // Initialize gradient color based on depth (z position)
      const depthFactor = z / gridDepth // 0 to 1 from near to far
      const glow = glowiness[idx] // 0-1, higher = glows more
      // Gradient: magenta (near) -> cyan (far), modulated by glow - ENHANCED FOR PSYCHEDELIC EFFECT
      const baseR = Math.max(0, 1.0 - depthFactor * 0.4) // brighter magentas
      const baseG = depthFactor * 1.0 // more vibrant cyans
      const baseB = 1.0 - depthFactor * 0.2 // more blue throughout
      // Psychedelic: brighten all colors significantly
      const r = Math.min(1.0, baseR * (0.5 + glow * 1.2))
      const g = Math.min(1.0, baseG * (0.5 + glow * 1.2))
      const b = Math.min(1.0, baseB * (0.5 + glow * 1.2))

      colors[idx * 3] = r
      colors[idx * 3 + 1] = g
      colors[idx * 3 + 2] = b

      idx++
    }
  }

  pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // Create glow sprite texture for sphere-like appearance
  const glowTexture = createGlowTexture()

  // Retrowave colors with vertex color gradients and glow sphere texture
  const pointMaterial = new THREE.PointsMaterial({
    map: glowTexture,
    color: 0xffffff, // Use vertex colors
    vertexColors: true,
    size: 14,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const pointMesh = new THREE.Points(pointGeometry, pointMaterial)
  scene.add(pointMesh)

  // ===== LIGHTING - ENHANCED FOR PSYCHEDELIC EFFECT =====
  const ambientLight = new THREE.AmbientLight(0x1a3a5a, 0.8)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0x00f5ff, 1.0)
  dirLight.position.set(200, 150, 200)
  scene.add(dirLight)

  const rimLight = new THREE.PointLight(0x8b00ff, 1.5, 1000)
  rimLight.position.set(-300, 100, -300)
  scene.add(rimLight)

  // ===== DYNAMIC CAMERA MOVEMENT OVER TERRAIN =====
  let cameraFlightTime = 0
  const cameraSpeed = 0.8 // Flight speed multiplier
  const terrainHeight = 120 // Height above landscape surface

  // ===== RESIZE HANDLER =====
  const handleResize = () => {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight
    camera.aspect = newWidth / newHeight
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, newHeight)
  }

  window.addEventListener('resize', handleResize)

  // ===== ANIMATION UPDATE =====
  const update = (
    time: number,
    mousePos: THREE.Vector3 | null,
    energizedLevel: number,
    clickPulseIntensity: number
  ) => {
    const pattern: SynthesizedPattern = synthesizePattern(time)

    // ===== DYNAMIC CAMERA FLIGHT - SUPERMAN STYLE =====
    const speedMultiplier = 1.0 + energizedLevel * 0.5 + clickPulseIntensity * 2
    cameraFlightTime += cameraSpeed * 0.002 * speedMultiplier

    // Primary forward motion - camera flies through space
    const flyForward = cameraFlightTime * 600 // Steady forward progress

    // Serpentine flight path - weaving left/right
    const lateralSway = Math.sin(cameraFlightTime * 0.5) * 800
    const lateralSway2 = Math.sin(cameraFlightTime * 0.3) * 600

    // Vertical swoop - dips down over terrain, rises up - CLOSER TO TERRAIN FOR IMMERSION
    const heightVariation = Math.sin(cameraFlightTime * 0.4) * 100
    const heightRipple = Math.cos(cameraFlightTime * 0.8) * 50
    const cameraY = terrainHeight + 60 + heightVariation + heightRipple

    // Complex path: forward motion + weaving + spiraling
    const spiralRadius = 500 + Math.sin(cameraFlightTime * 0.6) * 300
    const spiralX = Math.cos(cameraFlightTime * 1.2) * spiralRadius + lateralSway
    const spiralZ = Math.sin(cameraFlightTime * 0.9) * spiralRadius + flyForward + lateralSway2

    // Set camera position
    camera.position.x = spiralX
    camera.position.y = cameraY
    camera.position.z = spiralZ

    // Look ahead in flight direction
    const lookAheadDist = 1000
    const lookForward = flyForward + lookAheadDist
    const lookX = Math.cos(cameraFlightTime * 1.2) * 300 + lateralSway * 0.3
    const lookZ = lookForward
    const lookY = cameraY + Math.sin(cameraFlightTime * 0.5) * 100
    const lookTarget = new THREE.Vector3(lookX, lookY, lookZ)
    camera.lookAt(lookTarget)

    // ===== UPDATE LANDSCAPE GRID =====
    const posAttr = pointGeometry.attributes.position as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array

    idx = 0
    for (let z = 0; z < gridDepth; z++) {
      for (let x = 0; x < gridWidth; x++) {
        const px = (x - gridWidth / 2) * gridSpacing
        // Static landscape grid centered at origin, camera orbits around it
        const baseZ = z * gridSpacing - (gridDepth / 2) * gridSpacing

        posArray[idx * 3] = px
        posArray[idx * 3 + 2] = baseZ

        // Wave-like motion: smooth, flowing like ocean waves
        // Vertical wave: propagates through space and time
        const waveHeight = Math.sin(baseZ * 0.005 + time * 0.0001) * 25
        // Gentle horizontal sway following the wave
        const waveSway = Math.sin(baseZ * 0.003 + time * 0.00008 + px * 0.005) * 60
        // Additional vertical ripple for organic feel
        const ripple = Math.sin(px * 0.02 + time * 0.0002 + baseZ * 0.003) * 15

        // Per-point independent noise for busyness
        const freq = noiseFrequencies[idx]
        const amplitude = noiseAmplitudes[idx]
        const phase = noisePhases[idx]
        // Individual point oscillations at unique frequencies
        const pointNoise1 = Math.sin(time * freq + phase) * amplitude * 0.6
        const pointNoise2 = Math.cos(time * freq * 0.7 + phase * 1.3) * (amplitude * 0.4)
        const individualNoise = pointNoise1 + pointNoise2

        const height = waveHeight + ripple + individualNoise

        posArray[idx * 3] = px + waveSway
        posArray[idx * 3 + 1] = height
        posArray[idx * 3 + 2] = baseZ

        idx++
      }
    }

    posAttr.needsUpdate = true

    // ===== UPDATE COLOR GRADIENT =====
    const colorAttr = pointGeometry.attributes.color as THREE.BufferAttribute
    const colorArray = colorAttr.array as Float32Array

    idx = 0
    for (let z = 0; z < gridDepth; z++) {
      for (let x = 0; x < gridWidth; x++) {
        const depthFactor = z / gridDepth
        const glow = glowiness[idx]
        // Wave pulse: glowing points pulse more dramatically - ENHANCED PSYCHEDELIC PULSE
        const wavePulse = Math.sin(time * 0.0001 + z * 0.005) * (0.5 + glow * 0.7)

        // Animated gradient: magenta -> cyan with wave pulse - PSYCHEDELIC BOOST
        const baseR = Math.max(0, 1.0 - depthFactor * 0.4) // brighter magentas
        const baseG = depthFactor * 1.0 // more vibrant cyans
        const baseB = 1.0 - depthFactor * 0.2 // more blue throughout

        const brightness = (0.5 + glow * 1.2) * (1.0 + wavePulse * 0.8)
        const r = Math.min(1.0, baseR * brightness)
        const g = Math.min(1.0, baseG * brightness)
        const b = Math.min(1.0, baseB * brightness)

        colorArray[idx * 3] = r
        colorArray[idx * 3 + 1] = g
        colorArray[idx * 3 + 2] = b

        idx++
      }
    }

    colorAttr.needsUpdate = true

    // ===== UPDATE MATERIALS =====
    // Point color shifts with energy
    const hue = (pattern.lightIntensity * 0.2 + 0.85) % 1
    const targetColor = new THREE.Color().setHSL(hue, 1, 0.5)
    pointMaterial.color.lerp(targetColor, 0.05)

    pointMaterial.opacity = 0.6 + pattern.spatialFlow * 0.25
    pointMaterial.size = 3 + pattern.lightIntensity * 2

    // Lighting - ENHANCED FOR PSYCHEDELIC VISIBILITY
    dirLight.intensity = 1.0 + pattern.spatialFlow * 0.5
    rimLight.intensity = 1.5 + pattern.lightIntensity * 0.6
  }

  // ===== CLEANUP =====
  const dispose = () => {
    window.removeEventListener('resize', handleResize)

    glowTexture.dispose()
    pointGeometry.dispose()
    pointMaterial.dispose()
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
