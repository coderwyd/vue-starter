import 'uno.css'
import './assets/styles/index.scss'
import './assets/styles/tailwind.css'

import { createApp } from 'vue'
import { setupGlobDirectives } from '@/directives'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import App from './App.vue'

(() => {
  const app = createApp(App)

  setupStore(app)
  setupRouter(app)
  setupGlobDirectives()

  app.mount('#app')
})()
