import { createApp } from 'vue'
import { setupGlobDirectives } from '@/directives'
import { setupRouter } from '@/router'

import { setupStore } from '@/store'
import App from './App.vue'
import './assets/styles/index.scss'
import './assets/styles/tailwind.css'
import 'uno.css'

function setupApp() {
  const app = createApp(App)

  setupStore(app)
  setupRouter(app)
  setupGlobDirectives()

  app.mount('#app')
}
setupApp()
