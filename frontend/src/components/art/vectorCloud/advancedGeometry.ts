/**
 * ADVANCED MORPHING GEOMETRY SYSTEM
 * Creates sophisticated, deforming organic forms
 * Combines parametric surfaces with real-time deformation
 */

import * as THREE from 'three'
import { perlinNoise3D } from './noise'

/**
 * Create a toroidal knot: parametric surface that twists and knots
 * Beautiful mathematical form perfect for morphing
 */
export const createToroidalKnot = (scale: number = 1): THREE.Mesh => {
  const geometry = new THREE.BufferGeometry()
  const positions: number[] = []
  const normals: number[] = []

  const p = 3 // Number of knot windings
  const q = 2 // Crossing number
  const segments = 200
  const rings = 50

  // Generate toroidal knot parametric surface
  for (let i = 0; i < segments; i++) {
    const u = (i / segments) * Math.PI * 2 * q

    for (let j = 0; j < rings; j++) {
      const v = (j / rings) * Math.PI * 2

      // Toroidal knot parameterization
      const r = Math.cos(p * u / 2) + 2 * Math.cos(q * u / 2)
      const x = r * Math.cos(u) * scale
      const y = r * Math.sin(u) * scale
      const z = Math.sin(p * u / 2) * scale

      // Add minor radius for tube
      const minorRadius = 0.4
      const tubeX = (r + minorRadius * Math.cos(v)) * Math.cos(u) * scale
      const tubeY = (r + minorRadius * Math.cos(v)) * Math.sin(u) * scale
      const tubeZ = (Math.sin(p * u / 2) + minorRadius * Math.sin(v)) * scale

      positions.push(tubeX, tubeY, tubeZ)

      // Simple normal calculation
      const normal = new THREE.Vector3(tubeX, tubeY, tubeZ).normalize()
      normals.push(normal.x, normal.y, normal.z)
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3))

  // Create faces
  const indices: number[] = []
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < rings; j++) {
      const a = i * rings + j
      const b = ((i + 1) % segments) * rings + j
      const c = ((i + 1) % segments) * rings + ((j + 1) % rings)
      const d = i * rings + ((j + 1) % rings)

      indices.push(a, b, c)
      indices.push(a, c, d)
    }
  }

  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1))
  geometry.computeBoundingSphere()

  const mesh = new THREE.Mesh(geometry)
  return mesh
}

/**
 * Create a morphing ribbon: flowing, organic surface
 * Deforms based on time and position
 */
export const createMorphingRibbon = (width: number = 80, height: number = 60, density: number = 40): THREE.Mesh => {
  const geometry = new THREE.BufferGeometry()

  // Create grid of vertices
  const xSegments = Math.floor(width / density)
  const ySegments = Math.floor(height / density)

  const positions: number[] = []
  const normals: number[] = []
  const indices: number[] = []

  for (let y = 0; y <= ySegments; y++) {
    for (let x = 0; x <= xSegments; x++) {
      const xPos = (x / xSegments - 0.5) * width
      const yPos = (y / ySegments - 0.5) * height
      const zPos = 0

      positions.push(xPos, yPos, zPos)
      normals.push(0, 0, 1)
    }
  }

  // Create indices for triangles
  for (let y = 0; y < ySegments; y++) {
    for (let x = 0; x < xSegments; x++) {
      const a = y * (xSegments + 1) + x
      const b = y * (xSegments + 1) + (x + 1)
      const c = (y + 1) * (xSegments + 1) + x
      const d = (y + 1) * (xSegments + 1) + (x + 1)

      indices.push(a, c, b)
      indices.push(b, c, d)
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3))
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1))

  const mesh = new THREE.Mesh(geometry)
  return mesh
}

/**
 * Create IcosahedronGeometry with enhanced subdivision for smooth morphing
 */
export const createSubdividedGeometry = (radius: number = 5, detail: number = 5): THREE.Mesh => {
  const geometry = new THREE.IcosahedronGeometry(radius, detail)
  const mesh = new THREE.Mesh(geometry)
  return mesh
}

