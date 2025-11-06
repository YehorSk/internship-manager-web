import { defineStore } from 'pinia'
import axios from 'axios'
import { useToastStore } from '@/stores/toastStore.js'
import { handleError } from '@/utils/httpError.js'

export const useStudyProgramsStore = defineStore('studyPrograms', {
  state: () => ({
    list: [],
    loading: false,
  }),
  actions: {
    async fetchPrograms() {
      const toast = useToastStore()
      this.loading = true
      try {
        const res = await axios.get('api/study-programs/index')
        this.list = res.data.data
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    }
  }
})
