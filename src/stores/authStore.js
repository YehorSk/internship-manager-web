import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    fieldErrors: {},
    error: ''
  }),
  actions: {
    async register(data) {
      this.loading = true
      this.fieldErrors = {}
      try {
        const { data: response } = await axios.post('/auth/register', data)
        return response
      } catch (e) {
        handleError(e, this)
        throw e
      } finally {
        this.loading = false
      }
    },
    async forgotPassword(email) {
      this.loading = true
      this.fieldErrors = {}
      this.error = ''
      try {
        const { data } = await axios.post('/auth/forgot-password', { email })
        return data // { message: '...' }
      } catch (e) {
        handleError(e, this)
        throw e
      } finally {
        this.loading = false
      }
    },
    async resetPassword({ token, email, password, password_confirmation }) {
      this.loading = true
      this.fieldErrors = {}
      this.error = ''
      try {
        const { data } = await axios.post('/auth/reset-password', {
          token, email, password, password_confirmation
        })
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
