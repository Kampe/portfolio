/**
 * Theme Architecture - Type Definitions
 * Each theme is a self-contained visualization system
 * All themes receive the same synthesized pattern + interaction data
 *
 * Type safety ensures:
 * - Consistent theme interfaces
 * - Type-safe parameter passing
 * - Proper resource cleanup
 * - Validated configuration
 */

import * as THREE from 'three'
import { SynthesizedPattern } from '../synthesis'

/**
 * Post-processing composer interface (EffectComposer from three/examples/jsm)
 * Defined as interface for decoupling and testability
 */
export interface PostProcessingComposer {
  render(): void
  dispose(): void
}

/**
 * Normalized cursor position and interaction force
 */
export interface CursorState {
  /** Normalized 3D position in scene space, null if not set */
  position: THREE.Vector3 | null
  /** Radius of influence (pixels) */
  radius: number
  /** Force magnitude (0-1) */
  strength: number
}

/**
 * Per-frame interaction state passed to all themes
 * Decoupled from DOM/UI layer for testability and reusability
 */
export interface ThemeInteractionState {
  /** Cursor tracking and physics */
  cursor: CursorState
  /** Energized level from scroll wheel (0-1, fades over time) */
  energizedLevel: number
  /** Click pulse intensity (0-1, triggers on click, fades over ~200ms) */
  clickPulse: number
  /** Frame-rate independent delta time in seconds */
  deltaTime?: number
  /** Live-tuned parameters from Playground (optional, theme-specific) */
  parameters?: Record<string, number | boolean | string>
}

/**
 * Core rendering resources and update function
 * Encapsulates all Three.js state for a single theme
 */
export interface ThemeSetupResult {
  /** Three.js scene for this theme */
  scene: THREE.Scene
  /** Camera viewing the scene */
  camera: THREE.PerspectiveCamera
  /** WebGL renderer */
  renderer: THREE.WebGLRenderer
  /** Optional post-processing composer for effects */
  composer?: PostProcessingComposer
  /**
   * Update function called each frame
   * Receives universal pattern + interaction state
   * Updates geometries, materials, lighting for this frame
   */
  update(
    time: number,
    pattern: SynthesizedPattern,
    interaction: ThemeInteractionState
  ): void
  /**
   * Cleanup function - dispose of all Three.js resources
   * Called when theme switches or component unmounts
   */
  dispose(): void
}

/**
 * Theme configuration and metadata
 * Partial<ThemeConfig> allows themes to override only needed values
 */
export interface ThemeConfig {
  /** User-facing theme name */
  name: string
  /** Short description of theme aesthetics */
  description: string
  /** Optional color overrides */
  colors?: {
    primary: string
    secondary: string
    tertiary: string
    accent?: string
  }
  /** Performance hints and tuning */
  performance?: {
    /** Target framerate (default: 60) */
    targetFps?: number
    /** Particle count for this theme */
    particleCount?: number
    /** Use WebGL compute if available */
    useCompute?: boolean
  }
  /** Colors from portfolio palette (injected at runtime) */
  paletteColors?: {
    color1: number
    color2: number
    color3: number
  }
}

/**
 * Factory function signature for creating themes
 * Each theme must export a factory matching this type
 * Ensures consistent initialization and dependency injection
 */
export type ThemeFactory = (
  canvas: HTMLCanvasElement,
  config?: Partial<ThemeConfig>
) => ThemeSetupResult
