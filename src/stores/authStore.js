import { defineStore } from 'pinia'
import axios from 'axios'
import { handleError } from '@/utils/httpError.js'
import {useStorage} from "@vueuse/core";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    token: useStorage('token',''),
    user: null,
    isLoggedIn: false,
    fieldErrors: {},
    error: '',
    success: '',
  }),
  getters: {
    roles: (state) => state.user?.roles?.map(r => r.name) || [],
  },
  actions: {
    async authenticate(){
      try{
        const { data: response } = await axios.get('/auth/user', null);
        this.user = response.data
        this.isLoggedIn = true
      } catch (e) {
        handleError(e, this)
        throw e
      }
    },
    async register(data) {
      this.loading = true
      this.fieldErrors = {}
      try {
        const { data: response } = await axios.post('/auth/register', data)
        this.success = response.message
        console.log(response)
        // console.log(`Roles ${this.roles}`)
        // return response
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
        const { data: response } = await axios.post('/auth/login', { email, password })
        this.user = response.data
        this.token = response.token
        this.success = response.message
        this.isLoggedIn = true
        console.log(response)
        window.location.reload();
      } catch (e) {
        handleError(e, this)
        this.isLoggedIn = false
        throw e
      } finally {
        this.loading = false
      }
    },
    async logout() {
      this.loading = true
      this.error = ''
      try {
        const { data: response } = await axios.post('/auth/logout', null);
        this.success = response.message
      }catch (e){
        handleError(e, this)
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
