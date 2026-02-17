/**
 * CHARGED MAGNETOSPHERE THEME
 * Inspired by Robert Hodgin's Magnetosphere visualizer
 *
 * Visual: Charged particle system with attractive/repulsive forces.
 * Particles with opposite charges dance around each other in organic flows.
 * Additive blending creates intense glowing "trippiness"
 *
 * Physics: Each particle has a charge (+/-). Distance-based forces
 * create emergent patterns without explicit geometry
 *
 * Performance: ~50-60fps on desktop, 30-45fps mobile (particle physics)
 */

import * as THREE from 'three'
import { SynthesizedPattern } from '../synthesis'
import { ThemeSetupResult, ThemeInteractionState, ThemeConfig } from './themeTypes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const CONFIG: ThemeConfig = {
  name: 'Charged Magnetosphere',
  description: 'Dense particle clouds with intense glowing interactions',
  colors: {
    primary: '#ff006e',
    secondary: '#00d4ff',
    tertiary: '#ffbe0b',
  },
  performance: {
    targetFps: 50,
    particleCount: 2000,
  },
}

// ===== CONFIGURATION KNOBS =====
const PARAMS = {
  particleCount: 2000, // Dense cloud like original Magnetosphere
  particleSize: 2.8, // Medium-large glowing particles
  bloomStrength: 0.6, // Subtle glow (preserves text readability)
  bloomRadius: 0.4,
  bloomThreshold: 0.5,
  toneMappingExposure: 0.85, // Slightly reduced brightness
  interactionRadius: 80, // Larger interaction range
  chargeStrength: 0.6, // Moderate repulsion/attraction for organic spreading
  velocityDamping: 0.91, // Smooth drift through space
  beatResponsiveness: 2.5, // Strong response to pattern energy
}

interface ChargedParticle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  charge: number // +1 or -1
  color: THREE.Color
  age: number
  life: number
}

// Beautiful complementary color pairs
interface ColorPair {
  positive: number // Hue for positive charge
  negative: number // Hue for negative charge
}

const COMPLEMENTARY_PAIRS: ColorPair[] = [
  { positive: 0.95, negative: 0.35 }, // Hot pink + cyan
  { positive: 0.6, negative: 0.05 }, // Electric blue + orange
  { positive: 0.85, negative: 0.35 }, // Purple + teal
  { positive: 0.05, negative: 0.55 }, // Hot orange + seafoam
  { positive: 0.15, negative: 0.7 }, // Yellow-orange + electric blue
  { positive: 0.9, negative: 0.3 }, // Magenta + cyan-green
  { positive: 0.55, negative: 0.08 }, // Bright cyan + deep orange
]

// Pick a random complementary pair
const pickColorPair = (): ColorPair => {
  return COMPLEMENTARY_PAIRS[Math.floor(Math.random() * COMPLEMENTARY_PAIRS.length)]
}

