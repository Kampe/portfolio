/**
 * MILKDROP MORPHING THEME
 * Psychedelic particle swarms with curl noise physics
 *
 * Visual: 1200 flowing particles with HSL color fading,
 * curl noise-driven motion, additive blending for glow effect
 *
 * Interaction: Particles respond to energized level
 *
 * Performance: ~50-60fps on desktop, 30-45fps mobile
 */

import * as THREE from 'three'
import { SynthesizedPattern } from '../synthesis'
import { ThemeSetupResult, ThemeInteractionState, ThemeConfig } from './themeTypes'
import { curlNoise } from '../noise'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const CONFIG: ThemeConfig = {
  name: 'Milkdrop',
  description: 'Psychedelic particle swarms',
  colors: {
    primary: '#ff006e',
    secondary: '#00d4ff',
    tertiary: '#ffbe0b',
  },
  performance: {
    targetFps: 50,
    particleCount: 1200,
  },
}

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  age: number
  life: number
}

export const createDMTMorphingTheme = (
  canvas: HTMLCanvasElement,
  userConfig?: Partial<ThemeConfig>
): ThemeSetupResult => {
  const width = window.innerWidth
  const height = window.innerHeight

  // ===== SCENE SETUP =====
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0012)
  scene.fog = new THREE.FogExp2(0x0a0012, 0.001)

  // ===== CAMERA =====
  const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000)
  camera.position.set(0, 0, 50)
  camera.lookAt(0, 0, 0)

  // ===== RENDERER =====
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  const dpr = Math.min(window.devicePixelRatio, 1.5)
  renderer.setPixelRatio(dpr)
  renderer.setSize(width, height)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.4

  // ===== POSTPROCESSING =====
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.4,
    0.5,
    0.75
  )
  composer.addPass(bloomPass)

  // ===== PARTICLE SYSTEM (Milkdrop-style) =====
  const particleCount = 1200
  const particles: Particle[] = []

  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  const particleColors = new Float32Array(particleCount * 3)

  // Initialize particles with wider spread around geometry
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      ),
      age: 0,
      life: Math.random() * 4 + 3,
    })

    particlePositions[i * 3] = particles[i].position.x
    particlePositions[i * 3 + 1] = particles[i].position.y
    particlePositions[i * 3 + 2] = particles[i].position.z

    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 1, 0.6)
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
  gradient.addColorStop(0.5, 'rgba(255, 150, 255, 0.5)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const glowTexture = new THREE.CanvasTexture(glowCanvas)

  const particleMaterial = new THREE.PointsMaterial({
    map: glowTexture,
    color: 0xffffff,
    vertexColors: true,
    size: 1.8,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const particleMesh = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particleMesh)

  // ===== LIGHTING =====
  const ambientLight = new THREE.AmbientLight(0x1a0a2e, 0.3)
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
    // Update particles with curl noise
    const particlePositions = particleGeometry.attributes.position.array as Float32Array
    const particleColors = particleGeometry.attributes.color.array as Float32Array
    const dt = interaction.deltaTime || 1 / 60 // Use actual delta time, fallback to 60fps

    for (let i = 0; i < particleCount; i++) {
      const particle = particles[i]

      particle.age += dt

      if (particle.age > particle.life) {
        particle.age = 0
        particle.position.set(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60
        )
      }

      // Curl noise attraction toward center
      const curl = curlNoise(
        particle.position.x * 0.02,
        particle.position.y * 0.02,
        particle.position.z * 0.02 + time * 0.0001
      )

      particle.velocity.x += curl.x * 0.08
      particle.velocity.y += curl.y * 0.08
      particle.velocity.z += curl.z * 0.08

      // Damping
      particle.velocity.multiplyScalar(0.98)

      // Attraction to center
      const toCenter = new THREE.Vector3().copy(particle.position).negate().normalize()
      particle.velocity.addScaledVector(toCenter, 0.15)

      // Update position
      particle.position.addScaledVector(particle.velocity, 1.0)

      particlePositions[i * 3] = particle.position.x
      particlePositions[i * 3 + 1] = particle.position.y
      particlePositions[i * 3 + 2] = particle.position.z

      // Color fade based on age
      const ageRatio = particle.age / particle.life
      const hue = (pattern.colorShift + Math.random() * 0.2) % 1
      const saturation = 0.8 + Math.sin(time * 0.0001 + i) * 0.2
      const lightness = 0.6 * (1 - ageRatio) + 0.2 // Fade out at end of life

      const color = new THREE.Color().setHSL(hue, saturation, lightness)
      particleColors[i * 3] = color.r
      particleColors[i * 3 + 1] = color.g
      particleColors[i * 3 + 2] = color.b
    }

    ;(particleGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
    ;(particleGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true
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
