import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loadings: new Set()
  }),
  getters: {
    is: (state) => (name) => state.loadings.has(name)
  },
  actions: {
    start(key) {
      this.loadings.add(key)
      console.log(`Loading start ${key}`)
    },
    stop(key) {
      this.loadings.delete(key)
      console.log(`Loading stop ${key}`)
    }
  }
});
