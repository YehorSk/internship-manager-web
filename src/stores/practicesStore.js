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
        if (filters.semester)
          search.semester = filters.semester === 'Zimný' ? 'winter' : 'summer'
        if (filters.year) search.academic_year = filters.year
        if (filters.company_name)
          search.company_name = filters.company_name
        if (filters.study_program)
          search.study_program_name = filters.study_program
        if (filters.student)
          search.student_name = filters.student

        const payload = {
          page: this.current_page,
          itemsPerPage: this.per_page,
          ...(Object.keys(search).length ? { search } : {})
        }

        const endpoint = '/api/practices/list'
        const { data } = await axios.post(endpoint, payload)

        this.list = (data.data || []).map(p => {
          const updated = { ...p }
          if (p.student) {
            updated.student = {
              ...p.student,
              full_name: `${p.student.first_name} ${p.student.last_name}`
            }
          }
          return updated
        })

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

    async uploadAgreement(practiceId, file) {
      this.loading = true
      this.error = ''
      this.success = ''
      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const formData = new FormData()
        formData.append('practice_id', practiceId)
        formData.append('document', file)
        formData.append('document_type', 'agreement')

        const { data } = await axios.post('/api/practices/upload-document', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        this.success = data.message || 'Dohoda bola úspešne nahratá!'
        return data
      } catch (e) {
        handleError(e, this)
        throw e
      } finally {
        this.loading = false
      }
    },
    async downloadAgreementTemplate(practiceId) {
      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const response = await axios.get(`/api/practices/${practiceId}/download-agreement`, {
          responseType: 'blob',
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `dohoda_${practiceId}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (e) {
        handleError(e, this)
        throw e
      }
    },
    async requestAgreementApproval(practiceId) {
      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const { data } = await axios.get(`/api/practices/${practiceId}/agreement-confirmation-request`)
        this.success = data.message || 'Žiadosť o schválenie bola odoslaná!'
        return data
      } catch (e) {
        handleError(e, this)
        throw e
      }
    },
    async downloadUploadedDocument(practiceId, filePath) {
      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const { data } = await axios.get(`/api/practices/${practiceId}/download-document`, {
          params: { file_path: filePath }
        })
        return data
      } catch (e) {
        handleError(e, this)
        throw e
      }
    },

    async uploadReport(practiceId, file) {
      this.loading = true
      this.error = ''
      this.success = ''
      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const formData = new FormData()
        formData.append('practice_id', practiceId)
        formData.append('document', file)
        formData.append('document_type', 'report')

        const { data } = await axios.post('/api/practices/upload-document', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        this.success = data.message || 'Správa bola úspešne nahratá!'
        return data
      } catch (e) {
        handleError(e, this)
        throw e
      } finally {
        this.loading = false
      }
    },

    async downloadUploadedReport(practiceId, filePath) {
      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const { data } = await axios.get(`/api/practices/${practiceId}/download-document`, {
          params: { file_path: filePath }
        })
        return data
      } catch (e) {
        handleError(e, this)
        throw e
      }
    },

    async deleteUploadedDocument(practiceId, filePath) {
      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const { data } = await axios.delete(`/api/practices/${practiceId}/delete-document`, {
          data: { file_path: filePath }
        })

        this.success = data.message || 'Dokument bol úspešne odstránený!'
        return data
      } catch (e) {
        handleError(e, this)
        throw e
      }
    },

    async downloadReportTemplate(practiceId) {
      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const response = await axios.get(`/api/practices/${practiceId}/download-report`, {
          responseType: 'blob',
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `sprava_${practiceId}.docx`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (e) {
        handleError(e, this)
        throw e
      }
    },

    async requestReportApproval(practiceId) {
      try {
        const auth = useAuthStore()
        if (auth.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

        const { data } = await axios.get(`/api/practices/${practiceId}/report-confirmation-request`)
        this.success = data.message || 'Žiadosť o schválenie správy bola odoslaná!'
        return data
      } catch (e) {
        handleError(e, this)
        throw e
      }
    },

  },
})
