import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'
import { useToastStore } from '@/stores/toastStore.js'

export const usePracticesStore = defineStore('practices', {
  state: () => ({
    list: [],
    students: [],
    loading: false,
    fieldErrors: {},
    current_page: 1,
    total_pages: 1,
    per_page: 10,
    total_items: 0,
    statistics: [],
    pending: [],
    statisticsLoading: false,
  }),

  actions: {
    async fetchPractices(filters = {}) {
      const toast = useToastStore()
      this.loading = true
      try {
        const search = {}
        if (filters.status) search.status = filters.status
        if (filters.semester) search.semester = filters.semester
        if (filters.year) search.academic_year = filters.year
        if (filters.company_name) search.company_name = filters.company_name
        if (filters.study_program) search.study_program_name = filters.study_program
        if (filters.student) search.student_name = filters.student

        const payload = {
          page: this.current_page,
          itemsPerPage: this.per_page,
          ...(Object.keys(search).length ? { search } : {}),
        }

        const { data } = await axios.post('/api/practices/list', payload)

        this.list = (data.data || []).map((p) => {
          const updated = { ...p }
          if (p.student) {
            updated.student = {
              ...p.student,
              full_name: `${p.student.first_name} ${p.student.last_name}`,
            }
          }
          return updated
        })

        this.current_page = data.meta?.current_page || data.current_page || 1
        this.total_pages = data.meta?.last_page || data.last_page || 1
        this.total_items = data.meta?.total || data.total || this.list.length
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },

    async createPractice(data) {
      const toast = useToastStore()
      this.loading = true
      this.fieldErrors = {}
      try {
        const { data: response } = await axios.post('/api/practices/', data)
        toast.showSuccess(response.message)
        await this.fetchPractices()
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },

    async updatePractice(id, data) {
      const toast = useToastStore()
      this.loading = true
      this.fieldErrors = {}
      try {
        const { data: response } = await axios.put(`/api/practices/${id}`, data)
        toast.showSuccess(response.message)
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },

    async getPractice(id) {
      const toast = useToastStore()
      this.loading = true
      try {
        const { data } = await axios.get(`/api/practices/${id}`)
        return data.data
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },

    async deletePractice(id) {
      const toast = useToastStore()
      try {
        const { data: response } = await axios.delete(`/api/practices/${id}`)
        toast.showSuccess(response.message)
        return response.data
      } catch (e) {
        handleError(e, this, toast)
      }
    },

    async changePage(page, filters = {}) {
      this.current_page = page
      await this.fetchPractices(filters)
    },

    async uploadAgreement(practiceId, file) {
      const toast = useToastStore()
      this.loading = true
      try {
        const formData = new FormData()
        formData.append('practice_id', practiceId)
        formData.append('document', file)
        formData.append('document_type', 'agreement')

        const { data } = await axios.post('/api/practices/upload-document', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        toast.showSuccess(data.message)
        return data
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },
    async downloadAgreementTemplate(practiceId) {
      const toast = useToastStore()
      try {
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
        handleError(e, this, toast)
      }
    },
    async requestAgreementApproval(practiceId) {
      const toast = useToastStore()
      try {
        const { data } = await axios.get(
          `/api/practices/${practiceId}/agreement-confirmation-request`
        )
        toast.showSuccess(data.message)
        return data
      } catch (e) {
        handleError(e, this, toast)
      }
    },
    async downloadUploadedDocument(practiceId, filePath) {
      const toast = useToastStore()
      try {
        const { data } = await axios.get(`/api/practices/${practiceId}/download-document`, {
          params: { file_path: filePath },
        })
        return data
      } catch (e) {
        handleError(e, this, toast)
      }
    },

    async uploadReport(practiceId, file) {
      const toast = useToastStore()
      this.loading = true
      try {
        const formData = new FormData()
        formData.append('practice_id', practiceId)
        formData.append('document', file)
        formData.append('document_type', 'report')

        const { data } = await axios.post('/api/practices/upload-document', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        toast.showSuccess(data.message)
        return data
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },

    async downloadUploadedReport(practiceId, filePath) {
      const toast = useToastStore()
      try {
        const { data } = await axios.get(`/api/practices/${practiceId}/download-document`, {
          params: { file_path: filePath },
        })
        return data
      } catch (e) {
        handleError(e, this, toast)
      }
    },

    async deleteUploadedDocument(practiceId, filePath) {
      const toast = useToastStore()
      try {
        const { data } = await axios.delete(`/api/practices/${practiceId}/delete-document`, {
          data: { file_path: filePath },
        })

        toast.showSuccess(data.message)
        return data
      } catch (e) {
        handleError(e, this, toast)
      }
    },

    async downloadReportTemplate(practiceId) {
      const toast = useToastStore()
      try {
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
        handleError(e, this, toast)
      }
    },

    async requestReportApproval(practiceId) {
      const toast = useToastStore()
      try {
        const { data } = await axios.get(`/api/practices/${practiceId}/report-confirmation-request`)
        this.success = data.message
        return data
      } catch (e) {
        handleError(e, this, toast)
      }
    },

    async updateDocumentStatus(practiceId, documentType, status, comment = '') {
      const toast = useToastStore()
      try {
        const { data } = await axios.patch(`/api/practices/${practiceId}/update-document-status`, {
          document_type: documentType,
          status: status,
          comment: comment,
        })
        toast.showSuccess(data.message)
        return data
      } catch (e) {
        handleError(e, this, toast)
      }
    },
    async fetchStatistics() {
      const toast = useToastStore()
      this.loading = true
      try {
        const { data } = await axios.get('/api/practices/statistics')
        this.statistics = data
        console.log(this.statistics);
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },
  },
})
