/**
 * CHARGED MAGNETOSPHERE THEME
 * Inspired by Robert Hodgin's Magnetosphere visualizer
 *
 * Visual: A loose field of charged particles drifting through depth. Subtle
 * attraction and repulsion create brief clusters without imposing a shape,
 * while additive blending preserves the original glowing character.
 *
 * Physics: Each particle has a charge (+/-). A curl-like flow field, one stable
 * charge partner, and pointer impulses create emergent motion in linear time.
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
  description: 'A sparse, layered field of softly glowing charged particles',
  colors: {
    primary: '#ff006e',
    secondary: '#00d4ff',
    tertiary: '#ffbe0b',
  },
  performance: {
    targetFps: 50,
    particleCount: 132,
  },
}

// ===== CONFIGURATION KNOBS =====
const PARAMS = {
  particleCount: 132,
  particleSize: 2.55,
  bloomStrength: 0.45,
  bloomRadius: 0.4,
  bloomThreshold: 0.5,
  toneMappingExposure: 0.85, // Slightly reduced brightness
  interactionRadius: 42,
  chargeRadius: 38,
  chargeStrength: 0.0011,
  flowStrength: 0.00032,
  safeZoneStrength: 0.0018,
  velocityDamping: 0.981,
  maxVelocity: 0.064,
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
  driftScale: number
  partnerIndex: number
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
  const cameraDistance = width < 768 ? 120 : 108

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
  // Preserve the sparse original composition while scaling down on phones and
  // constrained renderers.
  const particleCount = isConstrainedRenderer ? 48 : prefersReducedMotion ? 60 : width < 768 ? 72 : PARAMS.particleCount
  const particles: ChargedParticle[] = []

  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  const particleColors = new Float32Array(particleCount * 3)
  const workingColor = new THREE.Color()
  const white = new THREE.Color(1, 1, 1)
  const fieldHalfWidth = width < 768 ? 58 : 138
  const fieldHalfHeight = width < 768 ? 112 : 94
  const fieldHalfDepth = 54
  const safeHalfWidth = width < 768 ? 42 : 58
  const safeHalfHeight = width < 768 ? 48 : 34

  // Shape the original random cloud instead of forcing it into a ring. Initial
  // placement leaves breathing room around the hero copy while depth produces
  // the mix of pinpoints and larger glowing orbs.
  for (let i = 0; i < particleCount; i++) {
    const charge = Math.random() > 0.5 ? 1 : -1
    const phase = Math.random() * Math.PI * 2
    const depthMix = Math.random()
    const zOffset = depthMix < 0.2
      ? 26 + Math.random() * 26
      : depthMix < 0.65
        ? -15 + Math.random() * 41
        : -fieldHalfDepth + Math.random() * 39
    const perspectiveScale = (cameraDistance - zOffset) / cameraDistance
    let x = 0
    let y = 0
    for (let attempt = 0; attempt < 8; attempt++) {
      x = (Math.random() - 0.5) * fieldHalfWidth * perspectiveScale * 2
      y = (Math.random() - 0.5) * fieldHalfHeight * perspectiveScale * 2
      const safeWidthAtDepth = safeHalfWidth * perspectiveScale
      const safeHeightAtDepth = safeHalfHeight * perspectiveScale
      const safeDistance = (x * x) / (safeWidthAtDepth * safeWidthAtDepth) +
        (y * y) / (safeHeightAtDepth * safeHeightAtDepth)
      if (safeDistance >= 1) break
    }

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
        randomStartX + x,
        randomStartY + y,
        randomStartZ + zOffset
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.016,
        (Math.random() - 0.5) * 0.016,
        (Math.random() - 0.5) * 0.011
      ),
      charge,
      color,
      age: Math.random() * 10,
      life: 8 + Math.random() * 8,
      phase,
      driftScale: 0.65 + Math.random() * 0.7,
      partnerIndex: (i * 37 + 17) % particleCount,
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
    opacity: 0.8,
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
    const flowEnergy = (0.55 + pattern.spatialFlow * 0.55 + interaction.energizedLevel * 0.55) * speed * motionScale
    const pulse = pattern.frequency.low * 0.7 + pattern.frequency.peak * 0.3
    const damping = Math.pow(PARAMS.velocityDamping, frameScale)
    const maximumVelocity = PARAMS.maxVelocity * (0.8 + pattern.particleVelocity * 0.2 + interaction.energizedLevel * 0.25)
    const maximumVelocitySquared = maximumVelocity * maximumVelocity
    const cursor = interaction.cursor.position
    const cursorX = cursor ? randomStartX + cursor.x * 0.72 : 0
    const cursorY = cursor ? randomStartY + cursor.y * 0.72 : 0
    const cursorZ = randomStartZ
    const interactionRadius = PARAMS.interactionRadius * (1 + interaction.clickPulse * 0.35)
    const interactionRadiusSquared = interactionRadius * interactionRadius
    const chargeRadiusSquared = PARAMS.chargeRadius * PARAMS.chargeRadius

    const animatedParticleSize = particleSize * (0.98 + pulse * 0.04)
    if (particleMaterial.size !== animatedParticleSize) {
      particleMaterial.size = animatedParticleSize
    }

    for (let i = 0; i < particleCount; i++) {
      const particle = particles[i]
      particle.age = (particle.age + dt) % particle.life

      const relativeX = particle.position.x - randomStartX
      const relativeY = particle.position.y - randomStartY
      const relativeZ = particle.position.z - randomStartZ

      // Slow, layered curl gives every depth plane a slightly different path.
      // Nearby particles naturally render larger because sizeAttenuation is on;
      // distant particles remain small and sharp instead of forming one flat halo.
      const flowTime = seconds * 0.18
      const flowX = Math.sin(relativeY * 0.018 + flowTime + particle.phase) +
        Math.cos(relativeZ * 0.021 - flowTime * 0.7)
      const flowY = Math.cos(relativeX * 0.014 - flowTime * 0.8 + particle.phase * 0.5) +
        Math.sin(relativeZ * 0.017 + flowTime)
      const flowZ = Math.sin((relativeX + relativeY) * 0.012 + flowTime * 0.6 + particle.phase)
      const turbulence = PARAMS.flowStrength * particle.driftScale *
        (0.5 + pattern.spatialTurbulence * 0.6) * flowEnergy

      particle.velocity.x += flowX * turbulence * frameScale
      particle.velocity.y += flowY * turbulence * frameScale
      particle.velocity.z += flowZ * turbulence * 0.7 * frameScale

      // One stable partner preserves a hint of the original charged-particle
      // behavior without the old O(n squared) cost or dense particle clumps.
      const partner = particles[particle.partnerIndex]
      const partnerDeltaX = partner.position.x - particle.position.x
      const partnerDeltaY = partner.position.y - particle.position.y
      const partnerDeltaZ = partner.position.z - particle.position.z
      const partnerDistanceSquared = partnerDeltaX * partnerDeltaX +
        partnerDeltaY * partnerDeltaY + partnerDeltaZ * partnerDeltaZ
      if (partnerDistanceSquared > 0.05 && partnerDistanceSquared < chargeRadiusSquared) {
        const partnerDistance = Math.sqrt(partnerDistanceSquared)
        const chargeFalloff = 1 - partnerDistance / PARAMS.chargeRadius
        const chargeForce = particle.charge * partner.charge * PARAMS.chargeStrength *
          chargeFalloff * flowEnergy
        const inversePartnerDistance = 1 / partnerDistance
        particle.velocity.x += partnerDeltaX * inversePartnerDistance * chargeForce * frameScale
        particle.velocity.y += partnerDeltaY * inversePartnerDistance * chargeForce * frameScale
        particle.velocity.z += partnerDeltaZ * inversePartnerDistance * chargeForce * 0.65 * frameScale
      }

      // Keep a perspective-correct reading area around the centered hero copy.
      // Its world-space size grows with distance so the gap looks consistent on
      // screen across near, middle, and far particle layers.
      const perspectiveScale = Math.max(0.45, (cameraDistance - relativeZ) / cameraDistance)
      const safeWidthAtDepth = safeHalfWidth * perspectiveScale
      const safeHeightAtDepth = safeHalfHeight * perspectiveScale
      const safeDistance = (relativeX * relativeX) / (safeWidthAtDepth * safeWidthAtDepth) +
        (relativeY * relativeY) / (safeHeightAtDepth * safeHeightAtDepth)
      if (safeDistance < 1) {
        const centerDistance = Math.hypot(relativeX, relativeY)
        const directionX = centerDistance > 0.001 ? relativeX / centerDistance : Math.cos(particle.phase)
        const directionY = centerDistance > 0.001 ? relativeY / centerDistance : Math.sin(particle.phase)
        const safeZoneForce = (1 - safeDistance) * PARAMS.safeZoneStrength
        particle.velocity.x += directionX * safeZoneForce * frameScale
        particle.velocity.y += directionY * safeZoneForce * frameScale
      }

      // Pointer movement bends the field; taps create a short radial pulse.
      if (cursor) {
        const cursorDeltaX = particle.position.x - cursorX
        const cursorDeltaY = particle.position.y - cursorY
        const cursorDeltaZ = particle.position.z - cursorZ
        const cursorDistanceSquared = cursorDeltaX * cursorDeltaX + cursorDeltaY * cursorDeltaY + cursorDeltaZ * cursorDeltaZ
        if (cursorDistanceSquared > 0.001 && cursorDistanceSquared < interactionRadiusSquared) {
          const cursorDistance = Math.sqrt(cursorDistanceSquared)
          const falloff = 1 - cursorDistance / interactionRadius
          const pointerForce = falloff * falloff * (0.005 + interaction.clickPulse * 0.06) * interaction.cursor.strength
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

      // Wrap each depth plane independently. Scaling the horizontal and vertical
      // bounds by camera distance keeps the sparse composition stable in screen
      // space while particles drift forward and backward through z.
      const updatedRelativeZ = particle.position.z - randomStartZ
      const updatedPerspectiveScale = Math.max(0.45, (cameraDistance - updatedRelativeZ) / cameraDistance)
      const horizontalBound = fieldHalfWidth * updatedPerspectiveScale
      const verticalBound = fieldHalfHeight * updatedPerspectiveScale
      const updatedRelativeX = particle.position.x - randomStartX
      const updatedRelativeY = particle.position.y - randomStartY
      if (updatedRelativeX > horizontalBound) particle.position.x = randomStartX - horizontalBound
      else if (updatedRelativeX < -horizontalBound) particle.position.x = randomStartX + horizontalBound
      if (updatedRelativeY > verticalBound) particle.position.y = randomStartY - verticalBound
      else if (updatedRelativeY < -verticalBound) particle.position.y = randomStartY + verticalBound
      if (updatedRelativeZ > fieldHalfDepth) particle.position.z = randomStartZ - fieldHalfDepth
      else if (updatedRelativeZ < -fieldHalfDepth) particle.position.z = randomStartZ + fieldHalfDepth

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

    // A barely perceptible camera wander revives the original depth parallax
    // without making the page feel like it is sliding underneath the reader.
    camera.position.set(
      randomStartX + (Math.sin(seconds * 0.05) * 6 + Math.cos(seconds * 0.032) * 3) * motionScale,
      randomStartY + Math.cos(seconds * 0.045) * 4 * motionScale,
      randomStartZ + cameraDistance + Math.sin(seconds * 0.036) * 4 * motionScale
    )
    camera.lookAt(
      randomStartX + Math.sin(seconds * 0.039) * 4 * motionScale,
      randomStartY + Math.cos(seconds * 0.033) * 3 * motionScale,
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
