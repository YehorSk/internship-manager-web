import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.js'
import { useToastStore } from '@/stores/toastStore.js'
import { handleError } from '@/utils/httpError.js'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    loading: false,
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
      } finally {
        this.loading = false
      }
    }

  },
})
