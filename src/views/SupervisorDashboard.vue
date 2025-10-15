<template>
  <div class="about">
    <h1 class="text-primary">Supervisor Dashboard</h1>
    <v-btn
      color="#3A803D"
      size="large"
      class="mt-2 rounded-xl text-white"
      block
      @click="logout"
    >
      Logout
    </v-btn>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
<script>
import { useAuthStore } from '@/stores/authStore.js'

export default {
  data() {
    return {
      authStore: useAuthStore(),
    }
  },
  methods: {
    async logout() {
      await this.authStore.logout()
    }
  }
}
</script>
