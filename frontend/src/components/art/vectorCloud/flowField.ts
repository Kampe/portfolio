/**
 * Flow Field using Curl Noise
 * Creates smooth, organic particle motion patterns
 */

import * as THREE from 'three'

// Simplex-like noise function
const noise = (x: number, y: number, z: number): number => {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453
  return n - Math.floor(n)
}

// Smooth interpolation
const smoothstep = (t: number): number => {
  return t * t * (3 - 2 * t)
}

// 3D Perlin-like noise
const perlin3D = (x: number, y: number, z: number): number => {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)

  const xf = x - xi
  const yf = y - yi
  const zf = z - zi

  const u = smoothstep(xf)
  const v = smoothstep(yf)
  const w = smoothstep(zf)

  const n000 = noise(xi, yi, zi)
  const n100 = noise(xi + 1, yi, zi)
  const n010 = noise(xi, yi + 1, zi)
  const n110 = noise(xi + 1, yi + 1, zi)
  const n001 = noise(xi, yi, zi + 1)
  const n101 = noise(xi + 1, yi, zi + 1)
  const n011 = noise(xi, yi + 1, zi + 1)
  const n111 = noise(xi + 1, yi + 1, zi + 1)

  const nx0 = n000 * (1 - u) + n100 * u
  const nx1 = n010 * (1 - u) + n110 * u
  const nxy0 = nx0 * (1 - v) + nx1 * v

  const nx0z = n001 * (1 - u) + n101 * u
  const nx1z = n011 * (1 - u) + n111 * u
  const nxy1 = nx0z * (1 - v) + nx1z * v

  return nxy0 * (1 - w) + nxy1 * w
}

/**
 * Curl noise: creates smooth, swirling 3D flow
 * Returns a 3D vector representing flow direction and magnitude
 */
export const curlNoise = (x: number, y: number, z: number, time: number): THREE.Vector3 => {
  const epsilon = 0.01

  // Sample noise at offset points to compute curl
  const p = perlin3D(x * 0.05 + time * 0.00001, y * 0.05 + time * 0.00001, z * 0.05 + time * 0.00001)
  const pxp = perlin3D((x + epsilon) * 0.05 + time * 0.00001, y * 0.05 + time * 0.00001, z * 0.05 + time * 0.00001)
  const pyp = perlin3D(x * 0.05 + time * 0.00001, (y + epsilon) * 0.05 + time * 0.00001, z * 0.05 + time * 0.00001)
  const pzp = perlin3D(x * 0.05 + time * 0.00001, y * 0.05 + time * 0.00001, (z + epsilon) * 0.05 + time * 0.00001)

  const dpdx = (pxp - p) / epsilon
  const dpdy = (pyp - p) / epsilon
  const dpdz = (pzp - p) / epsilon

  // Second sample for curl computation
  const q = perlin3D(x * 0.08 + time * 0.00002, y * 0.08 + time * 0.00002, z * 0.08 + time * 0.00002)
  const qxp = perlin3D((x + epsilon) * 0.08 + time * 0.00002, y * 0.08 + time * 0.00002, z * 0.08 + time * 0.00002)
  const qyp = perlin3D(x * 0.08 + time * 0.00002, (y + epsilon) * 0.08 + time * 0.00002, z * 0.08 + time * 0.00002)
  const qzp = perlin3D(x * 0.08 + time * 0.00002, y * 0.08 + time * 0.00002, (z + epsilon) * 0.08 + time * 0.00002)

  const dqdx = (qxp - q) / epsilon
  const dqdy = (qyp - q) / epsilon
  const dqdz = (qzp - q) / epsilon

  // Curl (cross product of gradients)
  const curlX = dqdy * dpdz - dqdz * dpdy
  const curlY = dqdz * dpdx - dqdx * dpdz
  const curlZ = dqdx * dpdy - dqdy * dpdx

  return new THREE.Vector3(curlX, curlY, curlZ).normalize().multiplyScalar(0.5)
}

/**
 * Vertical flow: makes particles rise/fall based on position and time
 */
export const verticalFlow = (x: number, z: number, time: number): number => {
  const upDraft = perlin3D(x * 0.01, z * 0.01, time * 0.00005) * 2 - 1
  return upDraft * 0.3
}
