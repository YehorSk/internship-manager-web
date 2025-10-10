import { defineStore } from 'pinia'
import axios from 'axios'
import { httpErrorHandler } from '@/utils/httpError'

const toBackendStudent = v => ({
  type: 'student',
  first_name: v.first_name,
  last_name: v.last_name,
  address: v.address,
  student_email: v.student_email,
  primary_email: v.alternative_email,
  phone: v.phone_number,
  study_program: v.study_program,
})

const toBackendCompany = v => ({
  type: 'company',
  name: v.name,
  address: v.address,
  contact_name: v.contact_name,
  contact_email: v.contact_email,
  contact_phone: v.contact_phone,
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    error: null,
    fieldErrors: {},
    status: 0,
  }),

  actions: {
    async registerStudent(studentData) {
      this.loading = true
      this.error = null
      this.fieldErrors = {}
      try {
        const { data } = await axios.post('/auth/register', toBackendStudent(studentData))
        return data
      } catch (e) {
        const n = e.normalized || httpErrorHandler(e)
        this.status = n.status
        this.error = n.message
        this.fieldErrors = n.fieldErrors
        throw e
      } finally {
        this.loading = false
      }
    },

    async registerCompany(companyData) {
      this.loading = true
      this.error = null
      this.fieldErrors = {}
      try {
        const { data } = await axios.post('/auth/register', toBackendCompany(companyData))
        return data
      } catch (e) {
        const n = e.normalized || httpErrorHandler(e)
        this.status = n.status
        this.error = n.message
        this.fieldErrors = n.fieldErrors
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
