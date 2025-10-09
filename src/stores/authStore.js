import { defineStore } from 'pinia'
import axios from '@/plugins/axios'

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

const jsonCfg = { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    error: null,
    fieldErrors: {},
  }),

  actions: {
    async registerStudent(studentData) {
      this.loading = true
      this.error = null
      this.fieldErrors = {}
      try {
        const payload = toBackendStudent(studentData)
        const { data } = await axios.post('/auth/register', payload, jsonCfg)
        return data
      } catch (e) {
        this.error = e.normalized?.message || 'Chyba pri registrácii študenta'
        this.fieldErrors = e.normalized?.fieldErrors || {}
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
        const payload = toBackendCompany(companyData)
        const { data } = await axios.post('/auth/register', payload, jsonCfg)
        return data
      } catch (e) {
        this.error = e.normalized?.message || 'Chyba pri registrácii spoločnosti'
        this.fieldErrors = e.normalized?.fieldErrors || {}
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
