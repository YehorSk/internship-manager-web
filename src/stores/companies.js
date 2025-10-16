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
        const res = await axios.post('/api/companies?page=' + this.current_page,{
          params: {
            search: search
          }
        });
        this.companies = res.data.data || []      // array of companies
        this.current_page = res.data.current_page || 1
        this.total_pages = res.data.last_page || 1
        console.log('Companies', this.companies)
      } catch (e) {
        handleError(e, this)
      } finally {
        this.loading = false
      }
    },


    async changeStatus(id, status) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.post(`/api/companies/${id}/company_change_status`, { status })
        await this.fetchCompanies()
        return res.data
      } catch (e) {
        handleError(e, this)
      } finally {
        this.loading = false
      }
    }
  }
})
