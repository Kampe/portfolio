/**
 * Theme Manager
 * Factory and routing for all visualization themes
 * Handles theme selection, switching, and lifecycle
 */

import { ThemeFactory, ThemeSetupResult, ThemeConfig } from './themeTypes'
import { createSpectrumAnalyzerTheme } from './spectrumAnalyzer'
import { createKaleidoscopeFractalsTheme } from './kaleidoscopeFractals'
import { createDMTMorphingTheme } from './dmtMorphing'
import { createDMTGeometryTheme } from './dmtGeometry'
import { createVectorFieldFloorTheme } from './vectorFieldFloor'
import { createChargedMagnetosphereTheme } from './chargedMagnetosphere'

export type ThemeName = 'spectrum' | 'kaleidoscope' | 'milkdrop' | 'dmt' | 'vectorfield' | 'magnetosphere'

type ThemeRegistry = Record<ThemeName, ThemeFactory>

const THEME_REGISTRY: ThemeRegistry = {
  spectrum: createSpectrumAnalyzerTheme,
  kaleidoscope: createKaleidoscopeFractalsTheme,
  milkdrop: createDMTMorphingTheme,
  dmt: createDMTGeometryTheme,
  vectorfield: createVectorFieldFloorTheme,
  magnetosphere: createChargedMagnetosphereTheme,
}

export class ThemeManager {
  private canvas: HTMLCanvasElement
  private currentTheme: ThemeSetupResult | null = null
  private currentThemeName: ThemeName = 'spectrum'

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  /**
   * Get available theme names
   */
  getAvailableThemes(): ThemeName[] {
    return Object.keys(THEME_REGISTRY) as ThemeName[]
  }

  /**
   * Get current theme name
   */
  getCurrentThemeName(): ThemeName {
    return this.currentThemeName
  }

  /**
   * Create and load a theme
   */
  loadTheme(themeName: ThemeName, config?: Partial<ThemeConfig>): ThemeSetupResult {
    // Dispose current theme if it exists
    if (this.currentTheme && this.currentTheme.dispose) {
      this.currentTheme.dispose()
    }

    const factory = THEME_REGISTRY[themeName]
    if (!factory) {
      console.warn(`[ThemeManager] Theme "${themeName}" not found. Available: ${Object.keys(THEME_REGISTRY).join(', ')}`)
      // Fallback to spectrum
      return this.loadTheme('spectrum', config)
    }

    console.log(`[ThemeManager] Loading theme: ${themeName}`)
    this.currentTheme = factory(this.canvas, config)
    this.currentThemeName = themeName

    return this.currentTheme
  }

  /**
   * Switch to a different theme with smooth transition
   * (Optional: could add fade-to-black transition)
   */
  async switchTheme(themeName: ThemeName, transitionDuration: number = 0): Promise<ThemeSetupResult> {
    if (themeName === this.currentThemeName && transitionDuration === 0) {
      // No-op if switching to same theme
      return this.currentTheme!
    }

    // TODO: Implement fade transition if needed
    // For now, immediate switch
    return this.loadTheme(themeName)
  }

  /**
   * Get current theme instance
   */
  getCurrentTheme(): ThemeSetupResult | null {
    return this.currentTheme
  }

  /**
   * Dispose current theme and clean up
   */
  dispose() {
    if (this.currentTheme && this.currentTheme.dispose) {
      this.currentTheme.dispose()
      this.currentTheme = null
    }
  }
}

export const getThemeFromURL = (): ThemeName | null => {
  const params = new URLSearchParams(window.location.search)
  const themeName = params.get('theme')

  if (themeName && Object.keys(THEME_REGISTRY).includes(themeName)) {
    return themeName as ThemeName
  }

  return null
}

export const registerTheme = (name: ThemeName, factory: ThemeFactory): void => {
  ;(THEME_REGISTRY as any)[name] = factory
  console.log(`[ThemeManager] Registered custom theme: ${name}`)
}
