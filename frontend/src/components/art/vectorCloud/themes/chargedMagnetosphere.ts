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
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ===== COLOR SETUP =====
  // Use provided palette colors or pick random pair
  const paletteColors = userConfig?.paletteColors
  let orbColor1 = new THREE.Color()
  let orbColor2 = new THREE.Color()
  let orbColor3 = new THREE.Color()

  if (paletteColors) {
    orbColor1.setHex(paletteColors.color1)
    orbColor2.setHex(paletteColors.color2)
    orbColor3.setHex(paletteColors.color3)
  }

  const colorPair = paletteColors ? { positive: 0.95, negative: 0.35 } : pickColorPair()

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

  const gl = renderer.getContext()
  const debugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info')
  const rendererDescription = debugRendererInfo
    ? String(gl.getParameter(debugRendererInfo.UNMASKED_RENDERER_WEBGL))
    : ''
  const isSoftwareRenderer = /swiftshader|llvmpipe|software rasterizer/i.test(rendererDescription)
  const isConstrainedRenderer = isSoftwareRenderer || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2)

  // ===== POSTPROCESSING =====
  let composer: EffectComposer | undefined
  if (!isConstrainedRenderer && !prefersReducedMotion) {
    composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      PARAMS.bloomStrength,
      PARAMS.bloomRadius,
      PARAMS.bloomThreshold
    )
    composer.addPass(bloomPass)
  }

  // ===== PARTICLE SYSTEM =====
  // Keep the full original density on desktop, while avoiding an unnecessarily
  // expensive 2,000-particle simulation on small or reduced-motion devices.
  const particleCount = isConstrainedRenderer ? 200 : prefersReducedMotion ? 500 : width < 768 ? 900 : PARAMS.particleCount
  const particles: ChargedParticle[] = []

  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  const particleColors = new Float32Array(particleCount * 3)
  const forceX = new Float32Array(particleCount)
  const forceY = new Float32Array(particleCount)
  const forceZ = new Float32Array(particleCount)
  const forceBucketCount = 3
  const forceBucketsX = Array.from({ length: forceBucketCount }, () => new Float32Array(particleCount))
  const forceBucketsY = Array.from({ length: forceBucketCount }, () => new Float32Array(particleCount))
  const forceBucketsZ = Array.from({ length: forceBucketCount }, () => new Float32Array(particleCount))
  const workingColor = new THREE.Color()
  const white = new THREE.Color(1, 1, 1)
  let forceBucketIndex = -1

  // Track offset center for globe movement around screen
  let globeCenterX = randomStartX
  let globeCenterY = randomStartY
  let globeCenterZ = randomStartZ

  // Initialize particles with random charges and complementary colors
  for (let i = 0; i < particleCount; i++) {
    const charge = Math.random() > 0.5 ? 1 : -1

    // Use palette colors if provided, otherwise use HSL-based colors
    let color: THREE.Color
    if (paletteColors) {
      // Cycle through palette colors
      const colorIndex = i % 3
      if (colorIndex === 0) color = orbColor1.clone()
      else if (colorIndex === 1) color = orbColor2.clone()
      else color = orbColor3.clone()
    } else {
      const baseHue = charge > 0 ? colorPair.positive : colorPair.negative
      color = new THREE.Color().setHSL(baseHue, 0.85, 0.45)
    }

    particles.push({
      position: new THREE.Vector3(
        randomStartX + (Math.random() - 0.5) * 180,
        randomStartY + (Math.random() - 0.5) * 180,
        randomStartZ + (Math.random() - 0.5) * 140
      ),
      velocity: new THREE.Vector3(0, 0, 0), // Start from rest, accelerate via forces
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
    composer?.setSize(newWidth, newHeight)
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
    const frameScale = Math.min(Math.max(dt * 60, 0.25), 3)

    // Get live-tuned parameters from interaction, fallback to defaults
    const params = {
      particleSize: (interaction.parameters?.particleSize as number) || PARAMS.particleSize,
      interactionRadius: (interaction.parameters?.['speed'] as number) ? PARAMS.interactionRadius * ((interaction.parameters?.speed as number) || 1) : PARAMS.interactionRadius,
      chargeStrength: (interaction.parameters?.['brightness'] as number) ? PARAMS.chargeStrength * ((interaction.parameters?.brightness as number) || 1) : PARAMS.chargeStrength,
      velocityDamping: (interaction.parameters?.['speed'] as number) ? Math.pow(PARAMS.velocityDamping, ((interaction.parameters?.speed as number) || 1) * 0.5) : PARAMS.velocityDamping,
      beatResponsiveness: PARAMS.beatResponsiveness,
    }

    // Update particle material size if changed
    if (particleMaterial.size !== params.particleSize) {
      particleMaterial.size = params.particleSize
    }

    // Recalculate one third of the pair forces per frame and retain the other
    // two buckets from their latest frame. Every pair is still represented,
    // while spreading the O(n²) work over three animation frames avoids long
    // main-thread tasks and keeps the original 2,000-particle density.
    forceBucketIndex = (forceBucketIndex + 1) % forceBucketCount
    const bucketX = forceBucketsX[forceBucketIndex]
    const bucketY = forceBucketsY[forceBucketIndex]
    const bucketZ = forceBucketsZ[forceBucketIndex]
    for (let i = 0; i < particleCount; i++) {
      forceX[i] -= bucketX[i]
      forceY[i] -= bucketY[i]
      forceZ[i] -= bucketZ[i]
    }
    bucketX.fill(0)
    bucketY.fill(0)
    bucketZ.fill(0)

    // Age particles before evaluating whether they still participate in physics.
    for (let i = 0; i < particleCount; i++) particles[i].age += dt

    // Evaluate each pair once and apply equal/opposite forces.
    const interactionRadiusSquared = params.interactionRadius * params.interactionRadius
    for (let i = 0; i < particleCount - 1; i++) {
      const particle = particles[i]
      const particleAlive = particle.age <= particle.life

      let j = i + 1
      j += (forceBucketIndex - ((i + j) % forceBucketCount) + forceBucketCount) % forceBucketCount
      for (; j < particleCount; j += forceBucketCount) {
        const other = particles[j]
        const otherAlive = other.age <= other.life
        if (!particleAlive && !otherAlive) continue

        const dx = other.position.x - particle.position.x
        const dy = other.position.y - particle.position.y
        const dz = other.position.z - particle.position.z
        const distanceSquared = dx * dx + dy * dy + dz * dz
        if (distanceSquared < 0.0025 || distanceSquared > interactionRadiusSquared) continue

        const distance = Math.sqrt(distanceSquared)
        const magnitude = (particle.charge * other.charge * params.chargeStrength) / (distanceSquared + 0.5)
        const pairForceX = (dx / distance) * magnitude
        const pairForceY = (dy / distance) * magnitude
        const pairForceZ = (dz / distance) * magnitude

        if (particleAlive) {
          bucketX[i] += pairForceX
          bucketY[i] += pairForceY
          bucketZ[i] += pairForceZ
          forceX[i] += pairForceX
          forceY[i] += pairForceY
          forceZ[i] += pairForceZ
        }
        if (otherAlive) {
          bucketX[j] -= pairForceX
          bucketY[j] -= pairForceY
          bucketZ[j] -= pairForceZ
          forceX[j] -= pairForceX
          forceY[j] -= pairForceY
          forceZ[j] -= pairForceZ
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const particle = particles[i]

      // Only update physics for living particles
      if (particle.age <= particle.life) {
        particle.velocity.x += forceX[i] * 0.02 * frameScale
        particle.velocity.y += forceY[i] * 0.02 * frameScale
        particle.velocity.z += forceZ[i] * 0.02 * frameScale

        // Damping for drift trails
        particle.velocity.multiplyScalar(Math.pow(params.velocityDamping, frameScale))

        // Update position
        particle.position.addScaledVector(particle.velocity, frameScale)
      }

      // Update position in geometry (for both living and fading particles)
      particlePositions[i * 3] = particle.position.x
      particlePositions[i * 3 + 1] = particle.position.y
      particlePositions[i * 3 + 2] = particle.position.z

      // Update color: psychedelic cycling based on charge + pattern + time
      const ageRatio = particle.age / particle.life

      // Use palette colors with brightness variations, or HSL-based dynamic colors
      if (paletteColors) {
        // Get base palette color and vary brightness based on pattern energy
        const colorIndex = i % 3
        const baseColor = colorIndex === 0 ? orbColor1 : colorIndex === 1 ? orbColor2 : orbColor3
        workingColor.copy(baseColor)

        // Adjust brightness based on pattern energy
        const baseLightness = 0.55 * (1 - Math.min(1, ageRatio) * 0.3)
        const energyBoost = ageRatio <= 1 ?
          (pattern.lightIntensity * params.beatResponsiveness * 0.05 +
          pattern.frequency.peak * 0.08) : 0
        const finalBrightness = Math.min(0.65, baseLightness + energyBoost)

        // Apply brightness by blending with white
        workingColor.lerp(white, 1 - finalBrightness)
      } else {
        // Original HSL-based color generation
        const chargeHue = particle.charge > 0 ? colorPair.positive : colorPair.negative
        const baseHue = (chargeHue +
          pattern.colorShift * 0.2 +
          time * 0.0005 +
          i * 0.0001) % 1

        const saturation = 0.95 + Math.sin(time * 0.0003 + i * 0.01) * 0.05

        const baseLightness = Math.max(0, 0.55 * (1 - Math.min(1, ageRatio) * 0.3))
        const energyBoost = ageRatio <= 1 ?
          (pattern.lightIntensity * params.beatResponsiveness * 0.05 +
          pattern.frequency.peak * 0.08) : 0
        const lightness = Math.min(0.65, baseLightness + energyBoost)

        workingColor.setHSL(baseHue % 1, saturation, lightness)
      }

      particleColors[i * 3] = workingColor.r
      particleColors[i * 3 + 1] = workingColor.g
      particleColors[i * 3 + 2] = workingColor.b
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
    composer?.dispose()
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
