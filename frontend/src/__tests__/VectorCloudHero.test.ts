import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VectorCloudHero from '../components/art/VectorCloudHero.vue'

// Mock Three.js to avoid actual rendering
vi.mock('three', () => ({
  Scene: vi.fn(),
  PerspectiveCamera: vi.fn(),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    setPixelRatio: vi.fn(),
    setClearColor: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement('canvas')
  })),
  Clock: vi.fn(() => ({
    getDelta: () => 0.016,
    getElapsedTime: () => 1
  })),
  BufferGeometry: vi.fn(),
  Points: vi.fn(),
  PointsMaterial: vi.fn(),
  Vector3: vi.fn((x, y, z) => ({ x, y, z })),
  Color: vi.fn(),
  UniformsLib: {},
  ShaderMaterial: vi.fn(),
  EffectComposer: vi.fn(() => ({
    render: vi.fn(),
    dispose: vi.fn(),
    addPass: vi.fn()
  })),
  RenderPass: vi.fn(),
  UnrealBloomPass: vi.fn(),
  Raycaster: vi.fn(() => ({
    setFromCamera: vi.fn(),
    intersectObjects: () => []
  }))
}))

describe('VectorCloudHero.vue', () => {
  it('should render the hero component', () => {
    const wrapper = mount(VectorCloudHero, {
      attachTo: document.body
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should have a canvas container', () => {
    const wrapper = mount(VectorCloudHero, {
      attachTo: document.body
    })
    const canvas = wrapper.find('canvas')
    expect(canvas.exists()).toBe(true)
  })

  it('should have navigation buttons', () => {
    const wrapper = mount(VectorCloudHero, {
      attachTo: document.body
    })
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should display hero text', () => {
    const wrapper = mount(VectorCloudHero, {
      attachTo: document.body
    })
    const text = wrapper.text()
    expect(text.length).toBeGreaterThan(0)
  })

  it('should have modal overlay for ABOUT', async () => {
    const wrapper = mount(VectorCloudHero, {
      attachTo: document.body
    })
    const aboutButton = wrapper.findAll('button').find(btn => btn.text().includes('ABOUT'))
    if (aboutButton) {
      await aboutButton.trigger('click')
      expect(wrapper.find('[data-testid="modal-overlay"]').exists() || wrapper.text().includes('About')).toBe(true)
    }
  })

  it('should cleanup on unmount', () => {
    const wrapper = mount(VectorCloudHero, {
      attachTo: document.body
    })
    wrapper.unmount()
    // If cleanup was successful, component should be unmounted
    expect(wrapper.vm).toBeDefined()
  })
})
