import { afterEach, describe, expect, it, vi } from 'vitest'
import { LazyThemeManager, lazyThemeRegistry } from '../components/art/vectorCloud/themes/themeManagerLazy'
import type { ThemeFactory, ThemeSetupResult } from '../components/art/vectorCloud/themes/themeTypes'

const originalLoader = lazyThemeRegistry.magnetosphere.load

afterEach(() => {
  lazyThemeRegistry.magnetosphere.load = originalLoader
})

describe('LazyThemeManager', () => {
  it('loads a theme once, reuses its factory, and disposes each instance', async () => {
    const firstDispose = vi.fn()
    const secondDispose = vi.fn()
    let instance = 0
    const factory = vi.fn(() => ({
      scene: {},
      camera: {},
      renderer: {},
      update: vi.fn(),
      dispose: instance++ === 0 ? firstDispose : secondDispose,
    }) as unknown as ThemeSetupResult) as ThemeFactory
    const loader = vi.fn(async () => factory)
    lazyThemeRegistry.magnetosphere.load = loader

    const manager = new LazyThemeManager(document.createElement('canvas'))
    await manager.loadTheme('magnetosphere')
    await manager.loadTheme('magnetosphere')

    expect(loader).toHaveBeenCalledTimes(1)
    expect(factory).toHaveBeenCalledTimes(2)
    expect(firstDispose).toHaveBeenCalledTimes(1)

    manager.dispose()
    expect(secondDispose).toHaveBeenCalledTimes(1)
  })
})
