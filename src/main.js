import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import axios from 'axios'

const b = (import.meta.env.VITE_API_BASE_URL || window.location.origin).replace(/\/$/,'')
axios.defaults.baseURL = b.endsWith('/api') ? b : `${b}/api`

axios.interceptors.request.use(c => {
  const m = (c.method || 'get').toLowerCase()
  c.headers = { ...(c.headers || {}), Accept: 'application/vnd.api+json' }
  if (m === 'post' || m === 'put' || m === 'patch') c.headers['Content-Type'] = 'application/vnd.api+json'
  return c
})

const app = createApp(App)
app.config.globalProperties.$axios = axios
app.use(createPinia())
app.use(router)
app.use(createVuetify({ components, directives }))
app.mount('#app')
