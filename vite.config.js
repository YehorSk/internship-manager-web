import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      vuetify(),
    ],
    resolve:
      {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
      },
    server: {
      allowedHosts: [env.VITE_API_BASE_URL.replace(/^https?:\/\//, ''), 'localhost'],
      host: '0.0.0.0',
      port: 3000,
    }
  }
})
