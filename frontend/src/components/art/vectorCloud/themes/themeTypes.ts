/**
 * Theme Architecture
 * Each theme is a self-contained visualization system
 * All themes receive the same synthesized pattern + interaction data
 */

import * as THREE from 'three'
import { SynthesizedPattern } from '../synthesis'

export interface CursorState {
  position: THREE.Vector3 | null
  radius: number
  strength: number
}

export interface ThemeInteractionState {
  cursor: CursorState
  energizedLevel: number // 0-1, from scroll
  clickPulse: number // 0-1, fades from click
  deltaTime?: number // Frame-rate independent delta time in seconds
}

export interface ThemeSetupResult {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  composer?: any // EffectComposer optional
  update: (
    time: number,
    pattern: SynthesizedPattern,
    interaction: ThemeInteractionState
  ) => void
  dispose: () => void
}

export interface ThemeConfig {
  name: string
  description: string
  colors?: {
    primary: string
    secondary: string
    tertiary: string
    accent?: string
  }
  performance?: {
    targetFps?: number
    particleCount?: number
    useCompute?: boolean
  }
  paletteColors?: {
    color1: number
    color2: number
    color3: number
  }
}

export type ThemeFactory = (
  canvas: HTMLCanvasElement,
  config?: Partial<ThemeConfig>
) => ThemeSetupResult
