import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App.vue', () => {
  it('should render the app component', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('should have the hero component', () => {
    const wrapper = mount(App)
    expect(wrapper.findComponent({ name: 'VectorCloudHero' }).exists()).toBe(true)
  })

  it('should have navigation buttons', () => {
    const wrapper = mount(App)
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should contain ABOUT section in navigation', () => {
    const wrapper = mount(App)
    const text = wrapper.text()
    expect(text.includes('ABOUT')).toBe(true)
  })

  it('should contain SKILLS section in navigation', () => {
    const wrapper = mount(App)
    const text = wrapper.text()
    expect(text.includes('SKILLS')).toBe(true)
  })

  it('should contain RESUME section in navigation', () => {
    const wrapper = mount(App)
    const text = wrapper.text()
    expect(text.includes('RESUME')).toBe(true)
  })

  it('should contain CONTACT section in navigation', () => {
    const wrapper = mount(App)
    const text = wrapper.text()
    expect(text.includes('CONTACT')).toBe(true)
  })
})
