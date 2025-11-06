<script>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { useToastStore } from '@/stores/toastStore.js'
import { useToast } from 'vue-toastification'

export default {
  name: 'App',
  components: {
    RouterView
  },
  data() {
    return {
      authStore: useAuthStore(),
      toastStore: useToastStore(),
      toast: useToast(),
    }
  },
  watch: {
    'toastStore.success': {
      handler(newValue) {
        if (newValue) {
          this.toast.success(newValue)
        }
      },
      immediate: true,
    },
    'toastStore.error': {
      handler(newValue) {
        if (newValue) {
          this.toast.error(newValue)
        }
      },
      immediate: true,
    },
    'toastStore.info': {
      handler(newValue) {
        if (newValue) {
          this.toast.info(newValue)
        }
      },
      immediate: true,
    },
  }
}
</script>

<template>

  <v-layout class="d-block">
    <RouterView />
  </v-layout>
</template>