export const createChargedMagnetosphereTheme = (
  canvas: HTMLCanvasElement,
  userConfig?: Partial<ThemeConfig>
): ThemeSetupResult => {
  const width = window.innerWidth
  const height = window.innerHeight

  // ===== RANDOM COLOR PAIR =====
  const colorPair = pickColorPair()

  // ===== RANDOM STARTING POSITION =====
  const randomStartX = (Math.random() - 0.5) * 80 - 30 // Biased left
  const randomStartY = (Math.random() - 0.5) * 60 + 10
  const randomStartZ = Math.random() * 40 + 50

  // ===== SCENE SETUP =====
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0012)
  scene.fog = new THREE.FogExp2(0x0a0012, 0.0005)

  // ===== CAMERA =====
  const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000)
  camera.position.set(randomStartX, randomStartY, randomStartZ)
  camera.lookAt(randomStartX + 20, randomStartY, 0)

  // ===== RENDERER =====
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  const dpr = Math.min(window.devicePixelRatio, 1.5)
  renderer.setPixelRatio(dpr)
  renderer.setSize(width, height)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = PARAMS.toneMappingExposure

  // ===== POSTPROCESSING =====
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    PARAMS.bloomStrength, // strength - intense glow
    PARAMS.bloomRadius, // radius
    PARAMS.bloomThreshold // threshold
  )
  composer.addPass(bloomPass)

  // ===== PARTICLE SYSTEM =====
  const particleCount = PARAMS.particleCount
  const particles: ChargedParticle[] = []

  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  const particleColors = new Float32Array(particleCount * 3)

  // Track offset center for globe movement around screen
  let globeCenterX = randomStartX
  let globeCenterY = randomStartY
  let globeCenterZ = randomStartZ

  // Initialize particles with random charges and complementary colors
  for (let i = 0; i < particleCount; i++) {
    const charge = Math.random() > 0.5 ? 1 : -1
    const baseHue = charge > 0 ? colorPair.positive : colorPair.negative
    const color = new THREE.Color().setHSL(baseHue, 0.85, 0.45)

    particles.push({
      position: new THREE.Vector3(
        randomStartX + (Math.random() - 0.5) * 180,
        randomStartY + (Math.random() - 0.5) * 180,
        randomStartZ + (Math.random() - 0.5) * 140
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.6
      ),
      charge,
      color,
      age: 0,
      life: Math.random() * 6 + 4,
    })

    particlePositions[i * 3] = particles[i].position.x
    particlePositions[i * 3 + 1] = particles[i].position.y
    particlePositions[i * 3 + 2] = particles[i].position.z

    particleColors[i * 3] = color.r
    particleColors[i * 3 + 1] = color.g
    particleColors[i * 3 + 2] = color.b
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

  // Create glow texture for particles
  const glowCanvas = document.createElement('canvas')
  glowCanvas.width = 64
  glowCanvas.height = 64
  const ctx = glowCanvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.5, 'rgba(255, 150, 255, 0.6)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const glowTexture = new THREE.CanvasTexture(glowCanvas)

  const particleMaterial = new THREE.PointsMaterial({
    map: glowTexture,
    color: 0xffffff,
    vertexColors: true,
    size: PARAMS.particleSize,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false, // Don't fade particles with fog for more vivid effect
  })

  const particleMesh = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particleMesh)

  // ===== LIGHTING =====
  const ambientLight = new THREE.AmbientLight(0x1a0a2e, 0.2)
  scene.add(ambientLight)

  const handleResize = () => {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight
    camera.aspect = newWidth / newHeight
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, newHeight)
  }

  window.addEventListener('resize', handleResize)

  // ===== UPDATE LOOP =====
  const update = (
    time: number,
    pattern: SynthesizedPattern,
    interaction: ThemeInteractionState
  ) => {
    const particlePositions = particleGeometry.attributes.position.array as Float32Array
    const particleColors = particleGeometry.attributes.color.array as Float32Array
    const dt = interaction.deltaTime || 1 / 60 // Use actual delta time, fallback to 60fps

    // Update particles with charged particle physics
    for (let i = 0; i < particleCount; i++) {
      const particle = particles[i]

      particle.age += dt

      // Only update physics for living particles
      if (particle.age <= particle.life) {
        // Charged particle interactions: calculate forces from other particles
        let forceX = 0
        let forceY = 0
        let forceZ = 0

        for (let j = 0; j < particleCount; j++) {
          if (i === j) continue

          const other = particles[j]
          const dx = other.position.x - particle.position.x
          const dy = other.position.y - particle.position.y
          const dz = other.position.z - particle.position.z
          const distSq = dx * dx + dy * dy + dz * dz
          const dist = Math.sqrt(distSq)

          if (dist < 0.05) continue // Skip if too close
          if (dist > PARAMS.interactionRadius) continue // Skip if too far

          // Coulomb-like force: stronger repulsion/attraction
          const chargeProduct = particle.charge * other.charge
          const forceMagnitude = (chargeProduct * PARAMS.chargeStrength) / (distSq + 0.5)

          forceX += (dx / dist) * forceMagnitude
          forceY += (dy / dist) * forceMagnitude
          forceZ += (dz / dist) * forceMagnitude
        }

        // Apply forces to velocity (stronger response)
        particle.velocity.x += forceX * 0.02
        particle.velocity.y += forceY * 0.02
        particle.velocity.z += forceZ * 0.02

        // Damping for drift trails
        particle.velocity.multiplyScalar(PARAMS.velocityDamping)

        // Update position
        particle.position.addScaledVector(particle.velocity, 1.0)
      }

      // Update position in geometry (for both living and fading particles)
      particlePositions[i * 3] = particle.position.x
      particlePositions[i * 3 + 1] = particle.position.y
      particlePositions[i * 3 + 2] = particle.position.z

      // Update color: psychedelic cycling based on charge + pattern + time
      const ageRatio = particle.age / particle.life

      // Base hue from charge-based color pair, with cycling
      const chargeHue = particle.charge > 0 ? colorPair.positive : colorPair.negative
      const baseHue = (chargeHue +
        pattern.colorShift * 0.2 +
        time * 0.0005 +
        i * 0.0001) % 1

      // High saturation for vivid neon look
      const saturation = 0.95 + Math.sin(time * 0.0003 + i * 0.01) * 0.05

      // Bright, responsive to pattern energy, but capped to prevent over-saturation
      // Fades out as particles age past their life
      const baseLightness = Math.max(0, 0.55 * (1 - Math.min(1, ageRatio) * 0.3))
      const energyBoost = ageRatio <= 1 ?
        (pattern.lightIntensity * PARAMS.beatResponsiveness * 0.05 +
        pattern.frequency.peak * 0.08) : 0
      const lightness = Math.min(0.65, baseLightness + energyBoost)

      const color = new THREE.Color().setHSL(baseHue % 1, saturation, lightness)
      particleColors[i * 3] = color.r
      particleColors[i * 3 + 1] = color.g
      particleColors[i * 3 + 2] = color.b
    }

    ;(particleGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
    ;(particleGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true

    // Dynamic globe movement - move the particle cloud around the screen
    // Multiple sine waves at different frequencies for organic motion
    globeCenterX = randomStartX +
      Math.sin(time * 0.00006) * 35 +
      Math.cos(time * 0.00009) * 25
    globeCenterY = randomStartY +
      Math.cos(time * 0.00005) * 28 +
      Math.sin(time * 0.00008) * 20
    globeCenterZ = randomStartZ +
      Math.sin(time * 0.00004) * 15

    // Camera follows globe with slight lag for immersion
    const cameraOffsetX = globeCenterX + Math.sin(time * 0.00007) * 8
    const cameraOffsetY = globeCenterY + Math.cos(time * 0.00006) * 6
    const cameraOffsetZ = globeCenterZ + 25

    camera.position.x = cameraOffsetX
    camera.position.y = cameraOffsetY
    camera.position.z = cameraOffsetZ

    // Look at globe center with dynamic variation
    const lookAtX = globeCenterX + Math.sin(time * 0.00008) * 8
    const lookAtY = globeCenterY + Math.cos(time * 0.00007) * 6
    const lookAtZ = globeCenterZ + 15
    camera.lookAt(lookAtX, lookAtY, lookAtZ)
  }

  // ===== DISPOSAL =====
  const dispose = () => {
    window.removeEventListener('resize', handleResize)

    particleGeometry.dispose()
    particleMaterial.dispose()
    glowTexture.dispose()
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
