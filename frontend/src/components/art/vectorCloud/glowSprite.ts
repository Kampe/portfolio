/**
 * Generate a glowing circular sprite texture
 * Creates a smooth radial gradient with glow effect
 */

import * as THREE from 'three'

export const createGlowSpriteTexture = (): THREE.Texture => {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')!
  const centerX = size / 2
  const centerY = size / 2
  const maxRadius = size / 2

  // Create radial gradient for glow
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius)

  // Glow colors: bright center fading to transparent
  gradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)')    // Bright cyan center
  gradient.addColorStop(0.4, 'rgba(0, 180, 255, 0.6)')  // Mid-tone
  gradient.addColorStop(0.7, 'rgba(0, 100, 200, 0.3)')  // Darker cyan
  gradient.addColorStop(1, 'rgba(0, 50, 100, 0)')       // Fully transparent edge

  // Fill with gradient
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  // Optional: add a subtle inner highlight
  const innerGradient = ctx.createRadialGradient(centerX * 0.7, centerY * 0.7, 0, centerX, centerY, maxRadius * 0.3)
  innerGradient.addColorStop(0, 'rgba(100, 255, 255, 0.4)')
  innerGradient.addColorStop(1, 'rgba(0, 212, 255, 0)')
  ctx.fillStyle = innerGradient
  ctx.fillRect(0, 0, size, size)

  // Create THREE texture
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true

  return texture
}

export const createGlowMaterial = (texture: THREE.Texture): THREE.PointsMaterial => {
  return new THREE.PointsMaterial({
    map: texture,
    color: 0x00d4ff,
    size: 4,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}
