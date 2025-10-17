<template>
  <v-container class="form-container fill-height d-flex align-center justify-center">
    <v-card elevation="12" class="pa-6 rounded-2xl" max-width="600">
      <v-card-title class="text-h5 text-center font-weight-bold">Obnova hesla</v-card-title>
      <v-card-subtitle class="text-center mb-6">Nastavte si nové heslo</v-card-subtitle>

      <v-form ref="resetForm" v-model="validReset" class="form-fix">
        <v-text-field
          v-model="form.currentPassword"
          label="Aktuálne heslo *"
          type="password"
          :rules="[rules.required, rules.password]"
          variant="outlined"
          density="comfortable"
          rounded="xl"
        />

        <v-text-field
          v-model="form.newPassword"
          type="password"
          label="Nové heslo *"
          :rules="[rules.required, rules.password]"
          variant="outlined"
          density="comfortable"
          rounded="xl"
        />

        <v-text-field
          v-model="form.confirmPassword"
          type="password"
          label="Potvrdenie hesla *"
          :rules="[rules.required, rules.password]"
          variant="outlined"
          density="comfortable"
          rounded="xl"
        />

        <v-btn
          color="#3A803D"
          size="large"
          class="mt-2 rounded-xl text-white"
          block
          :loading="authStore.loading"
          :disabled="false"
          @click="changePassword"
        >
          Aktualizovať heslo
        </v-btn>
      </v-form>

      <div class="my-6 text-center">
        <v-divider />
        <div class="text-caption mt-n3 bg-white px-3 d-inline-block">Alebo</div>
      </div>

      <v-btn
        variant="outlined"
        block
        class="mb-4 rounded-xl"
        :to="{ name: dashboardRouteName }"
      >
        Späť na dashboard
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js'
import { useToast } from 'vue-toastification'

export default {
  data() {
    return {
      authStore: useAuthStore(),
      validReset: false,
      form: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      rules: {
        required: v => !!v || 'Povinné pole',
        password: v =>
          /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v) ||
          'Min. 8 znakov, aspoň 1 písmeno a 1 číslo',
      },
      toast: useToast(),
      roleToRouteName: {
        student: 'StudentDashboard',
        supervisor: 'SupervisorDashboard',
        company: 'CompanyDashboard',
      },
    }
  },

  computed: {
    dashboardRouteName() {
      const role =
        this.authStore.user?.role?.name ||
        this.authStore.user?.role ||
        ''
      return this.roleToRouteName[role] ?? 'StudentDashboard'
    },
  },

  methods: {
    async changePassword() {
      const { valid } = await this.$refs.resetForm.validate()
      if (!valid) return
      if (this.form?.newPassword === this.form?.currentPassword) {
        this.showError = true
        return
      }
      await this.authStore.changePassword({
        current_password: this.form?.currentPassword,
        password: this.form?.newPassword,
        password_confirmation: this.form?.confirmPassword,
      })
    },
  },

  watch: {
    'authStore.success': {
      handler(newValue) {
        if (newValue) {
          this.$refs.resetForm?.reset()
          this.toast.success(newValue)
          this.authStore.success = ''
        }
      },
      immediate: true,
    },
    'authStore.error': {
      handler(newValue) {
        if (newValue) {
          this.toast.error(newValue)
          this.authStore.error = ''
        }
      },
      immediate: true,
    },
  },
}
</script>

<style>
</style>
