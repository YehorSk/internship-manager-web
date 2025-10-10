import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'

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
    errors: {},
    credentials: '',
    failure: '',
  }),
  actions: {
    async registerStudent(studentData) {
      this.loading = true
      this.errors = {}
      this.credentials = ''
      this.failure = ''
      try {
        const { data } = await axios.post('/auth/register', toBackendStudent(studentData))
        return data
      } catch (e) {
        handleError(e, this)
        throw e
      } finally {
        this.loading = false
      }
    },
    async registerCompany(companyData) {
      this.loading = true
      this.errors = {}
      this.credentials = ''
      this.failure = ''
      try {
        const { data } = await axios.post('/auth/register', toBackendCompany(companyData))
        return data
      } catch (e) {
        handleError(e, this)
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
