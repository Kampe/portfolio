import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import App from '../App.vue'

let wrapper: VueWrapper | undefined

function mountApp() {
  wrapper = mount(App, {
    attachTo: document.body,
    global: {
      stubs: {
        Teleport: true,
        VectorCloudHero: { template: '<div data-testid="hero">NICK KAMPE</div>' },
      },
    },
  })
  return wrapper
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  window.history.replaceState({}, '', '/')
  document.body.innerHTML = ''
})

describe('App.vue', () => {
  it('preserves the original hero and section navigation', () => {
    const app = mountApp()
    expect(app.text()).toContain('NICK KAMPE')
    expect(app.find('nav[aria-label="Portfolio sections"]').text()).toContain('ABOUT')
    expect(app.find('nav[aria-label="Portfolio sections"]').text()).toContain('SKILLS')
    expect(app.find('nav[aria-label="Portfolio sections"]').text()).toContain('RESUME')
    expect(app.find('nav[aria-label="Portfolio sections"]').text()).toContain('CONTACT')
  })

  it('opens the original about content in an accessible dialog', async () => {
    const app = mountApp()
    await app.get('button').trigger('click')

    const dialog = app.get('[role="dialog"]')
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.text()).toContain('Infrastructure Architect & Platform Engineer')
    expect(window.location.hash).toBe('#about')
  })

  it('closes a section with Escape', async () => {
    const app = mountApp()
    await app.get('button').trigger('click')
    await app.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })

    expect(app.find('[role="dialog"]').exists()).toBe(false)
  })
})
