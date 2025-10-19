<script>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'

export default {
  name: 'App',
  components: {
    RouterView
  },
  data() {
    return {
      authStore: useAuthStore(),
    }
  },
  // async created() {
  //   await this.authStore.authenticate()
  // },
}
</script>

<template>

  <v-layout class="d-block">
    <RouterView />
  </v-layout>
</template>


