import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.js'
import { useToastStore } from '@/stores/toastStore.js'
import { handleError } from '@/utils/httpError.js'
import { useStorage } from '@vueuse/core'
import i18n from '@/i18n'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    loading: false,
    lang: useStorage('language', 'sk')
  }),

  actions: {
    async updateProfile(data) {
      const toast = useToastStore()
      const authStore = useAuthStore()
      this.loading = true

      try {
        const response = await axios.post('/api/auth/update-profile', data)
        authStore.user = response.data.data
        toast.showSuccess(response.data.message)
        return response.data
      } catch (e) {
        handleError(e, this, toast)
        throw e
      } finally {
        this.loading = false
      }
    },
    async setLanguage(l) {
      const auth = useAuthStore()
      this.lang = l
      i18n.global.locale.value = l
      if (auth.token) {
        await axios.put('/api/auth/update-language', { language: l }).catch(() => {})
      }
    }
  }
})
