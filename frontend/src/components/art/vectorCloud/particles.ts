/**
 * Particle system for vector cloud hero
 * Manages particle positions, velocities, and simulation
 */

import * as THREE from 'three'
import { curlNoiseMultiOctave } from './noise'
import { getVectorCloudConfig } from './config'

export interface ParticleState {
  positions: Float32Array
  velocities: Float32Array
  originalPositions: Float32Array
  count: number
}

/**
 * Initialize particle system with random positions in a volume
 */
export const createParticles = (count: number): ParticleState => {
  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)
  const originalPositions = new Float32Array(count * 3)

  // Distribute particles in a loose bounding volume
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 100
    const y = (Math.random() - 0.5) * 100
    const z = (Math.random() - 0.5) * 80

    const i3 = i * 3

    positions[i3] = x
    positions[i3 + 1] = y
    positions[i3 + 2] = z

    originalPositions[i3] = x
    originalPositions[i3 + 1] = y
    originalPositions[i3 + 2] = z

    velocities[i3] = 0
    velocities[i3 + 1] = 0
    velocities[i3 + 2] = 0
  }

  return {
    positions,
    velocities,
    originalPositions,
    count
  }
}

/**
 * Update particle positions based on curl noise
 * Returns true if positions changed
 */
export const updateParticles = (
  particles: ParticleState,
  time: number,
  mousePos: THREE.Vector3 | null,
  energizedLevel: number,
  clickPulseIntensity: number
): boolean => {
  const config = getVectorCloudConfig()
  const { positions, velocities, originalPositions, count } = particles

  // Determine animation speed based on state
  const baseSpeed = config.speed * (1 + (energizedLevel - 0.5) * config.energizedSpeedMultiplier)
  const timeScale = time * baseSpeed * 0.001

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    const x = originalPositions[i3]
    const y = originalPositions[i3 + 1]
    const z = originalPositions[i3 + 2]

    // Get curl noise velocity
    const curl = curlNoiseMultiOctave(
      x * 0.01 + timeScale,
      y * 0.01 + timeScale * 0.7,
      z * 0.01 + timeScale * 0.5,
      3,
      config.noiseStrength
    )

    // Apply velocity
    velocities[i3] = curl.x * 0.5
    velocities[i3 + 1] = curl.y * 0.5
    velocities[i3 + 2] = curl.z * 0.5

    // Mouse interaction — attraction field
    if (mousePos) {
      const dx = positions[i3] - mousePos.x
      const dy = positions[i3 + 1] - mousePos.y
      const dz = positions[i3 + 2] - mousePos.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (dist < config.pointerAttractionRadius && dist > 0.1) {
        const force = (1 - dist / config.pointerAttractionRadius) * config.pointerAttractionStrength
        velocities[i3] -= (dx / dist) * force * 0.3
        velocities[i3 + 1] -= (dy / dist) * force * 0.3
        velocities[i3 + 2] -= (dz / dist) * force * 0.3
      }
    }

    // Click pulse effect — move toward center briefly
    if (clickPulseIntensity > 0) {
      const centerDist = Math.sqrt(
        originalPositions[i3] * originalPositions[i3] +
          originalPositions[i3 + 1] * originalPositions[i3 + 1] +
          originalPositions[i3 + 2] * originalPositions[i3 + 2]
      )

      if (centerDist > 0.1) {
        const pulseForce = clickPulseIntensity * config.clickPulseIntensity
        velocities[i3] -= (originalPositions[i3] / centerDist) * pulseForce
        velocities[i3 + 1] -= (originalPositions[i3 + 1] / centerDist) * pulseForce
        velocities[i3 + 2] -= (originalPositions[i3 + 2] / centerDist) * pulseForce
      }
    }

    // Damping
    velocities[i3] *= 0.95
    velocities[i3 + 1] *= 0.95
    velocities[i3 + 2] *= 0.95

    // Update position
    positions[i3] += velocities[i3]
    positions[i3 + 1] += velocities[i3 + 1]
    positions[i3 + 2] += velocities[i3 + 2]

    // Soft constraint — keep particles roughly in bounds
    const maxBound = 120
    if (Math.abs(positions[i3]) > maxBound) {
      positions[i3] = originalPositions[i3]
      velocities[i3] *= -0.5
    }
    if (Math.abs(positions[i3 + 1]) > maxBound) {
      positions[i3 + 1] = originalPositions[i3 + 1]
      velocities[i3 + 1] *= -0.5
    }
    if (Math.abs(positions[i3 + 2]) > 100) {
      positions[i3 + 2] = originalPositions[i3 + 2]
      velocities[i3 + 2] *= -0.5
    }
  }

  return true
}
