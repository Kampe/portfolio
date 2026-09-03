/**
 * CHARGED MAGNETOSPHERE THEME
 * Inspired by Robert Hodgin's Magnetosphere visualizer
 *
 * Visual: Charged particles travelling through layered magnetic flow fields.
 * Opposite charges counter-rotate through breathing orbital ribbons while
 * additive blending creates the original glowing "trippiness".
 *
 * Physics: Each particle has a charge (+/-). A bounded orbital field, curl-like
 * drift, and pointer impulses create emergent motion in linear time.
 *
 * Performance: O(n) per frame; targets 60fps desktop and smooth mobile motion.
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
  particleCount: 1200,
  particleSize: 2.05,
  bloomStrength: 0.34,
  bloomRadius: 0.4,
  bloomThreshold: 0.5,
  toneMappingExposure: 0.85, // Slightly reduced brightness
  interactionRadius: 48,
  orbitStrength: 0.005,
  shellStrength: 0.0016,
  depthStrength: 0.0014,
  flowStrength: 0.0009,
  velocityDamping: 0.955,
  maxVelocity: 0.22,
  beatResponsiveness: 2.5, // Strong response to pattern energy
}

interface ChargedParticle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  charge: number // +1 or -1
  color: THREE.Color
  age: number
  life: number
  phase: number
  orbitRadius: number
  depthAmplitude: number
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
  const randomStartX = (Math.random() - 0.5) * 12
  const randomStartY = (Math.random() - 0.5) * 10
  const randomStartZ = Math.random() * 40 + 50
  const cameraDistance = width < 768 ? 126 : 112

  // ===== SCENE SETUP =====
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0012)
  scene.fog = new THREE.FogExp2(0x0a0012, 0.0005)

  // ===== CAMERA =====
  const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000)
  camera.position.set(randomStartX, randomStartY, randomStartZ + cameraDistance)
  camera.lookAt(randomStartX, randomStartY, randomStartZ)

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
  // Scale density by capability and viewport so the animation frames the copy
  // instead of competing with it, especially on phones.
  const particleCount = isConstrainedRenderer ? 140 : prefersReducedMotion ? 260 : width < 768 ? 480 : PARAMS.particleCount
  const particles: ChargedParticle[] = []

  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  const particleColors = new Float32Array(particleCount * 3)
  const workingColor = new THREE.Color()
  const white = new THREE.Color(1, 1, 1)
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const horizontalScale = Math.min(1.15, Math.max(0.55, width / height))
  const verticalScale = width < 768 ? 1.08 : 0.78

  // Distribute particles through a wide band of gently warped orbits. Fibonacci
  // spacing supplies even coverage; radial variation keeps it organic.
  for (let i = 0; i < particleCount; i++) {
    const charge = Math.random() > 0.5 ? 1 : -1
    const phase = i * goldenAngle + (Math.random() - 0.5) * 0.35
    const orbitRadius = (width < 768 ? 58 : 52) + Math.random() * 56
    const depthAmplitude = 8 + Math.random() * 17
    const radialJitter = (Math.random() - 0.5) * 8
    const radius = orbitRadius + radialJitter
    const initialDepth = Math.sin(phase * (1.45 + (i % 5) * 0.08)) * depthAmplitude

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
        randomStartX + Math.cos(phase) * radius * horizontalScale,
        randomStartY + Math.sin(phase) * radius * verticalScale,
        randomStartZ + initialDepth + (Math.random() - 0.5) * 8
      ),
      velocity: new THREE.Vector3(
        -Math.sin(phase) * charge * 0.022 * horizontalScale,
        Math.cos(phase) * charge * 0.022 * verticalScale,
        Math.cos(phase * 1.7) * 0.008
      ),
      charge,
      color,
      age: Math.random() * 10,
      life: 8 + Math.random() * 8,
      phase,
      orbitRadius,
      depthAmplitude,
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
    opacity: 0.72,
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
    const dt = interaction.deltaTime || 1 / 60
    const frameScale = Math.min(Math.max(dt * 60, 0.25), 3)
    const seconds = time * 0.001
    const motionScale = prefersReducedMotion ? 0.28 : 1

    const speed = typeof interaction.parameters?.speed === 'number' ? interaction.parameters.speed : 1
    const brightness = typeof interaction.parameters?.brightness === 'number' ? interaction.parameters.brightness : 1
    const particleSize = typeof interaction.parameters?.particleSize === 'number'
      ? interaction.parameters.particleSize
      : PARAMS.particleSize
    const flowEnergy = (0.65 + pattern.spatialFlow * 0.65 + interaction.energizedLevel * 0.8) * speed * motionScale
    const pulse = pattern.frequency.low * 0.7 + pattern.frequency.peak * 0.3
    const damping = Math.pow(PARAMS.velocityDamping, frameScale)
    const maximumVelocity = PARAMS.maxVelocity * (0.8 + pattern.particleVelocity * 0.28 + interaction.energizedLevel * 0.4)
    const maximumVelocitySquared = maximumVelocity * maximumVelocity
    const cursor = interaction.cursor.position
    const cursorX = cursor ? randomStartX + cursor.x * 0.72 : 0
    const cursorY = cursor ? randomStartY + cursor.y * 0.72 : 0
    const cursorZ = randomStartZ
    const interactionRadius = PARAMS.interactionRadius * (1 + interaction.clickPulse * 0.35)
    const interactionRadiusSquared = interactionRadius * interactionRadius

    const animatedParticleSize = particleSize * (0.96 + pulse * 0.06)
    if (particleMaterial.size !== animatedParticleSize) {
      particleMaterial.size = animatedParticleSize
    }

    for (let i = 0; i < particleCount; i++) {
      const particle = particles[i]
      particle.age = (particle.age + dt) % particle.life

      const relativeX = (particle.position.x - randomStartX) / horizontalScale
      const relativeY = (particle.position.y - randomStartY) / verticalScale
      const relativeZ = particle.position.z - randomStartZ
      const radialDistance = Math.max(0.001, Math.hypot(relativeX, relativeY))
      const inverseRadius = 1 / radialDistance
      const targetRadius = particle.orbitRadius * (0.95 + pulse * 0.08 + Math.sin(seconds * 0.38 + particle.phase) * 0.035)
      const radialForce = (targetRadius - radialDistance) * PARAMS.shellStrength
      const orbitalForce = PARAMS.orbitStrength * particle.charge * flowEnergy
      const targetDepth = Math.sin(particle.phase * 1.7 + seconds * (0.32 + particle.charge * 0.04)) * particle.depthAmplitude

      // A layered, curl-like field bends the clean orbits into slowly changing
      // ribbons without allocating noise vectors or evaluating every pair.
      const flowX = Math.sin(relativeY * 0.075 + seconds * 0.47 + particle.phase)
      const flowY = Math.sin(relativeZ * 0.038 - seconds * 0.31 + particle.phase * 0.5)
      const flowZ = Math.cos(relativeX * 0.042 + seconds * 0.41 - particle.phase * 0.35)
      const turbulence = PARAMS.flowStrength * (0.45 + pattern.spatialTurbulence * 0.8) * flowEnergy

      particle.velocity.x += (
        (relativeX * inverseRadius * radialForce - relativeY * inverseRadius * orbitalForce) * horizontalScale +
        flowX * turbulence
      ) * frameScale
      particle.velocity.y += (
        (relativeY * inverseRadius * radialForce + relativeX * inverseRadius * orbitalForce) * verticalScale +
        flowY * turbulence
      ) * frameScale
      particle.velocity.z += (
        (targetDepth - relativeZ) * PARAMS.depthStrength +
        flowZ * turbulence
      ) * frameScale

      // Pointer movement bends the field; taps create a short radial pulse.
      if (cursor) {
        const cursorDeltaX = particle.position.x - cursorX
        const cursorDeltaY = particle.position.y - cursorY
        const cursorDeltaZ = particle.position.z - cursorZ
        const cursorDistanceSquared = cursorDeltaX * cursorDeltaX + cursorDeltaY * cursorDeltaY + cursorDeltaZ * cursorDeltaZ
        if (cursorDistanceSquared > 0.001 && cursorDistanceSquared < interactionRadiusSquared) {
          const cursorDistance = Math.sqrt(cursorDistanceSquared)
          const falloff = 1 - cursorDistance / interactionRadius
          const pointerForce = falloff * falloff * (0.006 + interaction.clickPulse * 0.08) * interaction.cursor.strength
          const inverseCursorDistance = 1 / cursorDistance
          particle.velocity.x += cursorDeltaX * inverseCursorDistance * pointerForce * frameScale
          particle.velocity.y += cursorDeltaY * inverseCursorDistance * pointerForce * frameScale
          particle.velocity.z += cursorDeltaZ * inverseCursorDistance * pointerForce * frameScale
        }
      }

      particle.velocity.multiplyScalar(damping)
      const velocitySquared = particle.velocity.lengthSq()
      if (velocitySquared > maximumVelocitySquared) {
        particle.velocity.multiplyScalar(maximumVelocity / Math.sqrt(velocitySquared))
      }
      particle.position.addScaledVector(particle.velocity, frameScale)

      // Stream the simulated position into the GPU geometry.
      particlePositions[i * 3] = particle.position.x
      particlePositions[i * 3 + 1] = particle.position.y
      particlePositions[i * 3 + 2] = particle.position.z

      // Update color: psychedelic cycling based on charge + pattern + time
      const agePhase = particle.age / particle.life

      // Use palette colors with brightness variations, or HSL-based dynamic colors
      if (paletteColors) {
        // Get base palette color and vary brightness based on pattern energy
        const colorIndex = i % 3
        const baseColor = colorIndex === 0 ? orbColor1 : colorIndex === 1 ? orbColor2 : orbColor3
        workingColor.copy(baseColor)

        const shimmer = Math.sin(agePhase * Math.PI * 2 + particle.phase + seconds * 0.7) * 0.5 + 0.5
        const energyBoost = (pattern.lightIntensity * PARAMS.beatResponsiveness * 0.018 + pattern.frequency.peak * 0.08) * brightness
        workingColor.lerp(white, Math.min(0.28, 0.05 + shimmer * 0.1 + energyBoost))
      } else {
        // Original HSL-based color generation
        const chargeHue = particle.charge > 0 ? colorPair.positive : colorPair.negative
        const baseHue = (chargeHue +
          pattern.colorShift * 0.2 +
          time * 0.0005 +
          i * 0.0001) % 1

        const saturation = 0.95 + Math.sin(time * 0.0003 + i * 0.01) * 0.05

        const shimmer = Math.sin(agePhase * Math.PI * 2 + particle.phase) * 0.04
        const energyBoost = (pattern.lightIntensity * PARAMS.beatResponsiveness * 0.025 + pattern.frequency.peak * 0.06) * brightness
        const lightness = Math.min(0.65, 0.44 + shimmer + energyBoost)

        workingColor.setHSL(baseHue % 1, saturation, lightness)
      }

      particleColors[i * 3] = workingColor.r
      particleColors[i * 3 + 1] = workingColor.g
      particleColors[i * 3 + 2] = workingColor.b
    }

    ;(particleGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
    ;(particleGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true

    // Slow camera parallax reveals depth without pulling the particle field away
    // from the hero content, which was the main weakness of the old wide drift.
    camera.position.set(
      randomStartX + Math.sin(seconds * 0.11) * 7 * motionScale,
      randomStartY + Math.cos(seconds * 0.09) * 5 * motionScale,
      randomStartZ + cameraDistance
    )
    camera.lookAt(
      randomStartX + Math.sin(seconds * 0.07) * 3,
      randomStartY + Math.cos(seconds * 0.08) * 2,
      randomStartZ
    )
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
