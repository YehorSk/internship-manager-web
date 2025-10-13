import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_URL = env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
  const DEV_HOST = env.VITE_DEV_HOST || '0.0.0.0'
  const DEV_PORT = Number(env.VITE_DEV_PORT || 3000)

  return {
    plugins: [
      vue(),
      vuetify({ autoImport: true }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: DEV_HOST,
      port: DEV_PORT,
      proxy: {
        '^/(api|auth)': {
          target: API_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
