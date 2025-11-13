import { defineStore } from 'pinia'
import axios from 'axios'
import { useToastStore } from '@/stores/toastStore.js'
import { handleError } from '@/utils/httpError.js'

export const useReportsStore = defineStore('reports', {
  state: () => ({
    loading: false,
    reports: [],
    total_items: 0,
    fieldErrors: {},
  }),

  actions: {
    async fetchReports(filters = {}) {
      const toast = useToastStore()
      this.loading = true
      try {
        const payload = {
          page: filters.page || 1,
          itemsPerPage: filters.itemsPerPage || 10,
          search: filters.search || {},
        }
        const { data } = await axios.post('/api/reports/list', payload)
        this.reports = data.data || []
        this.total_items = data.meta?.total || this.reports.length
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },

    async generateReport(filters) {
      const toast = useToastStore()
      this.loading = true
      try {
        const payload = {
          report_type: filters.report_type || 'practices_list',
          company_name: filters.company_name?.toString(),
          academic_year: filters.year?.toString(),
          semester: filters.semester,
          study_program_name: filters.study_program?.toString(),
          start_date: filters.start_date,
          end_date: filters.end_date,
          status: filters.status?.toString(),
        }
        Object.keys(payload).forEach(key => {
          if (payload[key] === null || payload[key] === undefined) {
            delete payload[key]
          }
        })
        const { data } = await axios.post('/api/reports/generate', payload)
        toast.showSuccess(data.message)
        if (data?.data) {
          this.reports.push(data.data)
          this.total_items++
        }
        return data
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },
    async downloadReport(id) {
      const toast = useToastStore()
      try {
        const response = await axios.get(`/api/reports/${id}/download`, {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })

        const url = window.URL.createObjectURL(response.data)
        const a = document.createElement('a')
        a.href = url
        a.download = `report_${id}.csv`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      } catch (e) {
        handleError(e, this, toast)
      }
    },
    async fetchAcademicYears() {
      const toast = useToastStore()
      try {
        const { data } = await axios.get('/api/reports/academic-years', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return data || []
      } catch (e) {
        handleError(e, this, toast)
        return []
      }
    }
  },
})
