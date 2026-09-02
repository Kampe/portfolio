import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import './styles/global.css'
import { trackPageView } from './utils/analytics'

export const createApp = ViteSSG(App, { routes, scrollBehavior: () => ({ top: 0 }) }, ({ router, isClient }) => {
  if (isClient) router.afterEach((to) => trackPageView(to.fullPath))
})
