/**
 * SOPHISTICATED FREQUENCY SYNTHESIS
 * Generates complex, evolving patterns without audio input
 * Uses multiple noise octaves, mathematical functions, and time-based modulation
 * Drives all visualization parameters for unified, organic animation
 */

import { perlinNoise3D, curlNoiseMultiOctave } from './noise'

export interface FrequencyBand {
  low: number
  mid: number
  high: number
  peak: number
}

export interface SynthesizedPattern {
  // Frequency-like data (0-1 range)
  frequency: FrequencyBand

  // Spatial variation
  spatialFlow: number // Overall movement intensity
  spatialTurbulence: number // Chaos/variation level

  // Temporal evolution
  evolutionPhase: number // 0-1, cycles smoothly
  morphIntensity: number // How aggressively geometry morphs

  // Dynamic parameters
  particleEmission: number // Particle spawn intensity
  particleVelocity: number // Particle speed multiplier
  geometryScale: number // Size of main geometry
  lightIntensity: number // Brightness multiplier
  colorShift: number // Hue rotation parameter
}

/**
 * Generate synthetic frequency data from time
 * Mimics music visualization complexity without audio input
 */
export const synthesizeFrequencies = (time: number): FrequencyBand => {
  // Multiple time scales for complex behavior
  const phase1 = (time * 0.0003) % 1 // Slow evolution
  const phase2 = (time * 0.001) % 1 // Fast modulation
  const phase3 = (time * 0.0005) % 1 // Medium evolution

  // Low frequency: slow, smooth, foundational
  const lowBase = Math.sin(phase1 * Math.PI * 2) * 0.5 + 0.5
  const lowNoise = perlinNoise3D(phase1 * 10, 0, 0) * 0.5
  const low = Math.max(0, Math.min(1, lowBase + lowNoise * 0.3))

  // Mid frequency: responsive, musical
  const midBase = Math.sin(phase2 * Math.PI * 2) * 0.3 + 0.5
  const midNoise = perlinNoise3D(phase2 * 20, phase2 * 10, 0) * 0.4
  const mid = Math.max(0, Math.min(1, midBase + midNoise * 0.3))

  // High frequency: fast, jittery, responsive
  const highBase = Math.sin(phase3 * Math.PI * 4) * 0.25 + 0.5
  const highNoise = perlinNoise3D(phase3 * 40, phase3 * 30, phase3 * 20) * 0.3
  const high = Math.max(0, Math.min(1, highBase + highNoise * 0.3))

  // Peak: occasional spikes for drama
  const peakBase = Math.sin(phase1 * Math.PI) * Math.sin(phase2 * Math.PI * 3)
  const peak = Math.max(0, Math.min(1, peakBase * 0.5 + 0.3))

  return { low, mid, high, peak }
}

/**
 * Generate spatial variation patterns
 * Creates flowing, organic movement across space
 */
export const synthesizeSpatialFlow = (time: number, x: number, y: number, z: number): number => {
  // Curl noise for smooth, flowing motion
  const noiseVal = curlNoiseMultiOctave(x * 0.01, y * 0.01, z * 0.01 + time * 0.0001, 3, 1.5)

  // Combine with time-based modulation
  const timeWave = Math.sin(time * 0.0003 + x * 0.001 + y * 0.001) * 0.5 + 0.5

  return noiseVal * timeWave
}

/**
 * Generate complete synthesized pattern
 * All parameters drive the visualization
 */
export const synthesizePattern = (time: number): SynthesizedPattern => {
  const freq = synthesizeFrequencies(time)

  // Phase cycling for smooth evolution
  const evolutionPhase = (time * 0.00005) % 1

  // Spatial flow: average of frequency components
  const spatialFlow = (freq.low + freq.mid * 0.7 + freq.high * 0.3) / 2.1

  // Turbulence from high-frequency variation
  const turbulenceFast = Math.sin(time * 0.001) * 0.5 + 0.5
  const spatialTurbulence = (freq.high + turbulenceFast) / 2

  // Morph intensity: low freq peaks cause geometry morphing
  const morphIntensity = freq.low * 0.7 + freq.peak * 0.3

  // Particle emission: spike on peaks
  const particleEmission = Math.pow(freq.mid * freq.peak, 1.5) * 2

  // Particle velocity: driven by mid and high
  const particleVelocity = freq.mid * 1.5 + freq.high * 0.5

  // Geometry scale: modulate by low frequency
  const geometryScale = 0.7 + freq.low * 0.3

  // Light intensity: driven by overall energy
  const lightIntensity = 1.0 + (freq.low + freq.mid) * 0.5 + freq.peak

  // Color shift: cycle through hues
  const colorShift = (evolutionPhase + freq.mid * 0.1) % 1

  return {
    frequency: freq,
    spatialFlow,
    spatialTurbulence,
    evolutionPhase,
    morphIntensity,
    particleEmission,
    particleVelocity,
    geometryScale,
    lightIntensity,
    colorShift,
  }
}

/**
 * Map frequency data to visual parameters smoothly
 * Easing functions for sophisticated motion
 */
export const easeFrequencyToVisual = (freq: number, type: 'easeInOut' | 'easeOut' | 'linear' = 'easeInOut'): number => {
  if (type === 'linear') return freq
  if (type === 'easeOut') return 1 - Math.pow(1 - freq, 3)
  if (type === 'easeInOut') return freq < 0.5 ? 4 * freq * freq * freq : 1 - Math.pow(-2 * freq + 2, 3) / 2
  return freq
}
