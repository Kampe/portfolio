import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initializeGoogleAnalytics, trackEvent, trackFormSubmission, trackPageView } from '../utils/analytics'

describe('analytics', () => {
  const analyticsWindow = () => window as Window & { gtag?: (...args: unknown[]) => void; __gaMeasurementId?: string; dataLayer: unknown[] }

  beforeEach(() => {
    document.head.innerHTML = ''
    analyticsWindow().dataLayer = []
    delete analyticsWindow().gtag
    delete analyticsWindow().__gaMeasurementId
  })

  it('initializes without sending a duplicate automatic page view', () => {
    expect(initializeGoogleAnalytics('G-TEST123')).toBe(true)
    expect(analyticsWindow().__gaMeasurementId).toBe('G-TEST123')
    expect(analyticsWindow().dataLayer[1]).toEqual(['config', 'G-TEST123', { send_page_view: false, anonymize_ip: true }])
  })

  it('does not create duplicate scripts', () => {
    initializeGoogleAnalytics('G-TEST123')
    initializeGoogleAnalytics('G-TEST123')
    expect(document.querySelectorAll('#google-analytics-gtag')).toHaveLength(0)
  })

  it('tracks page, form, and custom events only after initialization', () => {
    initializeGoogleAnalytics('G-TEST123')
    const spy = vi.fn()
    analyticsWindow().gtag = spy
    trackPageView('/work')
    trackFormSubmission('contact_form', true)
    trackEvent('case_study_open', { slug: 'yuga-platform' })
    expect(spy).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({ page_path: '/work' }))
    expect(spy).toHaveBeenCalledWith('event', 'form_submit', { form_name: 'contact_form', success: true })
    expect(spy).toHaveBeenCalledWith('event', 'case_study_open', { slug: 'yuga-platform' })
  })
})
