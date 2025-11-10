<template>
  <v-layout v-if="$vuetify.display.mobile">
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
  </v-layout>

  <v-navigation-drawer color="white" width="280" :location="$vuetify.display.mobile ? 'top' : 'left'" v-model="drawer">
    <v-sheet class="pa-6 border-b">
      <div class="d-flex align-center">
        <v-icon color="#3A803D" size="28">mdi-account-group</v-icon>
        <h2 class="text-h6 font-weight-medium ms-2">{{ $t('SideBar.title') }}</h2>
      </div>
      <p class="text-body-2 text-grey-darken-1 mt-1">{{ $t('SideBar.subtitle') }}</p>
    </v-sheet>

    <v-list density="comfortable" nav>
      <template v-for="item in filteredMenu" :key="item.id">
        <v-divider v-if="item.divider" class="my-4" />
        <v-list-item
          v-else
          :to="item.route"
          :active="activeTab === item.route"
          @click.prevent="onNavClick(item)"
          :prepend-icon="item.icon"
          :title="$t(item.label)"
          class="rounded-lg"
          :class="activeTab === item.route ? 'bg-primary text-white' : 'text-grey-darken-2'"
        />
      </template>
    </v-list>
    <template #append>
      <div class="pa-4 d-flex justify-center">
        <LanguageSwitcher />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js'
import { menuByRole } from '@/data/menuConfig.js'
import { ROLES } from '@/constants/roles.js'
import { hasAccess } from '@/utils/access.js'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

export default {
  components: { LanguageSwitcher },
  data() {
    return {
      authStore: useAuthStore(),
      activeTab: this.$route.path,
      drawer: false,
    }
  },
  computed: {
    role() {
      return this.authStore?.user?.roles?.[0]?.name || ROLES.GUEST
    },
    filteredMenu() {
      const allMenus = menuByRole[this.role] || menuByRole[ROLES.GUEST]
      return allMenus.filter(item => !item.roles || hasAccess([this.role], item.roles))
    },
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
      if (item.id === 'logout') {
        await this.authStore.logout()
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
