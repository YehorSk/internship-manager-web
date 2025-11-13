import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'
import {useStorage} from "@vueuse/core";
import { useToastStore } from '@/stores/toastStore.js'
import i18n from '@/i18n'
import { useProfileStore } from '@/stores/profileStore.js'
import router from '@/router/index.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    token: useStorage('token',''),
    user: null,
    isLoggedIn: false,
    fieldErrors: {},
  }),
  getters: {
    roles: (state) => state.user?.roles?.map(r => r.name) || [],
  },
  actions: {
    async authenticate(){
      const toast = useToastStore()
      try{
        const { data: response } = await axios.get('/api/auth/user', null);
        this.user = response.data
        this.isLoggedIn = true
        const profileStore = useProfileStore()
        profileStore.lang = response.data.language || 'sk'
        i18n.global.locale.value = profileStore.lang
      } catch (e) {
        const status = e?.response?.status
        if (status === 401) {
          this.token = null
          this.user = null
          this.isLoggedIn = false
        }
        handleError(e, this, toast)
        throw e
      }
    },
    async register(data) {
      const toast = useToastStore()
      const profileStore = useProfileStore()
      const lang = profileStore.lang || 'sk'
      this.loading = true
      this.fieldErrors = {}
      try {
        data.language = lang
        const { data: response } = await axios.post('/api/auth/register', data, {
          headers: { lang }
        })
        toast.showSuccess(response.message)
        console.log(response)
        router.push('/login')
      } catch (e) {
        handleError(e, this, toast)
        throw e
      } finally {
        this.loading = false
      }
    },
    async sendAuthPostRequest(endpoint, data) {
      const toast = useToastStore()
      this.loading = true
      this.fieldErrors = {}
      try {
        const { data: response } = await axios.post(endpoint, data)
        toast.showSuccess(response.message)
      } catch (e) {
        handleError(e, this, toast)
        throw e
      } finally {
        this.loading = false
      }
    },
    async forgotPassword(data) {
      return this.sendAuthPostRequest('/api/auth/forgot-password', data)
    },
    async updatePassword(data) {
      return this.sendAuthPostRequest('/api/auth/update-password', data)
    },
    async changePassword(data) {
      return this.sendAuthPostRequest('/api/auth/change-password', data)
    },
    async login(email, password) {
      const toast = useToastStore()
      const profileStore = useProfileStore()
      const lang = profileStore.lang || 'sk'
      this.loading = true
      try {
        const { data: response } = await axios.post(
          '/api/auth/login',
          { email, password },
          { headers: { lang } }
        )
        this.user = response.data
        this.token = response.token
        toast.showSuccess(response.message)
        this.isLoggedIn = true
        console.log(response)
        await profileStore.setLanguage(lang)
        i18n.global.locale.value = profileStore.lang
        window.location.reload();
      } catch (e) {
        handleError(e, this, toast)
        this.isLoggedIn = false
        throw e
      } finally {
        this.loading = false
      }
    },
    async logout() {
      const toast = useToastStore()
      this.loading = true
      try {
        const { data: response } = await axios.post('/api/auth/logout', null);
        toast.showSuccess(response.message)
      }catch (e){
        handleError(e, this, toast)
        this.isLoggedIn = false
        throw e
      }  finally {
        console.log("Finally")
        this.user = null;
        this.token = null;
        this.isLoggedIn = false;
        this.loading = false;
        window.location.reload();
      }
    },
  },
})
