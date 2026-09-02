import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'
import { initializeGoogleAnalytics } from './utils/analytics'

const app = createApp(App)

if (['nickkampe.com', 'www.nickkampe.com'].includes(window.location.hostname)) {
  initializeGoogleAnalytics()
}
app.mount('#app')
