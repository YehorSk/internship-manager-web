<template>
  <v-layout v-if="$vuetify.display.mobile">
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
  </v-layout>

  <v-navigation-drawer color="white" width="280" :location="$vuetify.display.mobile ? 'top' : 'left'" v-model="drawer">
    <v-sheet class="pa-6 border-b">
      <div class="d-flex align-center">
        <v-icon color="#3A803D" size="28">mdi-account-group</v-icon>
        <h2 class="text-h6 font-weight-medium ms-2">Practice CRM</h2>
      </div>
      <p class="text-body-2 text-grey-darken-1 mt-1">Systém pre správu odbornej praxe</p>
    </v-sheet>

    <v-list density="comfortable" nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.id"
        :to="item.route || undefined"
        :active="activeTab === item.route"
        @click.prevent="onNavClick(item)"
        :prepend-icon="item.icon"
        :title="item.label"
        class="rounded-lg"
        :class="activeTab === item.route ? 'bg-primary text-white' : 'text-grey-darken-2'"
      />
    </v-list>

    <v-divider class="my-4" />

    <v-list density="comfortable" nav>
      <v-list-item
        v-for="item in settingsItems"
        :key="item.id"
        :to="item.route || undefined"
        :active="activeTab === item.route"
        @click.prevent="onNavClick(item)"
        :prepend-icon="item.icon"
        :title="item.label"
        class="rounded-lg"
        :class="activeTab === item.route ? 'bg-primary text-white' : 'text-grey-darken-2'"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js'

export default {
  data() {
    return {
      authStore: useAuthStore(),
      activeTab: this.$route.path,
      navItems: [
        { id: 'info', label: 'Prehľad', icon: 'mdi-view-dashboard', route: '/supervisor-dashboard' },
        { id: 'students', label: 'Študenti', icon: 'mdi-school', route: '/students' },
        { id: 'companies', label: 'Firmy', icon: 'mdi-office-building', route: '/company' },
        { id: 'practices', label: 'Záznamy z praxe', icon: 'mdi-file-document-outline', route: '/practices' },
        { id: 'documents', label: 'Dokumenty', icon: 'mdi-folder-open-outline', route: '/documents' },
        { id: 'processes', label: 'Sledovanie procesu', icon: 'mdi-source-branch', route: '/processes' },
      ],
      settingsItems: [
        { id: 'settings', label: 'Nastavenia profilu', icon: 'mdi-cog-outline', route: '/settings' },
        { id: 'logout', label: 'Odhlásiť sa', icon: 'mdi-logout', route: null },
      ],
      drawer: false,
    }
  },
  mounted() {
    console.log(`Mounted: ${this.$route.path}`)
    this.drawer = !this.$vuetify.display.mobile
  },
  watch: {
    '$vuetify.display.mobile'(isMobile) {
      this.drawer = !isMobile
    },
    '$route.path'(path) {
      this.activeTab = path
    }
  },
  methods: {
    async onNavClick(item) {
      if (!item) return
      if (item.id === 'logout') {
        await this.authStore.logout()
        // this.$router.push('/login') // при необходимости
        return
      }
      if (item.route) {
        this.$router.push(item.route)
        this.activeTab = item.route
        if (this.$vuetify.display.mobile) this.drawer = false
      }
    },
  },
}
</script>

<style scoped>
.bg-primary {
  background-color: #3A803D !important;
}
.text-white {
  color: white !important;
}
.border-b {
  border-bottom: 1px solid #e0e0e0;
}
.text-grey-darken-2:hover {
  background-color: rgba(58, 128, 61, 0.08) !important;
  color: #3A803D !important;
}
</style>
