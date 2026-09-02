import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from '../App.vue'

describe('application shell', () => {
  it('provides landmarks, a skip link, and primary navigation', () => {
    const wrapper = mount(App, {
      global: { stubs: { RouterLink: RouterLinkStub, RouterView: { template: '<div>Page content</div>' }, PrivacyControls: true, RouteAnnouncer: true } },
    })
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.get('main').attributes('id')).toBe('main-content')
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.get('.skip-link').attributes('href')).toBe('#main-content')
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Primary')
  })

  it('uses semantic links for every primary destination', () => {
    const wrapper = mount(App, {
      global: { stubs: { RouterLink: RouterLinkStub, RouterView: true, PrivacyControls: true, RouteAnnouncer: true } },
    })
    const destinations = wrapper.findAllComponents(RouterLinkStub).map((link) => link.props('to'))
    expect(destinations).toEqual(expect.arrayContaining(['/work', '/about', '/resume', '/lab', '/contact']))
  })
})
