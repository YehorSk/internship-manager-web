import { defineStore } from 'pinia'

export const useToastStore = defineStore('toasts', {
  state: () => ({
    success: '',
    error: '',
    info: '',
  }),
  actions: {
    showSuccess(message) {
      this.success = message
      this.clear('success')
    },
    showError(message) {
      this.error = message
      this.clear('error')
    },
    showInfo(message) {
      this.info = message
      this.clear('info')
    },
    clear(type) {
      setTimeout(() => {
        this[type] = ''
      }, 0)
    },
  },
});
