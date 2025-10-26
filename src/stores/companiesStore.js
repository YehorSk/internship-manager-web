import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'

export const useCompaniesStore = defineStore('companies', {
  state: () => ({
    companies: [],
    loading: false,
    error: null,
    fieldErrors: {},
    current_page: 1,
    current_page_items: 1,
    total_pages: 1,
    total_pages_items: 1,
  }),

  actions: {
    async fetchCompanies(search = '') {
      this.loading = true
      this.error = null
      try {
        const res = await axios.post('/api/companies/list?page=' + this.current_page,{
          params: {
            search: search
          }
        });
        this.companies = res.data.data || []      // array of companies
        this.current_page = res.data.current_page || 1
        this.total_pages = res.data.last_page || 1
      } catch (e) {
        handleError(e, this)
      } finally {
        this.loading = false
      }
    },

    async changeStatus(user_id, status) {
      // this.loading = true
      this.error = null
      try {
        const res = await axios.patch(`/api/companies/${user_id}`, { status })
        return res.data
      } catch (e) {
        handleError(e, this)
      } finally {
        // this.loading = false
      }
    },

    async searchCompanies(query = '') {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`/api/company/search/${query || ' '}`)
        this.companies = res.data.data
      } catch (e) {
        handleError(e, this)
      } finally {
        this.loading = false
      }
    },
  }
})

