import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'
import { useToastStore } from '@/stores/toastStore.js'

export const useCompaniesStore = defineStore('companies', {
  state: () => ({
    companies: [],
    loading: false,
    fieldErrors: {},
    current_page: 1,
    current_page_items: 1,
    total_pages: 1,
    total_pages_items: 1,
    activated: false
  }),

  actions: {
    async fetchCompanies(search = '') {
      const toast = useToastStore()
      this.loading = true
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
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },

    async changeStatus(user_id, status) {
      const toast = useToastStore()
      try {
        const { data: response } = await axios.patch(`/api/companies/${user_id}`, { status })
        toast.showSuccess(response.message)
        return response
      } catch (e) {
        handleError(e, this, toast)
      }
    },

    async searchCompanies(query = '') {
      const toast = useToastStore()
      this.loading = true
      try {
        const res = await axios.get('/api/company/search', {
          params: { value: query }
        });
        this.companies = res.data.data
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },
    async activateCompany(token) {
      if (!token) return
      const toast = useToastStore()
      this.loading = true
      let message = ''
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
        const url = `${baseUrl.replace(/\/$/, '')}/api/company/activate/${token}`
        const { data } = await axios.get(url)
        if (data?.success) {
          message = data.message
          toast.showSuccess(message)
          this.activated = true
        } else {
          message = data?.message
          toast.showError(message)
        }
      } catch (e) {
        message = e?.response?.data?.message || e.message
        toast.showError(message)
      } finally {
        this.loading = false
      }
    }
  }
})

