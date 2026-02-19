const DEFAULT_MEASUREMENT_ID = 'G-68N6G3WJ35'
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

const getCurrentPagePath = () => `${window.location.pathname}${window.location.search}${window.location.hash}`

export const initializeGoogleAnalytics = (measurementId = DEFAULT_MEASUREMENT_ID): boolean => {
  if (!isBrowser() || !measurementId) return false

  if (window.__gaMeasurementId === measurementId && typeof window.gtag === 'function') {
    return true
  }

  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = []
  }

  if (typeof window.gtag !== 'function') {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args)
    }
  }

  if (!document.getElementById(SCRIPT_ID) && !isTestRuntime()) {
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false })
  window.__gaMeasurementId = measurementId
  return true
}

export const trackPageView = (pagePath = getCurrentPagePath()): void => {
  if (!isBrowser() || typeof window.gtag !== 'function' || !window.__gaMeasurementId) return

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
    send_to: window.__gaMeasurementId,
  })
}
