import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'
import {useStorage} from "@vueuse/core";
import { useToastStore } from '@/stores/toastStore.js'
import i18n from '@/i18n'
import { useProfileStore } from '@/stores/profileStore.js'
import router from '@/router/index.js'
import { useLoadingStore } from '@/stores/loadingStore.js'

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
      const loading = useLoadingStore()
      loading.start("register")
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
        loading.stop("register")
      }
    },
    async sendAuthPostRequest(endpoint, data, key) {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start(key)
      this.fieldErrors = {}
      try {
        const { data: response } = await axios.post(endpoint, data)
        toast.showSuccess(response.message)
      } catch (e) {
        handleError(e, this, toast)
        throw e
      } finally {
        loading.stop(key)
      }
    },
    async forgotPassword(data) {
      return this.sendAuthPostRequest('/api/auth/forgot-password', data, 'forgotPassword')
    },
    async updatePassword(data) {
      return this.sendAuthPostRequest('/api/auth/update-password', data, 'updatePassword')
    },
    async changePassword(data) {
      return this.sendAuthPostRequest('/api/auth/change-password', data, 'changePassword')
    },
    async login(email, password) {
      const toast = useToastStore()
      const profileStore = useProfileStore()
      const lang = profileStore.lang || 'sk'
      const loading = useLoadingStore()
      loading.start("login")
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
        loading.stop("login")
      }
    },
    async logout() {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start("logout")
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
        loading.stop("logout")
        window.location.reload();
      }
    },
  },
})
