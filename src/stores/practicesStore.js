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
    current_page: 1,
    total_pages: 1,
    per_page: 10,
    total_items: 0,
  }),

  actions: {
    async fetchPractices(filters = {}) {
      this.loading = true
      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const search = {}
        if (filters.status) search.status = filters.status
        if (filters.semester) {
          search.semester = filters.semester === 'Zimný' ? 'winter' : 'summer'
        }
        if (filters.year) search.academic_year = filters.year
        if (filters.company_name || filters.search)
          search.company_name = filters.company_name || filters.search

        const payload = {
          page: this.current_page,
          itemsPerPage: this.per_page,
          ...(Object.keys(search).length ? { search } : {})
        }

        const { data } = await axios.post('/api/practices/list', payload)

        this.list = data.data || []
        this.current_page = data.meta?.current_page || data.current_page || 1
        this.total_pages = data.meta?.last_page || data.last_page || 1
        this.total_items = data.meta?.total || data.total || this.list.length
      } catch (e) {
        handleError(e, this)
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
        await this.fetchPractices()
      } catch (e) {
        handleError(e, this)
        throw e
      } finally {
        this.loading = false
      }
    },

    async updatePractice(id, data) {
      this.loading = true
      this.error = ''
      this.success = ''
      this.fieldErrors = {}

      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const { data: response } = await axios.put(`/api/practices/${id}`, data)
        this.success = response.message || 'Prax bola úspešne aktualizovaná!'
        await this.fetchPractices()
      } catch (e) {
        console.error(e.response?.data || e)
        handleError(e, this)
        throw e
      } finally {
        this.loading = false
      }
    },

    async getPractice(id) {
      this.loading = true
      this.error = ''
      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const { data } = await axios.get(`/api/practices/${id}`)
        return data.data
      } catch (e) {
        handleError(e, this)
        throw e
      } finally {
        this.loading = false
      }
    },

    async deletePractice(id) {
      try {
        const response = await axios.delete(`/api/practices/${id}`)
        return response.data
      } catch (error) {
        throw error.response?.data || error
      }
    },

    async changePage(page, filters = {}) {
      this.current_page = page
      await this.fetchPractices(filters)
    },
  },
})
