import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'
import { useToastStore } from '@/stores/toastStore.js'
import { useLoadingStore } from '@/stores/loadingStore.js'
import { useProfileStore } from '@/stores/profileStore.js'

export const useCompaniesStore = defineStore('companies', {
  state: () => ({
    companies: [],
    loading: false,
    fieldErrors: {},
    current_page: 1,
    current_page_items: 1,
    total_pages: 1,
    total_pages_items: 1,
    activated: false,
  }),

  actions: {
    setPage(page) {
      this.current_page = page
    },
    async fetchCompanies(search = '') {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start('fetchCompanies')
      try {
        const res = await axios.post('/api/companies/list?page=' + this.current_page, {
          search: search,
        })
        this.companies = res.data.data || []
        this.current_page =
          res.data.meta?.current_page || res.data.current_page || this.current_page
        this.total_pages = res.data.meta?.last_page || res.data.last_page || 1
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        loading.stop('fetchCompanies')
      }
    },

    async changePage(page, search = '') {
      this.current_page = page
      await this.fetchCompanies(search)
    },

    async changeStatus(user_id, status) {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start(`changeStatus_${status}_${user_id}`)
      try {
        const { data: response } = await axios.patch(`/api/companies/${user_id}`, { status })
        toast.showSuccess(response.message)
        const company = this.companies.find((c) => c.user_id === user_id)
        if (company) company.status = status
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        loading.stop(`changeStatus_${status}_${user_id}`)
      }
    },

    async searchCompanies(query = '') {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start(`searchCompanies`)
      try {
        const res = await axios.get('/api/company/search', {
          params: { value: query },
        })
        this.companies = res.data.data
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        loading.stop(`searchCompanies`)
      }
    },
    async activateCompany(token) {
      if (!token) return
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start(`activateCompany`)
      try {
        const { data: response } = await axios.get('/api/company/activate/' + token)
        if (response?.success) {
          toast.showSuccess(response.message)
          this.activated = true
        } else {
          toast.showSuccess(response.message)
        }
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        loading.stop(`activateCompany`)
      }
    },
    async activateCompanyData(token, data) {
      if (!token) return
      const toast = useToastStore()
      const loading = useLoadingStore()
      const profileStore = useProfileStore()
      const lang = profileStore.lang || 'sk'
      loading.start(`activateCompany`)
      try {
        const { data: response } = await axios.post('/api/company/activate-data/' + token, data, {
          headers: { lang },
        })
        if (response?.success) {
          toast.showSuccess(response.message)
          this.activated = true
        } else {
          toast.showSuccess(response.message)
        }
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        loading.stop(`activateCompany`)
      }
    },
  },
})

