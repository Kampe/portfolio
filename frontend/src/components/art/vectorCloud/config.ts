// Tunable configuration for the vector cloud hero
export interface VectorCloudConfig {
  // Particle system
  particleCount: number
  noiseStrength: number
  speed: number

  // Interactions
  pointerAttractionRadius: number
  pointerAttractionStrength: number

  // Colors & visual
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string

  // Performance
  dprCap: number
  enableBloom: boolean

  // States (calm vs energized)
  calmSpeedMultiplier: number
  energizedSpeedMultiplier: number
  clickPulseDuration: number
  clickPulseIntensity: number

  // Reduced motion
  reducedMotionParticleCount: number
  reducedMotionSpeed: number
}

const DEFAULT_CONFIG: VectorCloudConfig = {
  // Particle system
  particleCount: 4000,
  noiseStrength: 1.2,  // Increased from 0.8 — more dramatic swirling
  speed: 0.5,          // Increased from 0.3 — faster drift through space

  // Interactions
  pointerAttractionRadius: 50,
  pointerAttractionStrength: 0.15,

  // Colors (cyan → blue → purple gradient)
  primaryColor: '#00d4ff',    // Cyan
  secondaryColor: '#3b82f6',  // Blue
  tertiaryColor: '#a855f7',   // Purple

  // Performance
  dprCap: 2,
  enableBloom: false,

  // States
  calmSpeedMultiplier: 1.0,
  energizedSpeedMultiplier: 3.0,  // Increased from 2.5 — more dramatic on scroll
  clickPulseDuration: 200, // ms
  clickPulseIntensity: 0.6,

  // Reduced motion
  reducedMotionParticleCount: 2000,
  reducedMotionSpeed: 0.25  // Increased from 0.15 — still smooth, but noticeable motion
}

let cachedConfig = { ...DEFAULT_CONFIG }

export const getVectorCloudConfig = (): VectorCloudConfig => {
  // Detect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  if (prefersReducedMotion) {
    return {
      ...cachedConfig,
      particleCount: cachedConfig.reducedMotionParticleCount,
      speed: cachedConfig.reducedMotionSpeed,
      noiseStrength: cachedConfig.noiseStrength * 0.7,
      clickPulseIntensity: cachedConfig.clickPulseIntensity * 0.3
    }
  }

  if (isMobile) {
    // Mobile optimization: fewer particles, slower animation for better performance
    return {
      ...cachedConfig,
      particleCount: 1500, // Reduce from 4000 for mobile
      speed: 0.35,        // Slightly slower
      noiseStrength: 1.0,  // Reduce a bit
      dprCap: 1.5         // Cap DPR more strictly for mobile
    }
  }

  return cachedConfig
}

/**
 * Update config at runtime (for debugging/tuning)
 */
export const updateVectorCloudConfig = (updates: Partial<VectorCloudConfig>) => {
  cachedConfig = { ...cachedConfig, ...updates }
}
