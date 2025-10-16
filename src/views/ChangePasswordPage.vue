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
          :rules="[v => !!v || 'Povinné pole', v => /.+@.+\..+/.test(v) || 'Neplatný e-mail']"
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
          :rules="[
                rules.required,
                v => v === resetData.newPassword || 'Heslá sa nezhodujú'
              ]"
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
        @click="$router.push({ name: 'login' })"
      >
        Späť na prihlásenie
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
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showNew: false,
        showConfirm: false,
      },
      rules: {
        required: v => !!v || 'Povinné pole',
        email: v => /.+@.+\..+/.test(v) || 'Neplatný e-mail',
        password: v =>
          /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v) ||
          'Min. 8 znakov, aspoň 1 písmeno a 1 číslo',
      },
      toast: useToast()
    }
  },
  created() {
  },
  computed: {
    passwordChecks() {
      const p = this.form.newPassword || ''
      return {
        len: p.length >= 8,
        lower: /[a-z]/.test(p),
        upper: /[A-Z]/.test(p),
        digit: /\d/.test(p),
        special: /[^A-Za-z0-9]/.test(p),
      }
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
        old_password: this.form?.currentPassword,
        new_password: this.form?.newPassword,
      })
    },
  },
  watch:{
    "authStore.success": {
      handler(newValue) {
        if (newValue) {
          this.$refs.loginForm?.reset()
          this.toast.success(newValue);
          this.authStore.success = "";
        }
      },
      immediate: true,
    },
    'authStore.error': {
      handler(newValue) {
        if (newValue) {
          this.toast.error(newValue);
          this.authStore.error = "";
        }
      },
      immediate: true,
    },
  }
}
</script>

<style>
</style>
