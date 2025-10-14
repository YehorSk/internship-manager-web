import { defineStore } from 'pinia'
import axios from 'axios'

export const useStudyProgramsStore = defineStore('studyPrograms', {
  state: () => ({
    list: [],
    loading: false,
    error: ''
  }),
  actions: {
    async fetchPrograms() {
      this.loading = true
      try {
        const res = await axios.get('/study-programs/index')
        this.list = res.data.data
      } catch (e) {
        this.error = 'Nepodarilo sa načítať študijné programy'
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
})
