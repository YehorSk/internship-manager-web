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
          <SupervisorProfileSettings v-if="isSupervisor" />
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
import { useAuthStore } from '@/stores/authStore.js'
import SupervisorProfileSettings from '@/components/SupervisorProfileSettings.vue'

export default {
  name: 'SettingsPage',
  components: { ChangePasswordPage: ChangePassword, Sidebar, StudentProfileSettings: StudentProfileSettings, SupervisorProfileSettings: SupervisorProfileSettings, },
  computed: {
    isStudent() {
      const authStore = useAuthStore()
      return authStore.user?.roles?.[0]?.name === 'student'
    },
    isSupervisor() {
      const authStore = useAuthStore()
      return authStore.user?.roles?.[0]?.name === 'supervisor'
    },
  },
}
</script>
