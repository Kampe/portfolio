/**
 * MILKDROP MORPHING THEME
 * Organic blob shapes with internal particle swarms
 *
 * Visual: Gooey, morphing blob structures (metaball-like) with flowing particles
 * inside/around them, rippling surfaces, psychedelic color bleeding
 *
 * Technical: Vertex displacement shaders + particle system + curl noise flow fields
 * Interaction: Cursor attracts both geometry and particles
 *
 * Performance: ~45-60fps on mid-range hardware
 * (geometry deformation + 1000 particles)
 */

import * as THREE from 'three'
import { SynthesizedPattern } from '../synthesis'
import { ThemeSetupResult, ThemeInteractionState, ThemeConfig } from './themeTypes'
import { curlNoise } from '../noise'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const CONFIG: ThemeConfig = {
  name: 'Milkdrop Morphing',
  description: 'Organic gooey blobs with particle swarms',
  colors: {
    primary: '#ff006e',
    secondary: '#00d4ff',
    tertiary: '#ffbe0b',
  },
  performance: {
    targetFps: 45,
    particleCount: 1000,
  },
}

// Vertex shader for morphing blob geometry
const blobVertexShader = `
  uniform float time;
  uniform float morphIntensity;
  uniform sampler2D noiseTex;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vMorph;

  void main() {
    vec3 displaced = position;

    // Perlin-like displacement using noise sampling
    float noiseFactor = morphIntensity * 0.5;

    // Multi-octave displacement for organic appearance
    displaced += normal * sin(time * 0.0001 + position.x * 0.1) * noiseFactor;
    displaced += normal * cos(time * 0.00015 + position.y * 0.1) * noiseFactor * 0.7;
    displaced += normal * sin(time * 0.00008 + position.z * 0.1) * noiseFactor * 0.5;

    // Scale pulsing
    float scale = 1.0 + sin(time * 0.0001) * morphIntensity * 0.3;
    displaced *= scale;

    vMorph = morphIntensity;
    vNormal = normalize(normalMatrix * normal);
    vPosition = vec3(modelViewMatrix * vec4(displaced, 1.0));

    gl_Position = projectionMatrix * vec4(vPosition, 1.0);
  }
`

// Fragment shader for blob with iridescent/psychedelic coloring
const blobFragmentShader = `
  uniform float time;
  uniform float colorShift;
  uniform float lightIntensity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vMorph;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    // Normal-based Fresnel effect: edges glow more
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - dot(viewDir, vNormal), 2.0);

    // Iridescent coloring: surface normal drives hue
    float hue = colorShift + fresnel * 0.3;
    float saturation = 0.8 + sin(time * 0.0001) * 0.2;
    // Much dimmer center, brighter edges
    float lightness = 0.35 + fresnel * 0.35;

    vec3 color = hsv2rgb(vec3(hue, saturation, lightness));

    // Reduced emissive glow - no more blinding center
    color += vec3(0.3) * fresnel * lightIntensity * 0.6;

    // Subtle specular (was too bright)
    vec3 lightDir = vec3(1.0, 1.0, 1.0);
    float spec = pow(max(dot(reflect(-lightDir, vNormal), viewDir), 0.0), 32.0);
    color += vec3(1.0) * spec * 0.2;

    gl_FragColor = vec4(color, 0.95);
  }
`

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  age: number
  life: number
}

