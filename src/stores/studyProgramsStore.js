import { defineStore } from 'pinia'
import axios from 'axios'
import { useToastStore } from '@/stores/toastStore.js'
import { handleError } from '@/utils/httpError.js'
import { useLoadingStore } from '@/stores/loadingStore.js'

export const useStudyProgramsStore = defineStore('studyPrograms', {
  state: () => ({
    list: [],
  }),
  actions: {
    async fetchPrograms() {
      const toast = useToastStore()
      const loading = useLoadingStore()
      loading.start(`fetchPrograms`)
      try {
        const res = await axios.get('api/study-programs/index')
        this.list = res.data.data
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        loading.stop(`fetchPrograms`)
      }
    }
  }
})
