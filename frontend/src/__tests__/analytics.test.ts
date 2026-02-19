import { beforeEach, describe, expect, it, vi } from 'vitest'

import { initializeGoogleAnalytics, trackPageView } from '../utils/analytics'

const getWindow = () => window as Window & { gtag?: (...args: unknown[]) => void; __gaMeasurementId?: string; dataLayer?: unknown[] }

describe('analytics', () => {
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
    expect(testWindow.dataLayer?.[1]).toEqual(['config', 'G-TEST123', { send_page_view: false }])
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
      send_to: 'G-TEST123',
    }))
  })
})
