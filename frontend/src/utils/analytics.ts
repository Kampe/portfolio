const DEFAULT_MEASUREMENT_ID = import.meta.env.VITE_GA_ID || 'G-68N6G3WJ35'
const SCRIPT_ID = 'google-analytics-gtag'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
    __gaMeasurementId?: string
  }
}

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined'
const isTestRuntime = () => typeof navigator !== 'undefined' && /happy.?dom|jsdom/i.test(navigator.userAgent)

function privacySignalEnabled() {
  if (!isBrowser()) return true
  const navigatorWithGpc = navigator as Navigator & { globalPrivacyControl?: boolean }
  return navigator.doNotTrack === '1' || navigatorWithGpc.globalPrivacyControl === true
}

export function initializeGoogleAnalytics(measurementId = DEFAULT_MEASUREMENT_ID): boolean {
  if (!isBrowser() || privacySignalEnabled() || !measurementId) return false
  if (document.getElementById(SCRIPT_ID)) return true

  window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : []
  window.gtag = window.gtag || ((...args: unknown[]) => { window.dataLayer.push(args) })
  window.__gaMeasurementId = measurementId

  if (!isTestRuntime()) {
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
    document.head.appendChild(script)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false, anonymize_ip: true })
  return true
}

export function trackPageView(pagePath: string): void {
  if (!isBrowser() || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function trackEvent(eventName: string, eventData: Record<string, unknown> = {}): void {
  if (!isBrowser() || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, eventData)
}

export function trackFormSubmission(formName: string, success: boolean): void {
  trackEvent('form_submit', { form_name: formName, success })
}
