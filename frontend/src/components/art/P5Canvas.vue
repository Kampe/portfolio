<template>
  <div class="fixed inset-0 bg-black overflow-hidden">
    <div ref="container" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref<HTMLDivElement>()
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number
let particles: THREE.Points | null = null
let positions: Float32Array
let originalPositions: Float32Array
let velocities: Float32Array
let mouseX = 0
let mouseY = 0
let targetMouseX = 0
let targetMouseY = 0
let time = 0
let particleCount = 0
let geometryShapes: THREE.Mesh[] = []

const createScene = () => {
  // Scene setup
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  scene.fog = new THREE.Fog(0x000000, 150, 500)

  // Camera setup
  const width = window.innerWidth
  const height = window.innerHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 45

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value?.appendChild(renderer.domElement)

  // Create subtle particle background
  const geometry = new THREE.BufferGeometry()
  particleCount = 2000
  positions = new Float32Array(particleCount * 3)
  originalPositions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  // Generate particles in background
  const gridSize = Math.ceil(Math.pow(particleCount, 1 / 3))
  let idx = 0
  for (let i = 0; i < gridSize && idx < particleCount; i++) {
    for (let j = 0; j < gridSize && idx < particleCount; j++) {
      for (let k = 0; k < gridSize && idx < particleCount; k++) {
        const x = (i / gridSize - 0.5) * 140
        const y = (j / gridSize - 0.5) * 140
        const z = (k / gridSize - 0.5) * 100 + Math.sin(x * 0.015) * Math.cos(y * 0.015) * 25

        positions[idx * 3] = x
        positions[idx * 3 + 1] = y
        positions[idx * 3 + 2] = z

        originalPositions[idx * 3] = x
        originalPositions[idx * 3 + 1] = y
        originalPositions[idx * 3 + 2] = z

        // Cyan to blue to purple gradient - more subtle
        const gradient = (Math.random() + idx / particleCount) % 1
        if (gradient < 0.33) {
          colors[idx * 3] = 0.3 + Math.random() * 0.3
          colors[idx * 3 + 1] = 0.6 + Math.random() * 0.2
          colors[idx * 3 + 2] = 0.9 + Math.random() * 0.1
        } else if (gradient < 0.66) {
          colors[idx * 3] = 0.2 + Math.random() * 0.2
          colors[idx * 3 + 1] = 0.3 + Math.random() * 0.3
          colors[idx * 3 + 2] = 0.9 + Math.random() * 0.1
        } else {
          colors[idx * 3] = 0.5 + Math.random() * 0.2
          colors[idx * 3 + 1] = 0.2 + Math.random() * 0.2
          colors[idx * 3 + 2] = 0.8 + Math.random() * 0.2
        }

        idx++
      }
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    sizeAttenuation: true,
    opacity: 0.4,
    transparent: true
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  // Create geometric shapes
  createGeometricShapes()

  // Handle mouse movement
  window.addEventListener('mousemove', (event) => {
    targetMouseX = (event.clientX / window.innerWidth) * 2 - 1
    targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1
  })

  // Handle window resize
  window.addEventListener('resize', onWindowResize)

  // Start animation loop
  animate()
}

const createGeometricShapes = () => {
  // Create rotating icosahedrons
  const icosaGeometry = new THREE.IcosahedronGeometry(3, 2)
  const materials = [
    new THREE.MeshPhongMaterial({ color: 0x00d4ff, emissive: 0x0099cc, wireframe: false }),
    new THREE.MeshPhongMaterial({ color: 0x3b82f6, emissive: 0x0066ff, wireframe: false }),
    new THREE.MeshPhongMaterial({ color: 0x8b5cf6, emissive: 0x6d28d9, wireframe: false })
  ]

  // Position icosahedrons in a circle
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2
    const mesh = new THREE.Mesh(icosaGeometry, materials[i])
    mesh.position.x = Math.cos(angle) * 20
    mesh.position.y = Math.sin(angle) * 20
    mesh.position.z = 0
    geometryShapes.push(mesh)
    scene.add(mesh)
  }

  // Add lighting
  const light1 = new THREE.PointLight(0x00d4ff, 1.5, 100)
  light1.position.set(30, 30, 30)
  scene.add(light1)

  const light2 = new THREE.PointLight(0x8b5cf6, 1, 80)
  light2.position.set(-30, -30, 30)
  scene.add(light2)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)

  time += 0.016

  // Smooth mouse tracking with easing
  mouseX += (targetMouseX - mouseX) * 0.1
  mouseY += (targetMouseY - mouseY) * 0.1

  if (particles) {
    // Rotate particle cloud based on mouse position
    particles.rotation.x += (mouseY * 0.5 - particles.rotation.x) * 0.05
    particles.rotation.y += (mouseX * 0.5 - particles.rotation.y) * 0.05
    particles.rotation.z += 0.00005

    // Update particles with wave and distortion effects
    const posAttr = particles.geometry.getAttribute('position') as THREE.BufferAttribute
    const positionArray = posAttr.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const origX = originalPositions[i3]
      const origY = originalPositions[i3 + 1]
      const origZ = originalPositions[i3 + 2]

      // Wave distortion based on time - more subtle
      const waveX = Math.sin(origY * 0.008 + time * 0.3) * 1.5
      const waveY = Math.cos(origX * 0.008 + time * 0.25) * 1.5
      const waveZ = Math.sin((origX + origY) * 0.004 + time * 0.2) * 2

      // Mouse interaction - particles push away from cursor
      const mouseInfluence = 0.25
      const mouseX3d = mouseX * 50
      const mouseY3d = mouseY * 50
      const mouseZ3d = 20
      const dx = positionArray[i3] - mouseX3d
      const dy = positionArray[i3 + 1] - mouseY3d
      const dz = positionArray[i3 + 2] - mouseZ3d
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      const minDist = 30
      let pushX = 0, pushY = 0, pushZ = 0

      if (dist < minDist && dist > 0.1) {
        const force = (1 - dist / minDist) * mouseInfluence
        pushX = (dx / dist) * force * 4
        pushY = (dy / dist) * force * 4
        pushZ = (dz / dist) * force * 4
      }

      // Combine all effects with smooth interpolation
      positionArray[i3] = origX + waveX + pushX
      positionArray[i3 + 1] = origY + waveY + pushY
      positionArray[i3 + 2] = origZ + waveZ + pushZ
    }

    posAttr.needsUpdate = true
  }

  // Animate geometric shapes
  geometryShapes.forEach((shape, idx) => {
    shape.rotation.x += 0.005 + mouseY * 0.001
    shape.rotation.y += 0.008 + mouseX * 0.001
    shape.rotation.z += 0.003

    // Orbital motion around center
    const angle = time * 0.3 + (idx / 3) * Math.PI * 2
    const radius = 20 + Math.sin(time * 0.5 + idx) * 3
    shape.position.x = Math.cos(angle) * radius
    shape.position.y = Math.sin(angle) * radius
    shape.position.z = Math.sin(time * 0.4 + idx * 2) * 8

    // Scale based on time for breathing effect
    const scale = 1 + Math.sin(time * 0.5 + idx) * 0.15
    shape.scale.set(scale, scale, scale)
  })

  renderer.render(scene, camera)
}

const onWindowResize = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const cleanup = () => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('mousemove', animate)
  window.removeEventListener('resize', onWindowResize)
  renderer.dispose()
  if (container.value?.firstChild) {
    container.value.removeChild(renderer.domElement)
  }
}

onMounted(() => {
  if (container.value) {
    createScene()
  }
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}
</style>
