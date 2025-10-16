<template>
  <v-app>
    <v-navigation-drawer app permanent color="white" width="280">
      <v-sheet class="pa-6 border-b">
        <div class="d-flex align-center">
          <v-icon color="#3A803D" size="28">mdi-account-group</v-icon>
          <h2 class="text-h6 font-weight-medium ms-2">Practice CRM</h2>
        </div>
        <p class="text-body-2 text-grey-darken-1 mt-1">
          Systém pre správu odbornej praxe
        </p>
      </v-sheet>

      <v-list density="comfortable" nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.id"
          :to="item.route"
          :active="activeTab === item.route"
          @click="onTabChange(item.id)"
          :prepend-icon="item.icon"
          :title="item.label"
          class="rounded-lg"
          :class="activeTab === item.id ? 'bg-primary text-white' : 'text-grey-darken-2'"
        ></v-list-item>
      </v-list>

      <v-divider class="my-4"></v-divider>

      <v-list density="comfortable" nav>
        <v-list-item
          v-for="item in settingsItems"
          :key="item.id"
          :to="item.route"
          :active="activeTab === item.id"
          @click="onTabChange(item.id)"
          :prepend-icon="item.icon"
          :title="item.label"
          class="rounded-lg"
          :class="activeTab === item.id ? 'bg-primary text-white' : 'text-grey-darken-2'"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
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
        { id: 'settings', label: 'Nastavenia profilu', icon: 'mdi-cog-outline', route: '/register' },
      ],
    }
  },
  mounted() {
    console.log(`Mounted: ${this.$route.path}`)
  },
  methods: {
    onTabChange(tab) {
      this.activeTab = tab.route
      console.log(this.$route.path)
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
