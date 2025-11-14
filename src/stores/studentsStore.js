import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'
import { useToastStore } from '@/stores/toastStore.js'

export const useStudentsStore = defineStore('students', {
  state: () => ({
    students: [],
    loading: false,
    current_page: 1,
    total_pages: 1,
    per_page: 10,
    total_items: 0,
    fieldErrors: {},
  }),

  actions: {
    async fetchStudents(filters = {}) {
      const toast = useToastStore()
      this.loading = true
      try {
        const search = {}
        if (filters.student_name) search.student_name = filters.student
        if (filters.study_program_name) search.study_program_name = filters.study_program_name

        const payload = {
          page: this.current_page,
          itemsPerPage: this.per_page,
          ...(Object.keys(search).length ? { search } : {}),
        }

        const { data } = await axios.post('/api/students/list', payload)

        this.students = (data.data || []).map(s => ({
          ...s,
          full_name: `${s.first_name} ${s.last_name}`.trim(),
        }))

        this.current_page = data.meta?.current_page || data.current_page || 1
        this.total_pages = data.meta?.last_page || data.last_page || 1
        this.total_items = data.meta?.total || data.total || this.students.length
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },

    async searchStudents(query = '') {
      const toast = useToastStore()
      this.loading = true
      try {
        const res = await axios.get(`/api/students/search`, {
          params: { value: query }
        });
        this.students = res.data.data.map(s => ({
          ...s,
          full_name: `${s.first_name} ${s.last_name}`.trim(),
        }))
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },

    async changePage(page, filters = {}) {
      this.current_page = page
      await this.fetchStudents(filters)
    },
  },
})
