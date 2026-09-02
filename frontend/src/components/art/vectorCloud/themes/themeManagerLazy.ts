import type { ThemeConfig, ThemeFactory, ThemeName, ThemeSetupResult } from './themeTypes'

export interface LazyThemeFactory {
  load(): Promise<ThemeFactory>
  name: ThemeName
}

export const lazyThemeRegistry: Record<ThemeName, LazyThemeFactory> = {
  spectrum: {
    name: 'spectrum',
    load: () => import('./spectrumAnalyzer').then((module) => module.createSpectrumAnalyzerTheme),
  },
  kaleidoscope: {
    name: 'kaleidoscope',
    load: () => import('./kaleidoscopeFractals').then((module) => module.createKaleidoscopeFractalsTheme),
  },
  milkdrop: {
    name: 'milkdrop',
    load: () => import('./dmtMorphing').then((module) => module.createDMTMorphingTheme),
  },
  dmt: {
    name: 'dmt',
    load: () => import('./dmtGeometry').then((module) => module.createDMTGeometryTheme),
  },
  vectorfield: {
    name: 'vectorfield',
    load: () => import('./vectorFieldFloor').then((module) => module.createVectorFieldFloorTheme),
  },
  magnetosphere: {
    name: 'magnetosphere',
    load: () => import('./chargedMagnetosphere').then((module) => module.createChargedMagnetosphereTheme),
  },
}

export function getThemeFromURL(): ThemeName | null {
  const requested = new URLSearchParams(window.location.search).get('theme')
  return requested && requested in lazyThemeRegistry ? requested as ThemeName : null
}

type PaletteColors = { color1: number; color2: number; color3: number }

/** Loads visualization themes on demand while owning their complete lifecycle. */
export class LazyThemeManager {
  private currentTheme: ThemeSetupResult | null = null
  private currentThemeName: ThemeName = 'magnetosphere'
  private readonly factoryCache = new Map<ThemeName, ThemeFactory>()
  private readonly loading = new Map<ThemeName, Promise<ThemeFactory>>()

  constructor(private readonly canvas: HTMLCanvasElement) {}

  private loadFactory(themeName: ThemeName): Promise<ThemeFactory> {
    const cached = this.factoryCache.get(themeName)
    if (cached) return Promise.resolve(cached)

    const pending = this.loading.get(themeName)
    if (pending) return pending

    const factory = lazyThemeRegistry[themeName].load().then((loaded) => {
      this.factoryCache.set(themeName, loaded)
      this.loading.delete(themeName)
      return loaded
    }, (error) => {
      this.loading.delete(themeName)
      throw error
    })
    this.loading.set(themeName, factory)
    return factory
  }

  async loadTheme(
    themeName: ThemeName,
    paletteColors?: PaletteColors,
    config: Partial<ThemeConfig> = {},
  ): Promise<ThemeSetupResult> {
    const factory = await this.loadFactory(themeName)
    this.currentTheme?.dispose()
    this.currentTheme = factory(this.canvas, { ...config, paletteColors })
    this.currentThemeName = themeName
    return this.currentTheme
  }

  loadThemeLazy(themeName: ThemeName, paletteColors?: PaletteColors): Promise<ThemeSetupResult> {
    return this.loadTheme(themeName, paletteColors)
  }

  async preloadTheme(themeName: ThemeName): Promise<void> {
    await this.loadFactory(themeName)
  }

  async preloadThemes(themeNames: ThemeName[]): Promise<void> {
    await Promise.all(themeNames.map((themeName) => this.preloadTheme(themeName)))
  }

  getCurrentTheme(): ThemeSetupResult | null {
    return this.currentTheme
  }

  getCurrentThemeName(): ThemeName {
    return this.currentThemeName
  }

  getAvailableThemes(): ThemeName[] {
    return Object.keys(lazyThemeRegistry) as ThemeName[]
  }

  switchTheme(themeName: ThemeName, paletteColors?: PaletteColors): Promise<ThemeSetupResult> {
    return this.loadTheme(themeName, paletteColors)
  }

  dispose(): void {
    this.currentTheme?.dispose()
    this.currentTheme = null
    this.factoryCache.clear()
    this.loading.clear()
  }
}
