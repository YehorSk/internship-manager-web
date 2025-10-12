import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'
import {useStorage} from "@vueuse/core";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    token: useStorage('token',{}),
    fieldErrors: {},
    error: '',
    token: '',
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
    async login(email, password) {
      this.loading = true
      this.error = ''

      try {
        const { data } = await axios.post('/auth/login', { email, password })

        if (data.success) {
          this.user = data.data
          this.token = data.token
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          return data
        } else {
          this.error = data.message || 'Login failed'
          throw new Error(this.error)
        }
      } catch (e) {
        if (e.response?.status === 401) {
          this.error = 'Nesprávny e-mail alebo heslo.'
        } else if (e.response?.data?.message) {
          this.error = e.response.data.message
        } else {
          this.error = 'Chybaa pripojenia k serveru.'
        }
        throw e
      }
    },
    async logout() {
      this.user = null
      this.token = ''
      delete axios.defaults.headers.common['Authorization']
    },
  },
})
