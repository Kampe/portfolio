<template>
  <canvas ref="canvas" class="vector-canvas" tabindex="-1"></canvas>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

const props = withDefaults(defineProps<{ interactive?: boolean }>(), { interactive: false })
const canvas = ref<HTMLCanvasElement | null>(null)
let renderer: THREE.WebGLRenderer | undefined
let scene: THREE.Scene | undefined
let camera: THREE.PerspectiveCamera | undefined
let particles: THREE.Points | undefined
let frame = 0
let resizeObserver: ResizeObserver | undefined
let running = true
const pointer = new THREE.Vector2()

function resize() {
  const element = canvas.value
  if (!element || !renderer || !camera) return
  const width = element.clientWidth
  const height = element.clientHeight
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setSize(width, height, false)
  camera.aspect = width / Math.max(height, 1)
  camera.updateProjectionMatrix()
}

function updatePointer(event: PointerEvent) {
  if (!props.interactive || !canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  pointer.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  )
}

function animate(time: number) {
  if (!running || !renderer || !scene || !camera || !particles) return
  const seconds = time * 0.00018
  particles.rotation.y = seconds + pointer.x * 0.12
  particles.rotation.x = Math.sin(seconds * 0.55) * 0.12 + pointer.y * 0.08
  renderer.render(scene, camera)
  frame = requestAnimationFrame(animate)
}

function handleVisibility() {
  const shouldRun = document.visibilityState === 'visible'
  if (shouldRun === running) return
  running = shouldRun
  if (running) frame = requestAnimationFrame(animate)
  else cancelAnimationFrame(frame)
}

onMounted(() => {
  if (!canvas.value) return
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100)
  camera.position.z = 5
  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: false, powerPreference: 'low-power' })

  const count = 520
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const cyan = new THREE.Color('#5eead4')
  const violet = new THREE.Color('#a78bfa')
  for (let index = 0; index < count; index += 1) {
    const theta = index * 2.399963
    const radius = 0.35 + 2.3 * Math.sqrt(index / count)
    positions[index * 3] = Math.cos(theta) * radius
    positions[index * 3 + 1] = Math.sin(theta) * radius * 0.72
    positions[index * 3 + 2] = Math.sin(index * 0.47) * 0.9
    const color = cyan.clone().lerp(violet, (Math.sin(index * 0.19) + 1) / 2)
    color.toArray(colors, index * 3)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.PointsMaterial({ size: 0.035, transparent: true, opacity: 0.7, vertexColors: true, sizeAttenuation: true })
  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas.value)
  canvas.value.addEventListener('pointermove', updatePointer, { passive: true })
  document.addEventListener('visibilitychange', handleVisibility)
  resize()
  frame = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  canvas.value?.removeEventListener('pointermove', updatePointer)
  document.removeEventListener('visibilitychange', handleVisibility)
  particles?.geometry.dispose()
  const material = particles?.material
  if (material instanceof THREE.Material) material.dispose()
  renderer?.dispose()
})
</script>
