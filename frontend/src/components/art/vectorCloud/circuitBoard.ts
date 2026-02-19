/**
 * Circuit Board Generator
 * Creates retro-wave Tron-like circuit board patterns with traces and nodes
 */

import * as THREE from 'three'

export interface CircuitBoardGeometry {
  lines: THREE.Line
  nodes: THREE.Points
  grid: THREE.GridHelper
}

/**
 * Generate circuit board traces and nodes
 */
export const createCircuitBoard = (): CircuitBoardGeometry => {
  const group = new THREE.Group()

  // Circuit line geometry
  const lineGeometry = new THREE.BufferGeometry()
  const linePositions: number[] = []
  const nodeMaterial = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 1,
    sizeAttenuation: true,
    transparent: true,
  })

  // Generate random circuit traces
  const traceCount = 40
  for (let i = 0; i < traceCount; i++) {
    const startX = (Math.random() - 0.5) * 200
    const startY = (Math.random() - 0.5) * 200
    const startZ = (Math.random() - 0.5) * 100

    const segments = 8 + Math.floor(Math.random() * 12)
    for (let j = 0; j < segments; j++) {
      const t = j / segments
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 40

      const x = startX + Math.cos(angle) * distance * (t + 0.5)
      const y = startY + Math.sin(angle) * distance * (t + 0.5)
      const z = startZ + (Math.random() - 0.5) * 30

      linePositions.push(x, y, z)
    }
  }

  lineGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(linePositions), 3)
  )

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00d4ff,
    linewidth: 2,
    transparent: true,
    opacity: 0.6,
  })

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial)

  // Node points at intersections
  const nodeGeometry = new THREE.BufferGeometry()
  const nodePositions = new Float32Array(linePositions)
  nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))

  const nodes = new THREE.Points(nodeGeometry, nodeMaterial)

  // Grid background for depth
  const grid = new THREE.GridHelper(300, 20, 0x1a1a2e, 0x0f0f1e)
  grid.position.z = -50

  return { lines, nodes, grid }
}

/**
 * Light trail path - travels across circuit board
 */
export interface LightTrail {
  position: THREE.Vector3
  velocity: THREE.Vector3
  trail: THREE.Vector3[]
  maxTrailLength: number
  color: THREE.Color
  intensity: number
}

/**
 * Create light trail
 */
export const createLightTrail = (color: THREE.Color = new THREE.Color(0xff00ff)): LightTrail => {
  return {
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 150,
      (Math.random() - 0.5) * 150,
      (Math.random() - 0.5) * 50
    ),
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 1
    ),
    trail: [],
    maxTrailLength: 60,
    color: color,
    intensity: 1,
  }
}

/**
 * Update light trail position and trail array
 */
export const updateLightTrail = (trail: LightTrail, bounds: { min: number; max: number }) => {
  // Add current position to trail
  trail.trail.push(trail.position.clone())
  if (trail.trail.length > trail.maxTrailLength) {
    trail.trail.shift()
  }

  // Update position
  trail.position.add(trail.velocity)

  // Bounce off bounds
  if (Math.abs(trail.position.x) > bounds.max) trail.velocity.x *= -1
  if (Math.abs(trail.position.y) > bounds.max) trail.velocity.y *= -1
  if (Math.abs(trail.position.z) > bounds.max * 0.5) trail.velocity.z *= -1

  // Fade intensity
  trail.intensity = Math.max(0.2, trail.intensity * 0.98)
}

/**
 * Create trail line geometry for rendering
 */
export const createTrailGeometry = (trails: LightTrail[]): THREE.BufferGeometry => {
  const positions: number[] = []
  const colors: number[] = []

  trails.forEach((trail) => {
    trail.trail.forEach((pos, idx) => {
      positions.push(pos.x, pos.y, pos.z)

      // Fade color along trail
      const alpha = idx / trail.trail.length
      const r = trail.color.r
      const g = trail.color.g
      const b = trail.color.b

      colors.push(r, g, b)
    })
  })

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

  return geometry
}
