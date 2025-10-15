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
          :loading="isLoading"
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
    <SuccessAlert v-model="showSuccess">
      Úspech! Vaše heslo bolo zmenené.
    </SuccessAlert>
    <ErrorAlert v-model="showError" />
  </v-container>
</template>

<script>
import SuccessAlert from '@/components/alerts/SuccessAlert.vue'
import ErrorAlert from '@/components/alerts/ErrorAlert.vue'
import { useAuthStore } from '@/stores/authStore.js'

export default {
  components: { SuccessAlert, ErrorAlert },
  data() {
    return {
      auth: useAuthStore(),
      isLoading: false,
      showSuccess: false,
      showError: false,

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
    passwordAllValid() {
      const c = this.passwordChecks
      return c.len && c.lower && c.upper && c.digit && c.special
    },
    passwordRuleFn() {
      return () =>
        (this.passwordAllValid) ||
        'Min. 8 znakov, malé/veľké písmená, číslo a špec. znak'
    },
  },
  methods: {
    async changePassword() {
      this.showSuccess = false
      this.showError = false
      const { valid } = await this.$refs.resetForm.validate()
      if (!valid) return
      if (this.form?.newPassword === this.form?.currentPassword) {
        this.showError = true
        return
      }

      this.isLoading = true
      try {
        await this.auth.changePassword({
          old_password: this.form?.currentPassword,
          new_password: this.form?.newPassword,
        })
        this.showSuccess = true
      } catch (e) {
        this.showError = true
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style>
</style>
