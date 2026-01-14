import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'
import { useToastStore } from '@/stores/toastStore.js'
import { useLoadingStore } from '@/stores/loadingStore.js'

export const usePracticesStore = defineStore('practices', {
  state: () => ({
    list: [],
    last_added_list: [],
    students: [],
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
    setPage(page) {
      this.current_page = page
    },
    async fetchPractices(filters = {}) {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start("fetchPractices")
      try {
        const search = {}
        if (filters.status) search.status = filters.status
        if (filters.semester) search.semester = filters.semester
        if (filters.year) search.academic_year = filters.year
        if (filters.company_name) search.company_name = filters.company_name
        if (filters.study_program) search.study_program_name = filters.study_program
        if (filters.student_name) search.student_name = filters.student_name

        const payload = {
          page: this.current_page,
          itemsPerPage: this.per_page,
          ...(Object.keys(search).length ? { search } : {}),
        }

        const { data } = await axios.post('/api/practices/list', payload)
        this.last_added_list = []
        this.list = data.data

        this.current_page = data.meta?.current_page || data.current_page || 1
        this.total_pages = data.meta?.last_page || data.last_page || 1
        this.total_items = data.meta?.total || data.total || this.list.length
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        loading.stop("fetchPractices")
      }
    },

    async createPractice(data) {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start("createPractice")
      this.fieldErrors = {}
      try {
        const { data: response } = await axios.post('/api/practices/', data)
        toast.showSuccess(response.message)
        this.last_added_list.push(response.data)
      } catch (e) {
        handleError(e, this, toast)
        throw e
      } finally {
        loading.stop("createPractice")
      }
    },

    async updatePractice(id, data) {
      const toast = useToastStore()
      const loading = useLoadingStore()
      this.fieldErrors = {}
      try {
        const { data: response } = await axios.put(`/api/practices/${id}`, data)
        toast.showSuccess(response.message)
        this.updateItem(this.list, id, response.data)
        this.updateItem(this.last_added_list, id, response.data)
        if (this.statistics.pending?.length > 0) {
          this.updateItem(this.statistics.pending, id, response.data)
        }
        return response.data;
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        loading.stop("updatePractice")
      }
    },

    updateItem(list, id, data) {
      const index = list.findIndex(p => p.id === id)
      if (index !== -1) {
        list[index] = { ...list[index], ...data }
      }
    },

    async updatePracticeStatus(id, status) {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start("updatePracticeStatus")
      try {
        const { data: response } = await axios.patch(`/api/practices/${id}/update-practice-status`, { status })
        toast.showSuccess(response.message)
        this.updateItem(this.list, id, response.data)
        if (this.statistics.pending?.length > 0) {
          this.updateItem(this.statistics.pending, id, response.data)
        }
        return response.data
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        loading.stop("updatePracticeStatus")
      }
    },

    async getPractice(id) {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start(`getPractice_${id}`)
      try {
        const { data } = await axios.get(`/api/practices/${id}`)
        return data.data
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        loading.stop(`getPractice_${id}`)
      }
    },

    async deletePractice(id) {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start("deletePractice")
      try {
        const { data: response } = await axios.delete(`/api/practices/${id}`)
        toast.showSuccess(response.message)
        this.updateItem(this.list, id, response.data)
        if (this.statistics.pending?.length > 0) {
          this.updateItem(this.statistics.pending, id, response.data)
        }
        return response.data
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        loading.stop("deletePractice")
      }
    },

    async changePage(page, filters = {}) {
      this.current_page = page
      await this.fetchPractices(filters)
    },

    async uploadAgreement(practiceId, file) {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start("uploadAgreement")
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
        loading.stop("uploadAgreement")
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
        link.setAttribute('download', `dohoda_${practiceId}.docx`)
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
        const { data: response } = await axios.get(
          `/api/practices/${practiceId}/agreement-confirmation-request`,
        )
        toast.showSuccess(response.message)
        this.updateItem(this.list, practiceId, response.data)
      } catch (e) {
        handleError(e, this, toast)
      }
    },
    async downloadUploadedDocument(practiceId, filePath) {
      const toast = useToastStore()
      try {
        const response = await axios.get(`/api/practices/${practiceId}/download-document`, {
          params: { file_path: filePath },
          responseType: 'blob',
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${filePath}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()

      } catch (e) {
        handleError(e, this, toast)
      }
    },

    async uploadReport(practiceId, file) {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start("uploadReport")
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
        loading.stop("uploadReport")
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
        const { data: response } = await axios.get(`/api/practices/${practiceId}/report-confirmation-request`)
        toast.showSuccess(response.message)
        this.updateItem(this.list, practiceId, response.data)
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
      const loading = useLoadingStore()
      loading.start("fetchStatistics")
      try {
        const { data } = await axios.get('/api/practices/statistics')
        this.statistics = data
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        loading.stop("fetchStatistics")
      }
    },
  },
})
