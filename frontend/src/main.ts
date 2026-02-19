import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'
import { initializeGoogleAnalytics } from './utils/analytics'

const app = createApp(App)

initializeGoogleAnalytics()
app.mount('#app')
