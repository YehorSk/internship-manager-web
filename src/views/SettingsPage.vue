<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar/>
        <v-container fluid class="pa-4">
          <v-row class="mb-4">
            <v-col cols="12">
              <h1 class="text-h5">{{ $t('SettingsPage.title') }}</h1>
              <p class="text-subtitle-1">{{ $t('SettingsPage.subtitle') }}</p>
            </v-col>
          </v-row>
          <StudentProfileSettings v-if="isStudent" />
          <CompanyProfileSettings v-if="isCompany" />
          <v-spacer class="my-6" />
          <ChangePasswordPage />
        </v-container>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import ChangePassword from '@/components/ChangePassword.vue'
import StudentProfileSettings from '@/components/StudentProfileSettings.vue'
import CompanyProfileSettings from '@/components/CompanyProfileSettings.vue'
import { useAuthStore } from '@/stores/authStore.js'

export default {
  name: 'SettingsPage',
  components: { ChangePasswordPage: ChangePassword, Sidebar, StudentProfileSettings: StudentProfileSettings, CompanyProfileSettings: CompanyProfileSettings, },
  computed: {
    isStudent() {
      const authStore = useAuthStore()
      return authStore.user?.roles?.[0]?.name === 'student'
    },
    isCompany() {
      const authStore = useAuthStore()
      return authStore.user?.roles?.[0]?.name === 'company'
    },
  },
}
</script>
