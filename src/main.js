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
import { useAuthStore } from '@/stores/authStore.js'
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

let baseUrl = import.meta.env.VITE_API_BASE_URL
if (!baseUrl) {
  baseUrl = window.location.origin
}
axios.defaults.baseURL = baseUrl

const app = createApp(App)
app.use(Toast)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(createVuetify({ components, directives }))
app.mount('#app')


const store = useAuthStore(pinia)

axios.interceptors.request.use(config => {
    if(store.token){
      config.headers.Authorization = `Bearer ${store.token}`;
    }
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config
  },
  (error) => {
    return Promise.reject(error);
  });

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response?.status === 401) {
      store.logout()
      console.log("Unauthorized response");
    }
    return Promise.reject(error);
  }
);
