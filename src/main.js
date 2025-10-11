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

let baseUrl = import.meta.env.VITE_API_BASE_URL
if (!baseUrl) {
  baseUrl = window.location.origin
}
axios.defaults.baseURL = baseUrl

axios.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    Accept: 'application/vnd.api+json',
  }

  const method = (config.method || 'get').toLowerCase()
  if (['post', 'put', 'patch'].includes(method)) {
    config.headers['Content-Type'] = 'application/vnd.api+json'
  }

  return config
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(createVuetify({ components, directives }))
app.mount('#app')
