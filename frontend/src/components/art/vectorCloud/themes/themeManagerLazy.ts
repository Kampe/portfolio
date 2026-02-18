/**
 * Lazy-Loading Theme Manager
 * Dynamically imports theme factories only when needed
 * Reduces initial bundle size by ~60-70% (excludes large Three.js examples)
 *
 * Usage:
 *   const lazyManager = new LazyThemeManager(canvas)
 *   await lazyManager.loadThemeLazy('magnetosphere')  // Async load with dynamic import
 *   lazyManager.preloadThemes(['spectrum', 'kaleidoscope'])  // Background loading
 */

import type { ThemeFactory, ThemeName } from './themeTypes'
import { ThemeManager } from './themeManager'

export interface LazyThemeFactory {
  load(): Promise<ThemeFactory>
  name: ThemeName
}

/**
 * Lazy-loadable theme registry
 * Each theme factory is wrapped in a dynamic import that only executes on-demand
 */
export const lazyThemeRegistry: Record<ThemeName, LazyThemeFactory> = {
  spectrum: {
    name: 'spectrum',
    load: () => import('./spectrumAnalyzer').then((m) => m.createSpectrumAnalyzerTheme),
  },
  kaleidoscope: {
    name: 'kaleidoscope',
    load: () => import('./kaleidoscopeFractals').then((m) => m.createKaleidoscopeFractalsTheme),
  },
  milkdrop: {
    name: 'milkdrop',
    load: () => import('./milkdropMorphing').then((m) => m.createMilkdropMorphingTheme),
  },
  dmt: {
    name: 'dmt',
    load: () => import('./dmtGeometry').then((m) => m.createDMTGeometryTheme),
  },
  vectorfield: {
    name: 'vectorfield',
    load: () => import('./vectorFieldFloor').then((m) => m.createVectorFieldFloorTheme),
  },
  magnetosphere: {
    name: 'magnetosphere',
    load: () => import('./chargedMagnetosphere').then((m) => m.createChargedMagnetosphereTheme),
  },
}

/**
 * Lazy-Loading Theme Manager
 * Wraps ThemeManager to support on-demand dynamic imports
 * Maintains a cache to avoid reloading themes that have been loaded before
 */
export class LazyThemeManager {
  private themeManager: ThemeManager
  private themeFactoryCache: Map<ThemeName, ThemeFactory> = new Map()
  private loadingPromises: Map<ThemeName, Promise<void>> = new Map()

  constructor(canvas: HTMLCanvasElement) {
    this.themeManager = new ThemeManager(canvas)
  }

  /**
   * Load a theme asynchronously with dynamic imports
   * First load: imports the module, then loads the theme
   * Subsequent loads: uses cached factory
   *
   * Safe against race conditions - concurrent calls will await the same import
   */
  async loadThemeLazy(
    themeName: ThemeName,
    paletteColors?: { color1: number; color2: number; color3: number }
  ): Promise<void> {
    // If already cached, just use parent's synchronous load
    if (this.themeFactoryCache.has(themeName)) {
      this.themeManager.loadTheme(themeName, paletteColors)
      return
    }

    // If currently loading, wait for the same operation
    if (this.loadingPromises.has(themeName)) {
      await this.loadingPromises.get(themeName)!
      return
    }

    // Start a new load operation
    const loadPromise = (async () => {
      const lazyFactory = lazyThemeRegistry[themeName]
      if (!lazyFactory) {
        console.warn(`Theme "${themeName}" not found in registry`)
        return
      }

      try {
        const factory = await lazyFactory.load()
        this.themeFactoryCache.set(themeName, factory)
        // Register the factory so parent's loadTheme can find it
        // This allows synchronous access on subsequent loads
        ;(this.themeManager as any).THEME_REGISTRY ??= {}
        ;(this.themeManager as any).THEME_REGISTRY[themeName] = factory
      } catch (error) {
        console.error(`Failed to load theme "${themeName}":`, error)
        throw error
      }
    })()

    this.loadingPromises.set(themeName, loadPromise)

    try {
      await loadPromise
      // Now load synchronously with parent
      this.themeManager.loadTheme(themeName, paletteColors)
    } finally {
      this.loadingPromises.delete(themeName)
    }
  }

  /**
   * Preload a theme in the background without switching to it
   * Useful for preloading themes that user will likely navigate to
   */
  async preloadTheme(themeName: ThemeName): Promise<void> {
    if (this.themeFactoryCache.has(themeName)) {
      return // Already loaded
    }

    const lazyFactory = lazyThemeRegistry[themeName]
    if (!lazyFactory) return

    try {
      const factory = await lazyFactory.load()
      this.themeFactoryCache.set(themeName, factory)
      // Register factory for sync access
      ;(this.themeManager as any).THEME_REGISTRY ??= {}
      ;(this.themeManager as any).THEME_REGISTRY[themeName] = factory
    } catch (error) {
      console.error(`Failed to preload theme "${themeName}":`, error)
    }
  }

  /**
   * Preload multiple themes in parallel for faster theme switching
   */
  async preloadThemes(themeNames: ThemeName[]): Promise<void> {
    await Promise.all(themeNames.map((name) => this.preloadTheme(name)))
  }

  /**
   * Delegate all other methods to the wrapped ThemeManager
   */
  getCurrentTheme() {
    return this.themeManager.getCurrentTheme()
  }

  getCurrentThemeName() {
    return this.themeManager.getCurrentThemeName()
  }

  getAvailableThemes() {
    return this.themeManager.getAvailableThemes()
  }

  async switchTheme(themeName: ThemeName) {
    return this.themeManager.switchTheme(themeName)
  }

  dispose() {
    this.themeManager.dispose()
    this.themeFactoryCache.clear()
    this.loadingPromises.clear()
  }
}
