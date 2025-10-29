import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'
import { useAuthStore } from '@/stores/authStore.js'

export const useCompaniesPracticesStore = defineStore('companiesPractices', {
  state: () => ({
    list: [],
    loading: false,
    error: '',
    success: '',
    fieldErrors: {},
  }),

  actions: {
    async fetchCompanies() {
      this.loading = true
      this.error = null
      try{
        const res = await axios.post('/api/practices/list')
        this.list = res.data
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
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
