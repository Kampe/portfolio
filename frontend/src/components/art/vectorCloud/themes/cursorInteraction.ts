/**
 * Shared Cursor Interaction System
 * Reusable for all themes - handles repulsion, attraction, physics influence
 */

import * as THREE from 'three'

export interface CursorPhysicsConfig {
  mode: 'repulsion' | 'attraction' | 'vortex' // Interaction style
  radius: number // Influence radius
  strength: number // Force magnitude (0-1)
  falloff: 'linear' | 'quadratic' | 'smooth' // Distance falloff
}

/**
 * Calculate force on a position from cursor
 * Returns normalized direction vector scaled by influence strength
 */
export const calculateCursorForce = (
  position: THREE.Vector3,
  cursorPos: THREE.Vector3,
  config: CursorPhysicsConfig
): THREE.Vector3 => {
  const direction = new THREE.Vector3().subVectors(position, cursorPos)
  const distance = direction.length()

  // Outside radius: no effect
  if (distance > config.radius) {
    return new THREE.Vector3(0, 0, 0)
  }

  // Normalize direction
  if (distance > 0.001) {
    direction.normalize()
  } else {
    direction.set(0, 1, 0)
  }

  // Calculate falloff based on distance
  let influence = 0
  const normalizedDist = distance / config.radius

  if (config.falloff === 'linear') {
    influence = 1 - normalizedDist
  } else if (config.falloff === 'quadratic') {
    influence = Math.pow(1 - normalizedDist, 2)
  } else if (config.falloff === 'smooth') {
    // Smoothstep: smooth transition
    influence = 1 - smoothstep(normalizedDist)
  }

  influence *= config.strength

  // Mode: repulsion pushes away, attraction pulls toward, vortex spirals
  if (config.mode === 'repulsion') {
    return direction.multiplyScalar(influence)
  } else if (config.mode === 'attraction') {
    return direction.multiplyScalar(-influence)
  } else if (config.mode === 'vortex') {
    // Perpendicular to direction + outward
    const perp = new THREE.Vector3(-direction.y, direction.x, 0).normalize()
    return perp.multiplyScalar(influence * 0.5).add(direction.clone().multiplyScalar(influence * 0.3))
  }

  return new THREE.Vector3(0, 0, 0)
}

/**
 * Create particle trail effect from cursor movement
 * Useful for interactive feedback
 */
export class CursorTrail {
  private maxLength: number
  private positions: THREE.Vector3[] = []

  constructor(maxLength: number = 20) {
    this.maxLength = maxLength
  }

  addPoint(pos: THREE.Vector3) {
    this.positions.push(pos.clone())
    if (this.positions.length > this.maxLength) {
      this.positions.shift()
    }
  }

  getPositions(): THREE.Vector3[] {
    return this.positions
  }

  clear() {
    this.positions = []
  }
}

/**
 * Smoothstep easing function
 */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

/**
 * Vector field influence: creates smooth attraction/repulsion zones
 * Can be sampled at multiple points for efficient batch operations
 */
export class CursorVectorField {
  private cursorPos: THREE.Vector3 = new THREE.Vector3()
  private config: CursorPhysicsConfig

  constructor(config: CursorPhysicsConfig) {
    this.config = config
  }

  setCursorPosition(pos: THREE.Vector3) {
    this.cursorPos.copy(pos)
  }

  /**
   * Sample the field at a position
   * Returns the force vector at that point
   */
  sample(position: THREE.Vector3): THREE.Vector3 {
    return calculateCursorForce(position, this.cursorPos, this.config)
  }

  /**
   * Sample multiple positions efficiently
   * Returns Float32Array of [x, y, z, x, y, z, ...] forces
   */
  sampleBatch(positions: Float32Array, stride: number = 3): Float32Array {
    const forces = new Float32Array(positions.length)

    for (let i = 0; i < positions.length; i += stride) {
      const pos = new THREE.Vector3(
        positions[i],
        positions[i + 1],
        positions[i + 2]
      )

      const force = this.sample(pos)

      forces[i] = force.x
      forces[i + 1] = force.y
      forces[i + 2] = force.z
    }

    return forces
  }
}
