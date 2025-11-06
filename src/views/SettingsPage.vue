<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar/>
        <v-container fluid class="pa-4">
          <v-row class="mb-4">
            <v-col cols="12">
              <h1 class="text-h5">Nastavenia profilu</h1>
              <p class="text-subtitle-1">Spravujte nastavenia a preferencie svojho účtu</p>
            </v-col>
          </v-row>
          <ProfileSettingsPage />
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
import ProfileSettings from '@/components/ProfileSettings.vue'

export default {
  name: 'SettingsPage',
  components: { ChangePasswordPage: ChangePassword, Sidebar, ProfileSettingsPage: ProfileSettings, },
}
</script>
