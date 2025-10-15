import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'
import {useStorage} from "@vueuse/core";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    token: useStorage('token',{}),
    fieldErrors: {},
    error: ''
  }),
  actions: {
    async sendAuthPostRequest(endpoint, data) {
      this.loading = true
      this.fieldErrors = {}
      try {
        const { data: response } = await axios.post(endpoint, data)
        return response
      } catch (e) {
        handleError(e, this)
        throw e
      } finally {
        this.loading = false
      }
    },
    async register(data) {
      return this.sendAuthPostRequest('/auth/register', data)
    },
    async forgotPassword(data) {
      return this.sendAuthPostRequest('/api/auth/forgot-password', data)
    },
    async updatePassword(data) {
      return this.sendAuthPostRequest('/api/auth/update-password', data)
    },
    async changePassword(data) {
      return this.sendAuthPostRequest('/api/auth/change-password', data)
    }
  },
})
