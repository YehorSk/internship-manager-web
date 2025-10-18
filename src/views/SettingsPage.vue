<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar class="sidebar" />
        <v-container fluid class="pa-4">
          <v-row class="mb-4">
            <v-col cols="12">
              <h1 class="text-h5">Profile Settings</h1>
              <p class="text-subtitle-1">Manage your account settings and preferences</p>
            </v-col>
          </v-row>
          <ChangePasswordPage />
        </v-container>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import ChangePassword from '@/components/ChangePassword.vue'

export default {
  name: 'SettingsPage',
  components: { ChangePasswordPage: ChangePassword, Sidebar },
}
</script>

<style>
body {
  background-color: #f9fafb !important;
}
</style>
