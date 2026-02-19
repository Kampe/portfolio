/**
 * Parameter Tuning System
 * Live parameter editing without rebuilds
 *
 * Enables:
 * - Real-time parameter adjustment
 * - Type-safe parameter definitions
 * - Parameter presets (save/load)
 * - Parameter validation
 */

import { reactive, computed } from 'vue'

export type ParameterType = 'number' | 'range' | 'color' | 'boolean' | 'select'

export interface ParameterDefinition {
  name: string
  type: ParameterType
  value: any
  min?: number
  max?: number
  step?: number
  options?: string[] | Record<string, any>
  description?: string
  category?: string
}

export interface ParameterSet {
  [key: string]: any
}

export interface ParameterPreset {
  name: string
  timestamp: number
  parameters: ParameterSet
  description?: string
}

/**
 * Create a reactive, type-safe parameter object
 * Usage:
 *   const params = createParameters({
 *     particleCount: { type: 'range', value: 2000, min: 100, max: 10000 },
 *     bloomStrength: { type: 'range', value: 1.2, min: 0, max: 2, step: 0.1 },
 *     color: { type: 'color', value: '#ff006e' }
 *   })
 */
export function createParameters(
  definitions: Record<string, ParameterDefinition>
): { params: ParameterSet; definitions: Record<string, ParameterDefinition> } {
  const params = reactive<ParameterSet>({})

  // Initialize parameter values
  Object.entries(definitions).forEach(([key, def]) => {
    params[key] = def.value
  })

  return { params, definitions }
}

/**
 * Parameter preset manager - save and load parameter combinations
 */
export class ParameterPresetManager {
  private presets: Map<string, ParameterPreset> = new Map()
  private storageKey = 'theme_parameter_presets'

  constructor() {
    this.loadPresetsFromStorage()
  }

  /**
   * Save current parameters as a preset
   */
  savePreset(
    name: string,
    parameters: ParameterSet,
    description?: string
  ): ParameterPreset {
    const preset: ParameterPreset = {
      name,
      timestamp: Date.now(),
      parameters: { ...parameters },
      description,
    }

    this.presets.set(name, preset)
    this.savePresetsToStorage()
    return preset
  }

  /**
   * Load parameters from a preset
   */
  loadPreset(name: string): ParameterSet | null {
    const preset = this.presets.get(name)
    if (!preset) {
      console.warn(`Preset "${name}" not found`)
      return null
    }
    return { ...preset.parameters }
  }

  /**
   * Get all presets
   */
  getPresets(): ParameterPreset[] {
    return Array.from(this.presets.values()).sort((a, b) => b.timestamp - a.timestamp)
  }

  /**
   * Delete a preset
   */
  deletePreset(name: string): boolean {
    const deleted = this.presets.delete(name)
    if (deleted) {
      this.savePresetsToStorage()
    }
    return deleted
  }

  /**
   * Export presets as JSON (for sharing/backup)
   */
  export(): string {
    const data = Array.from(this.presets.values())
    return JSON.stringify(data, null, 2)
  }

  /**
   * Import presets from JSON
   */
  import(json: string): void {
    try {
      const data = JSON.parse(json) as ParameterPreset[]
      data.forEach(preset => {
        this.presets.set(preset.name, preset)
      })
      this.savePresetsToStorage()
    } catch (error) {
      console.error('Failed to import presets:', error)
    }
  }

  /**
   * Merge preset parameters into existing parameters
   */
  applyPreset(target: ParameterSet, presetName: string): boolean {
    const params = this.loadPreset(presetName)
    if (!params) return false

    Object.assign(target, params)
    return true
  }

  /**
   * Compare two presets side-by-side
   */
  compare(name1: string, name2: string): Record<string, { preset1: any; preset2: any }> {
    const p1 = this.loadPreset(name1)
    const p2 = this.loadPreset(name2)

    if (!p1 || !p2) {
      console.warn('One or both presets not found')
      return {}
    }

    const comparison: Record<string, { preset1: any; preset2: any }> = {}
    const allKeys = new Set([...Object.keys(p1), ...Object.keys(p2)])

    allKeys.forEach(key => {
      if (p1[key] !== p2[key]) {
        comparison[key] = {
          preset1: p1[key],
          preset2: p2[key],
        }
      }
    })

    return comparison
  }

  private savePresetsToStorage(): void {
    try {
      const data = this.export()
      localStorage.setItem(this.storageKey, data)
    } catch (error) {
      console.warn('Failed to save presets to localStorage:', error)
    }
  }

  private loadPresetsFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey)
      if (data) {
        this.import(data)
      }
    } catch (error) {
      console.warn('Failed to load presets from localStorage:', error)
    }
  }
}

/**
 * Validator for parameter values
 */
export class ParameterValidator {
  static validate(
    value: any,
    definition: ParameterDefinition
  ): { valid: boolean; error?: string } {
    switch (definition.type) {
      case 'number':
      case 'range':
        if (typeof value !== 'number') {
          return { valid: false, error: 'Must be a number' }
        }
        if (definition.min !== undefined && value < definition.min) {
          return { valid: false, error: `Must be >= ${definition.min}` }
        }
        if (definition.max !== undefined && value > definition.max) {
          return { valid: false, error: `Must be <= ${definition.max}` }
        }
        return { valid: true }

      case 'color':
        if (!/^#[0-9A-F]{6}$/i.test(value)) {
          return { valid: false, error: 'Invalid hex color' }
        }
        return { valid: true }

      case 'boolean':
        if (typeof value !== 'boolean') {
          return { valid: false, error: 'Must be boolean' }
        }
        return { valid: true }

      case 'select':
        if (definition.options && !definition.options.includes(value)) {
          return { valid: false, error: `Must be one of: ${definition.options.join(', ')}` }
        }
        return { valid: true }

      default:
        return { valid: true }
    }
  }

  static validateAll(
    parameters: ParameterSet,
    definitions: Record<string, ParameterDefinition>
  ): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    Object.entries(definitions).forEach(([key, def]) => {
      const result = this.validate(parameters[key], def)
      if (!result.valid && result.error) {
        errors[key] = result.error
      }
    })

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    }
  }
}

/**
 * Parameter interpolation (for smooth transitions between presets)
 */
export function interpolateParameters(
  preset1: ParameterSet,
  preset2: ParameterSet,
  t: number // 0-1 blend factor
): ParameterSet {
  const result: ParameterSet = {}

  const allKeys = new Set([...Object.keys(preset1), ...Object.keys(preset2)])

  allKeys.forEach(key => {
    const v1 = preset1[key]
    const v2 = preset2[key]

    // Only interpolate numbers
    if (typeof v1 === 'number' && typeof v2 === 'number') {
      result[key] = v1 + (v2 - v1) * t
    } else {
      // Use v2 for non-numeric parameters
      result[key] = t > 0.5 ? v2 : v1
    }
  })

  return result
}
