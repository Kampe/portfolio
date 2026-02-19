import { beforeEach, describe, expect, it, vi } from 'vitest'

import { initializeGoogleAnalytics, trackPageView, trackEvent, trackSectionView, trackFormSubmission, trackExternalLink, trackNavigation, trackScrollDepth, trackError } from '../utils/analytics'

describe('analytics', () => {
  const getWindow = () => window as Window & { gtag?: (...args: unknown[]) => void; __gaMeasurementId?: string; dataLayer?: unknown[] }

  beforeEach(() => {
    const testWindow = getWindow()
    document.head.innerHTML = ''
    testWindow.dataLayer = []
    delete testWindow.gtag
    delete testWindow.__gaMeasurementId
  })

  it('injects the GA script and initializes gtag', () => {
    const initialized = initializeGoogleAnalytics('G-TEST123')
    const script = document.getElementById('google-analytics-gtag') as HTMLScriptElement | null
    const testWindow = getWindow()

    expect(initialized).toBe(true)
    if (script) {
      expect(script.src).toContain('https://www.googletagmanager.com/gtag/js?id=G-TEST123')
    }
    expect(testWindow.__gaMeasurementId).toBe('G-TEST123')
    expect(Array.isArray(testWindow.dataLayer)).toBe(true)
    expect(testWindow.dataLayer?.length).toBe(2)
    expect(testWindow.dataLayer?.[0]).toEqual(['js', expect.any(Date)])
    expect(testWindow.dataLayer?.[1]).toEqual(['config', 'G-TEST123', { send_page_view: true }])
  })

  it('does not inject duplicate scripts for repeated initialization', () => {
    initializeGoogleAnalytics('G-TEST123')
    initializeGoogleAnalytics('G-TEST123')

    const scripts = document.querySelectorAll('#google-analytics-gtag')
    expect(scripts.length).toBeLessThanOrEqual(1)
  })

  it('tracks page views when gtag is initialized', () => {
    initializeGoogleAnalytics('G-TEST123')
    const testWindow = getWindow()
    const gtagSpy = vi.fn()
    testWindow.gtag = gtagSpy
    testWindow.__gaMeasurementId = 'G-TEST123'

    trackPageView('/#skills')

    expect(gtagSpy).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
      page_path: '/#skills',
    }))
  })

  it('tracks custom events', () => {
    initializeGoogleAnalytics('G-TEST123')
    const testWindow = getWindow()
    const gtagSpy = vi.fn()
    testWindow.gtag = gtagSpy

    trackEvent('custom_event', { custom_param: 'value' })

    expect(gtagSpy).toHaveBeenCalledWith('event', 'custom_event', { custom_param: 'value' })
  })

  it('tracks section views', () => {
    initializeGoogleAnalytics('G-TEST123')
    const testWindow = getWindow()
    const gtagSpy = vi.fn()
    testWindow.gtag = gtagSpy

    trackSectionView('about')

    expect(gtagSpy).toHaveBeenCalledWith('event', 'section_view', expect.objectContaining({
      section_name: 'about',
    }))
  })

  it('tracks form submissions', () => {
    initializeGoogleAnalytics('G-TEST123')
    const testWindow = getWindow()
    const gtagSpy = vi.fn()
    testWindow.gtag = gtagSpy

    trackFormSubmission('contact_form', true)

    expect(gtagSpy).toHaveBeenCalledWith('event', 'form_submit', expect.objectContaining({
      form_name: 'contact_form',
      success: true,
    }))
  })

  it('tracks external links', () => {
    initializeGoogleAnalytics('G-TEST123')
    const testWindow = getWindow()
    const gtagSpy = vi.fn()
    testWindow.gtag = gtagSpy

    trackExternalLink('https://example.com', 'Example Link')

    expect(gtagSpy).toHaveBeenCalledWith('event', 'external_link_click', expect.objectContaining({
      url: 'https://example.com',
      link_text: 'Example Link',
    }))
  })

  it('tracks navigation', () => {
    initializeGoogleAnalytics('G-TEST123')
    const testWindow = getWindow()
    const gtagSpy = vi.fn()
    testWindow.gtag = gtagSpy

    trackNavigation('contact')

    expect(gtagSpy).toHaveBeenCalledWith('event', 'navigation', expect.objectContaining({
      target: 'contact',
    }))
  })

  it('tracks scroll depth', () => {
    initializeGoogleAnalytics('G-TEST123')
    const testWindow = getWindow()
    const gtagSpy = vi.fn()
    testWindow.gtag = gtagSpy

    trackScrollDepth(50)

    expect(gtagSpy).toHaveBeenCalledWith('event', 'scroll_depth', expect.objectContaining({
      depth_percent: 50,
    }))
  })

  it('tracks errors', () => {
    initializeGoogleAnalytics('G-TEST123')
    const testWindow = getWindow()
    const gtagSpy = vi.fn()
    testWindow.gtag = gtagSpy

    trackError('TypeError', 'Something went wrong', 'stack trace')

    expect(gtagSpy).toHaveBeenCalledWith('event', 'exception', expect.objectContaining({
      description: 'TypeError: Something went wrong',
      fatal: false,
    }))
  })
})