export const createMilkdropMorphingTheme = (
  canvas: HTMLCanvasElement,
  userConfig?: Partial<ThemeConfig>
): ThemeSetupResult => {
  const width = window.innerWidth
  const height = window.innerHeight

  // ===== SCENE SETUP =====
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0e27)
  scene.fog = new THREE.FogExp2(0x0a0e27, 0.002)

  // ===== CAMERA =====
  const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000)
  camera.position.set(0, 0, 40)
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
    1.5,
    0.4,
    0.8
  )
  composer.addPass(bloomPass)

  // ===== MAIN BLOB GEOMETRY =====
  // Create a highly subdivided icosphere for smooth deformation
  const blobGeometry = new THREE.IcosahedronGeometry(10, 6)

  const blobUniforms = {
    time: { value: 0 },
    morphIntensity: { value: 0 },
    colorShift: { value: 0 },
    lightIntensity: { value: 0 },
    noiseTex: { value: null },
  }

  const blobMaterial = new THREE.ShaderMaterial({
    uniforms: blobUniforms,
    vertexShader: blobVertexShader,
    fragmentShader: blobFragmentShader,
    transparent: true,
    side: THREE.FrontSide,
    wireframe: false,
  })

  const blobMesh = new THREE.Mesh(blobGeometry, blobMaterial)
  scene.add(blobMesh)

  // ===== SECONDARY BLOB (smaller, offset) =====
  const blobGeometry2 = new THREE.IcosahedronGeometry(6, 5)
  const blobMesh2 = new THREE.Mesh(blobGeometry2, blobMaterial.clone())
  blobMesh2.position.set(15, 0, 0)
  scene.add(blobMesh2)

  // ===== PARTICLE SYSTEM =====
  const particleCount = 1000
  const particles: Particle[] = []

  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  const particleColors = new Float32Array(particleCount * 3)

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      ),
      velocity: new THREE.Vector3(0, 0, 0),
      age: 0,
      life: Math.random() * 3 + 2,
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
    size: 1.5,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const particleMesh = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particleMesh)

  // ===== LIGHTING =====
  const ambientLight = new THREE.AmbientLight(0x1a3a5a, 0.5)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xff006e, 2.5, 100)
  pointLight.position.set(30, 20, 30)
  scene.add(pointLight)

  const pointLight2 = new THREE.PointLight(0x00d4ff, 2.5, 100)
  pointLight2.position.set(-30, -20, 30)
  scene.add(pointLight2)

  // ===== INTERACTION STATE =====
  let blobRotation = 0

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
    // Update blob uniforms
    blobUniforms.time.value = time * 0.001
    blobUniforms.morphIntensity.value = pattern.morphIntensity + interaction.energizedLevel * 0.3
    blobUniforms.colorShift.value = pattern.colorShift
    blobUniforms.lightIntensity.value = pattern.lightIntensity

    // Rotation
    blobRotation += pattern.spatialFlow * 0.002 + interaction.energizedLevel * 0.005
    blobMesh.rotation.x = blobRotation * 0.5
    blobMesh.rotation.y = blobRotation
    blobMesh.rotation.z = blobRotation * 0.3

    blobMesh2.rotation.x = -blobRotation * 0.3
    blobMesh2.rotation.y = blobRotation * 0.7
    blobMesh2.position.x = 15 + Math.sin(time * 0.0001) * 5

    // Scale pulsing
    const baseScale = 1.0 + pattern.geometryScale * 0.3
    blobMesh.scale.setScalar(baseScale)
    blobMesh2.scale.setScalar(baseScale * 0.6)

    // Update particles
    const posArray = particleGeometry.attributes.position.array as Float32Array
    const colorArray = particleGeometry.attributes.color.array as Float32Array

    particles.forEach((p, idx) => {
      // Age particle
      p.age += 0.016 // ~60fps
      if (p.age > p.life) {
        p.age = 0
        p.position.set(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40
        )
        p.velocity.set(0, 0, 0)
      }

      // Curl noise flow field
      const flow = curlNoise(
        p.position.x * 0.05,
        p.position.y * 0.05,
        p.position.z * 0.05 + time * 0.0001
      )

      // Apply flow as acceleration
      p.velocity.add(
        new THREE.Vector3(flow.x, flow.y, flow.z).multiplyScalar(pattern.particleVelocity * 0.1)
      )

      // Damping
      p.velocity.multiplyScalar(0.95)

      // Cursor attraction
      if (interaction.cursor.position) {
        const towardsCursor = new THREE.Vector3()
          .subVectors(interaction.cursor.position, p.position)
          .normalize()
          .multiplyScalar(interaction.cursor.strength * 0.5)

        p.velocity.add(towardsCursor)
      }

      // Update position
      p.position.add(p.velocity)

      // Bounds
      const bound = 50
      if (p.position.length() > bound) {
        p.position.normalize().multiplyScalar(bound)
        p.velocity.negate().multiplyScalar(0.5)
      }

      // Update buffer
      posArray[idx * 3] = p.position.x
      posArray[idx * 3 + 1] = p.position.y
      posArray[idx * 3 + 2] = p.position.z

      // Color from age and hue
      const lifeRatio = p.age / p.life
      const hue = (pattern.colorShift + idx / particleCount + time * 0.00001) % 1
      const color = new THREE.Color().setHSL(hue, 1 - lifeRatio * 0.5, 0.5 + lifeRatio * 0.3)

      colorArray[idx * 3] = color.r
      colorArray[idx * 3 + 1] = color.g
      colorArray[idx * 3 + 2] = color.b
    })

    particleGeometry.attributes.position.needsUpdate = true
    particleGeometry.attributes.color.needsUpdate = true

    // Light intensity pulsing
    pointLight.intensity = 2.5 + pattern.lightIntensity * 1.5
    pointLight2.intensity = 2.5 + pattern.lightIntensity * 1.5

    // Click pulse: emit particles
    if (interaction.clickPulse > 0) {
      const emitCount = Math.floor(interaction.clickPulse * 20)
      for (let i = 0; i < emitCount && i < particles.length; i++) {
        particles[i].velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5
        )
      }
    }

    // Camera drift
    camera.position.x = Math.sin(time * 0.00005) * 10
    camera.position.y = Math.cos(time * 0.00003) * 5
  }

  // ===== DISPOSAL =====
  const dispose = () => {
    window.removeEventListener('resize', handleResize)

    blobGeometry.dispose()
    blobGeometry2.dispose()
    particleGeometry.dispose()
    blobMaterial.dispose()
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
