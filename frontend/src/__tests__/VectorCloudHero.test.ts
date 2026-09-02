import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { palettes } from '../utils/colorPalettes'

const themeMocks = vi.hoisted(() => ({
  loadTheme: vi.fn(),
  update: vi.fn(),
  dispose: vi.fn(),
  render: vi.fn(),
}))

vi.mock('gsap', () => {
  const timeline = { fromTo: vi.fn(), kill: vi.fn() }
  timeline.fromTo.mockReturnValue(timeline)
  return {
    default: {
      timeline: vi.fn(() => timeline),
      to: vi.fn(),
      fromTo: vi.fn(),
      killTweensOf: vi.fn(),
    },
  }
})

vi.mock('../components/art/vectorCloud/themes/themeManagerLazy', () => ({
  getThemeFromURL: () => null,
  LazyThemeManager: class {
    private theme = {
      scene: {},
      camera: {},
      renderer: { render: themeMocks.render },
      composer: { render: themeMocks.render, dispose: vi.fn() },
      update: themeMocks.update,
      dispose: themeMocks.dispose,
    }

    async loadTheme(name: string, palette: unknown) {
      themeMocks.loadTheme(name, palette)
      return this.theme
    }

    getCurrentTheme() {
      return this.theme
    }

    dispose() {
      themeMocks.dispose()
    }
  },
}))

import VectorCloudHero from '../components/art/VectorCloudHero.vue'

let wrapper: VueWrapper | undefined
let animationFrames: FrameRequestCallback[]

const advanceInitialPaint = async () => {
  await flushPromises()
  animationFrames.shift()?.(performance.now())
  await new Promise((resolve) => setTimeout(resolve, 0))
  await flushPromises()
}

beforeEach(() => {
  animationFrames = []
  vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
    animationFrames.push(callback)
    return animationFrames.length
  }))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  themeMocks.loadTheme.mockClear()
  themeMocks.update.mockClear()
  themeMocks.dispose.mockClear()
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.unstubAllGlobals()
})

describe('VectorCloudHero.vue', () => {
  it('preserves the original hero content and initializes magnetosphere', async () => {
    wrapper = mount(VectorCloudHero, { props: { palette: palettes[0] } })
    await advanceInitialPaint()

    expect(wrapper.text()).toContain('NICK KAMPE')
    expect(wrapper.text()).toContain('Platform Engineer')
    expect(wrapper.text()).toContain('Contact Me')
    expect(themeMocks.loadTheme).toHaveBeenCalledWith('magnetosphere', {
      color1: 0xff006e,
      color2: 0x00ffff,
      color3: 0x0099ff,
    })
  })

  it('emits the existing contact action', async () => {
    wrapper = mount(VectorCloudHero, { props: { palette: palettes[0] } })
    await flushPromises()
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('open-contact')).toHaveLength(1)
  })

  it('disposes animation resources on unmount', async () => {
    wrapper = mount(VectorCloudHero, { props: { palette: palettes[0] } })
    await advanceInitialPaint()
    wrapper.unmount()
    wrapper = undefined
    expect(themeMocks.dispose).toHaveBeenCalled()
  })
})
