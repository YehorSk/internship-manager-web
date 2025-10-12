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
  },
})
