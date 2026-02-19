/**
 * PSYCHEDELIC TRON LIGHT CYCLES
 * High-speed neon racing light trails, particle explosions, energy waves
 * True visual spectacle - not basic geometry
 */

import * as THREE from 'three'

// Neon color palette for psychedelic vibes
export const PSYCHEDELIC_PALETTE = {
  cyan: 0x00d4ff,
  magenta: 0xff00ff,
  lime: 0x00ff88,
  purple: 0x9d00ff,
  pink: 0xff006e,
  electric: 0x00ffff,
  orange: 0xff6600,
  white: 0xffffff,
}

export interface LightCycle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  acceleration: THREE.Vector3
  trail: THREE.Vector3[]
  maxTrailLength: number
  color: number
  width: number
  speed: number
  directionChangeInterval: number
  lastDirectionChange: number
  energy: number
}

/**
 * Create a high-speed light cycle
 */
export const createLightCycle = (color: number = PSYCHEDELIC_PALETTE.cyan): LightCycle => {
  const angle = Math.random() * Math.PI * 2
  const speed = 2 + Math.random() * 3

  return {
    position: new THREE.Vector3(
      Math.cos(angle) * 100,
      Math.sin(angle) * 100,
      (Math.random() - 0.5) * 80
    ),
    velocity: new THREE.Vector3(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      (Math.random() - 0.5) * 0.5
    ),
    acceleration: new THREE.Vector3(0, 0, 0),
    trail: [],
    maxTrailLength: 120,
    color,
    width: 3,
    speed,
    directionChangeInterval: 2000 + Math.random() * 2000,
    lastDirectionChange: Date.now(),
    energy: 1.0,
  }
}

/**
 * Update light cycle - AI-driven movement with psychedelic patterns
 */
export const updateLightCycle = (cycle: LightCycle, time: number, mousePos: THREE.Vector3 | null) => {
  // Smart direction changes (not random - curves and spirals)
  const timeSinceChange = time - cycle.lastDirectionChange
  if (timeSinceChange > cycle.directionChangeInterval) {
    // Create psychedelic curves using sine/cosine patterns
    const curvePhase = (time * 0.001) % (Math.PI * 2)
    const curveIntensity = Math.sin(time * 0.0005) * 2

    cycle.velocity.x += Math.sin(curvePhase) * curveIntensity * 0.1
    cycle.velocity.y += Math.cos(curvePhase) * curveIntensity * 0.1
    cycle.lastDirectionChange = time

    // Vary direction change interval for unpredictability
    cycle.directionChangeInterval = 1000 + Math.random() * 3000
  }

  // Mouse attraction/repulsion for interactivity
  if (mousePos) {
    const distToMouse = cycle.position.distanceTo(mousePos)
    if (distToMouse < 150) {
      const direction = new THREE.Vector3().subVectors(cycle.position, mousePos).normalize()
      const attraction = 0.08 * (1 - distToMouse / 150)
      cycle.velocity.add(direction.multiplyScalar(attraction))
    }
  }

  // Velocity damping (keep it smooth)
  cycle.velocity.multiplyScalar(0.98)

  // Speed limiting
  const speed = cycle.velocity.length()
  if (speed > cycle.speed * 1.5) {
    cycle.velocity.normalize().multiplyScalar(cycle.speed * 1.5)
  }

  // Update position
  cycle.position.add(cycle.velocity)

  // Add position to trail
  cycle.trail.push(cycle.position.clone())
  if (cycle.trail.length > cycle.maxTrailLength) {
    cycle.trail.shift()
  }

  // Energy decay
  cycle.energy = Math.max(0.2, cycle.energy * 0.996)

  // Bounce off boundaries
  const bounds = 180
  if (cycle.position.x > bounds) {
    cycle.position.x = bounds
    cycle.velocity.x *= -1
  }
  if (cycle.position.x < -bounds) {
    cycle.position.x = -bounds
    cycle.velocity.x *= -1
  }
  if (cycle.position.y > bounds) {
    cycle.position.y = bounds
    cycle.velocity.y *= -1
  }
  if (cycle.position.y < -bounds) {
    cycle.position.y = -bounds
    cycle.velocity.y *= -1
  }
  if (cycle.position.z > 100) {
    cycle.position.z = 100
    cycle.velocity.z *= -1
  }
  if (cycle.position.z < -100) {
    cycle.position.z = -100
    cycle.velocity.z *= -1
  }
}

/**
 * Generate trail geometry with glow
 */
export const createTrailGeometries = (cycles: LightCycle[]): THREE.BufferGeometry[] => {
  return cycles.map((cycle) => {
    const positions: number[] = []
    const colors: number[] = []

    cycle.trail.forEach((pos, idx) => {
      positions.push(pos.x, pos.y, pos.z)

      // Fade from cycle color to black along trail
      const alpha = idx / cycle.trail.length
      const color = new THREE.Color(cycle.color)

      // Lerp toward black
      color.lerp(new THREE.Color(0x000000), 1 - alpha)

      colors.push(color.r, color.g, color.b)
    })

    const geometry = new THREE.BufferGeometry()
    if (positions.length > 0) {
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
    }

    return geometry
  })
}

/**
 * Create particle explosion at position
 */
export interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  lifespan: number
  maxLifespan: number
  color: THREE.Color
  size: number
}

export const createParticleExplosion = (
  position: THREE.Vector3,
  color: number,
  count: number = 20
): Particle[] => {
  const particles: Particle[] = []
  const colorObj = new THREE.Color(color)

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const speed = 2 + Math.random() * 3
    const elevation = (Math.random() - 0.5) * Math.PI

    particles.push({
      position: position.clone(),
      velocity: new THREE.Vector3(
        Math.cos(angle) * Math.cos(elevation) * speed,
        Math.sin(elevation) * speed,
        Math.sin(angle) * Math.cos(elevation) * speed
      ),
      lifespan: 1.0,
      maxLifespan: 800 + Math.random() * 400,
      color: colorObj.clone(),
      size: 1 + Math.random() * 2,
    })
  }

  return particles
}

/**
 * Update particle
 */
export const updateParticle = (particle: Particle, deltaTime: number): boolean => {
  particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime * 0.016))
  particle.velocity.multiplyScalar(0.98) // Air resistance
  particle.lifespan -= deltaTime
  return particle.lifespan > 0
}
