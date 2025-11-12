<template>
  <v-app v-if="isGuestLayout">
    <AppHeader />
    <section>
      <NotFoundComponent :is-guest-layout="isGuestLayout" />
    </section>
    <AppFooter />
  </v-app>
  <v-main v-else>
    <v-container fluid class="pa-0">
        <Sidebar class="sidebar" />
        <v-container fluid class="pa-0 full-height">
          <NotFoundComponent :is-guest-layout="isGuestLayout" />
        </v-container>
    </v-container>
  </v-main>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import Sidebar from '@/components/SideBar.vue'
import NotFoundComponent from '@/components/NotFoundComponent.vue'

export default {
  name: 'NotFoundView',
  components: { Sidebar, AppFooter, AppHeader, NotFoundComponent },
  data () {
    return {
      authStore: useAuthStore(),
    }
  },
  computed: {
    isGuestLayout() {
      return !this.authStore.isLoggedIn
    },
  },
}
</script>

<style scoped>
.full-height {
  height: 100vh;
}
</style>