/**
 * Update morphing geometry deformation
 * Apply real-time deformation based on time and frequency data
 */
export const updateGeometryDeformation = (
  mesh: THREE.Mesh,
  time: number,
  morphIntensity: number,
  spatialFlow: number
): void => {
  const geometry = mesh.geometry as THREE.BufferGeometry
  const positions = geometry.getAttribute('position') as THREE.BufferAttribute
  const originalPositions = positions.array as Float32Array

  const posArray = positions.array as Float32Array
  const positionArray = geometry.getAttribute('position') as THREE.BufferAttribute

  // Only update if we have position data
  if (!positionArray || !positionArray.array) return

  const originalPos = (positionArray.array as Float32Array).slice()

  // Apply deformation
  for (let i = 0; i < originalPos.length; i += 3) {
    const x = originalPos[i]
    const y = originalPos[i + 1]
    const z = originalPos[i + 2]

    // Deformation: noise-based displacement along normal
    const noise = perlinNoise3D(
      x * 0.05 + time * 0.0001,
      y * 0.05 + time * 0.0002,
      z * 0.05 + time * 0.0003
    )

    const displacement = noise * morphIntensity

    // Move along radial direction (from center)
    const magnitude = Math.sqrt(x * x + y * y + z * z)
    if (magnitude > 0) {
      const dirX = x / magnitude
      const dirY = y / magnitude
      const dirZ = z / magnitude

      posArray[i] = x + dirX * displacement
      posArray[i + 1] = y + dirY * displacement
      posArray[i + 2] = z + dirZ * displacement
    }
  }

  positionArray.needsUpdate = true

  // Update normals for lighting
  geometry.computeVertexNormals()
}

/**
 * Create layered geometry system: multiple meshes at different scales/timings
 */
export const createGeometryLayers = (
  baseScale: number = 1
): Array<{ mesh: THREE.Mesh; scale: number; speed: number; type: 'knot' | 'ribbon' | 'icosphere' }> => {
  const layers = []

  // Layer 1: Large toroidal knot (slow movement)
  const knot = createToroidalKnot(baseScale * 1.0)
  layers.push({
    mesh: knot,
    scale: 1.0,
    speed: 0.5,
    type: 'knot' as const,
  })

  // Layer 2: Medium icosphere (medium speed)
  const sphere = createSubdividedGeometry(baseScale * 0.6, 4)
  layers.push({
    mesh: sphere,
    scale: 0.6,
    speed: 1.0,
    type: 'icosphere' as const,
  })

  // Layer 3: Small morphing ribbon (fast movement)
  const ribbon = createMorphingRibbon(baseScale * 40, baseScale * 30, 10)
  layers.push({
    mesh: ribbon,
    scale: 0.4,
    speed: 1.5,
    type: 'ribbon' as const,
  })

  return layers
}

/**
 * Animate geometry layers with different timings
 */
export const updateGeometryLayers = (
  layers: Array<{ mesh: THREE.Mesh; scale: number; speed: number; type: string }>,
  time: number,
  morphIntensity: number,
  spatialFlow: number
): void => {
  layers.forEach((layer, idx) => {
    // Each layer rotates at different speed
    layer.mesh.rotation.x += layer.speed * 0.0001 * spatialFlow
    layer.mesh.rotation.y += layer.speed * 0.00015 * spatialFlow
    layer.mesh.rotation.z += layer.speed * 0.00008 * spatialFlow

    // Scale pulse based on time and layer index
    const pulseFactor = 1 + Math.sin(time * 0.0003 + idx) * 0.1 * morphIntensity
    layer.mesh.scale.set(pulseFactor, pulseFactor, pulseFactor)

    // Update geometry deformation
    updateGeometryDeformation(layer.mesh, time * (1 + idx * 0.5), morphIntensity * layer.speed, spatialFlow)
  })
}
