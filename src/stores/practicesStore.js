import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'
import { useAuthStore } from '@/stores/authStore.js'

export const usePracticesStore = defineStore('practices', {
  state: () => ({
    list: [],
    loading: false,
    error: '',
    success: '',
    fieldErrors: {},
  }),

  actions: {
    async createPractice(data) {
      this.loading = true
      this.error = ''
      this.success = ''
      this.fieldErrors = {}

      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const { data: response } = await axios.post('/api/practices/', data)
        this.success = response.message || 'Prax bola úspešne vytvorená!'
        this.list.push(response.data)
      } catch (e) {
        handleError(e, this)
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
