/**
 * PSYCHEDELIC TRON LIGHT CYCLES HERO
 * High-speed neon racing, particle explosions, energy waves
 * Visually spectacular - true Tron aesthetic
 */

import * as THREE from 'three'
import {
  createLightCycle,
  updateLightCycle,
  createTrailGeometries,
  createParticleExplosion,
  updateParticle,
  PSYCHEDELIC_PALETTE,
  LightCycle,
  Particle,
} from './lightCycles'

export interface SceneSetup {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  particleCount: number
  update: (time: number, mousePos: THREE.Vector3 | null, energizedLevel: number, clickPulseIntensity: number) => void
}

export const createVectorCloudScene = (canvas: HTMLCanvasElement): SceneSetup => {
  const width = window.innerWidth
  const height = window.innerHeight

  // Scene - Deep space background
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0010)

  // Camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 150

  // Renderer with tone mapping for dramatic lighting
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  })

  const dpr = Math.min(window.devicePixelRatio, 2)
  renderer.setPixelRatio(dpr)
  renderer.setSize(width, height)
  renderer.sortObjects = false
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.5

  // Create light cycles
  const cycleCount = 5
  const cycles: LightCycle[] = []
  const cycleColors = Object.values(PSYCHEDELIC_PALETTE).slice(0, cycleCount)

  for (let i = 0; i < cycleCount; i++) {
    cycles.push(createLightCycle(cycleColors[i]))
  }

  // Trail lines (will be updated each frame)
  const trailLines: THREE.Line[] = []
  const trailMaterial = new THREE.LineBasicMaterial({
    linewidth: 4,
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
  })

  cycles.forEach((cycle) => {
    const line = new THREE.Line(new THREE.BufferGeometry(), trailMaterial)
    scene.add(line)
    trailLines.push(line)
  })

  // Glow lights following cycles
  const lights: THREE.PointLight[] = []
  cycles.forEach((cycle) => {
    const light = new THREE.PointLight(cycle.color, 2, 300)
    light.position.copy(cycle.position)
    scene.add(light)
    lights.push(light)
  })

  // Ambient glow
  const ambientLight = new THREE.AmbientLight(0xff00ff, 0.15)
  scene.add(ambientLight)

  // Particles for explosions
  const particles: Particle[] = []

  // Psychedelic grid floor
  const gridGeometry = new THREE.BufferGeometry()
  const gridPositions: number[] = []
  const gridSize = 300
  const gridSpacing = 20

  for (let x = -gridSize; x <= gridSize; x += gridSpacing) {
    gridPositions.push(x, -gridSize, -80)
    gridPositions.push(x, gridSize, -80)
  }
  for (let y = -gridSize; y <= gridSize; y += gridSpacing) {
    gridPositions.push(-gridSize, y, -80)
    gridPositions.push(gridSize, y, -80)
  }

  gridGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gridPositions), 3))

  const gridMaterial = new THREE.LineBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.1,
  })

  const grid = new THREE.LineSegments(gridGeometry, gridMaterial)
  scene.add(grid)

  // Center sphere for visual anchor
  const sphereGeometry = new THREE.IcosahedronGeometry(3, 4)
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  })
  const centerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  scene.add(centerSphere)

  // Update function
  const update = (
    time: number,
    mousePos: THREE.Vector3 | null,
    energizedLevel: number,
    clickPulseIntensity: number
  ) => {
    // Update all light cycles
    cycles.forEach((cycle) => {
      updateLightCycle(cycle, time, mousePos)
    })

    // Update trail geometries
    const geometries = createTrailGeometries(cycles)
    geometries.forEach((geom, idx) => {
      trailLines[idx].geometry.dispose()
      trailLines[idx].geometry = geom
    })

    // Update light positions and intensity
    lights.forEach((light, idx) => {
      light.position.copy(cycles[idx].position)
      light.intensity = 2 + energizedLevel * 3 + clickPulseIntensity * 2
    })

    // Particle explosions on click
    if (clickPulseIntensity > 0.5) {
      cycles.forEach((cycle) => {
        if (Math.random() > 0.7) {
          const newParticles = createParticleExplosion(
            cycle.position.clone(),
            cycle.color,
            Math.floor(3 + clickPulseIntensity * 5)
          )
          particles.push(...newParticles)
        }
      })
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (!updateParticle(particles[i], 16)) {
        particles.splice(i, 1)
      }
    }

    // Rotate grid
    grid.rotation.x += 0.00002
    grid.rotation.y += 0.00005

    // Pulse center sphere
    const pulseScale = 1 + Math.sin(time * 0.003) * 0.2
    centerSphere.scale.set(pulseScale, pulseScale, pulseScale)
    centerSphere.rotation.x += 0.003
    centerSphere.rotation.y += 0.005

    // Energized state
    if (energizedLevel > 0.2) {
      const colorShift = Math.sin(time * 0.01) * energizedLevel
      grid.material.color.setHSL(colorShift * 0.3, 1, 0.5)
    }

    // Camera zoom on energized
    camera.position.z = 150 - energizedLevel * 30

    // Subtle camera drift
    camera.position.x = Math.sin(time * 0.0003) * 15
    camera.position.y = Math.cos(time * 0.00025) * 15
    camera.lookAt(0, 0, 0)
  }

  return {
    scene,
    camera,
    renderer,
    particleCount: cycleCount,
    update,
  }
}
