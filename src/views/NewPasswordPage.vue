<script>
import SuccessAlert from '@/components/alerts/SuccessAlert.vue'
import ErrorAlert from '@/components/alerts/ErrorAlert.vue'
import api from '@/services/api'

export default {
  name: 'PasswordResetWithToken',
  components: { SuccessAlert, ErrorAlert },
  data() {
    return {
      isLoading: false,
      showSuccess: false,
      showError: false,

      token: null,
      validReset: false,

      form: {
        email: '', 
        newPassword: '',
        confirmPassword: '',
        showNew: false,
        showConfirm: false,
      },
    }
  },
  created() {
    const q = this.$route?.query || {}
    this.token = q.token ? String(q.token) : null
    if (q.email) this.form.email = String(q.email)
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
    async simulateNetwork(delay = 700) {
      await new Promise(r => setTimeout(r, delay))
    },
    async updatePassword() {
      this.showSuccess = false
      this.showError = false
      const { valid } = await this.$refs.resetForm.validate()
      if (!valid) return
      if (this.form.newPassword !== this.form.confirmPassword) {
        this.showError = true
        return
      }

      if (!this.token) {
        this.showError = true
        return
      }

      this.isLoading = true
      try {
        await this.simulateNetwork()

        this.showSuccess = true
      } catch (e) {
        this.showError = true
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<template>
  <v-container class="form-container fill-height d-flex align-center justify-center">
    <v-card elevation="12" class="pa-6 rounded-2xl" max-width="600">
      <v-card-title class="text-h5 text-center font-weight-bold">
        Obnova hesla
      </v-card-title>

      <v-card-subtitle class="text-center mb-6">
        Nastavte si nové heslo
      </v-card-subtitle>

      <v-form ref="resetForm" v-model="validReset" class="d-flex flex-column gap-4">
        <v-alert
          v-if="!token"
          type="warning"
          variant="tonal"
          class="rounded-lg"
        >
          Neplatný alebo chýbajúci token. Skúste znova otvoriť odkaz z e-mailu.
        </v-alert>

        <v-text-field
          v-if="form.email"
          v-model="form.email"
          label="E-mail"
          variant="outlined"
          density="comfortable"
          rounded="xl"
          readonly
        />

        <v-text-field
          v-model="form.newPassword"
          :type="form.showNew ? 'text' : 'password'"
          :append-inner-icon="form.showNew ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="form.showNew = !form.showNew"
          label="Nové heslo *"
          :rules="[passwordRuleFn]"
          variant="outlined"
          density="comfortable"
          rounded="xl"
          hint="Min. 8 znakov, malé/veľké písmená, číslo a špec. znak"
          persistent-hint
        />
        <div class="text-body-2 d-flex flex-column gap-1">
          <div class="d-flex align-center">
            <v-icon :color="passwordChecks.len ? 'success' : undefined" size="18" class="mr-2">
              {{ passwordChecks.len ? 'mdi-check-circle' : 'mdi-circle-outline' }}
            </v-icon>
            Aspoň 8 znakov
          </div>
          <div class="d-flex align-center">
            <v-icon :color="passwordChecks.lower ? 'success' : undefined" size="18" class="mr-2">
              {{ passwordChecks.lower ? 'mdi-check-circle' : 'mdi-circle-outline' }}
            </v-icon>
            Malé písmeno
          </div>
          <div class="d-flex align-center">
            <v-icon :color="passwordChecks.upper ? 'success' : undefined" size="18" class="mr-2">
              {{ passwordChecks.upper ? 'mdi-check-circle' : 'mdi-circle-outline' }}
            </v-icon>
            Veľké písmeno
          </div>
          <div class="d-flex align-center">
            <v-icon :color="passwordChecks.digit ? 'success' : undefined" size="18" class="mr-2">
              {{ passwordChecks.digit ? 'mdi-check-circle' : 'mdi-circle-outline' }}
            </v-icon>
            Číslica
          </div>
          <div class="d-flex align-center">
            <v-icon :color="passwordChecks.special ? 'success' : undefined" size="18" class="mr-2">
              {{ passwordChecks.special ? 'mdi-check-circle' : 'mdi-circle-outline' }}
            </v-icon>
            Špeciálny znak
          </div>
        </div>

        <v-text-field
          v-model="form.confirmPassword"
          :type="form.showConfirm ? 'text' : 'password'"
          :append-inner-icon="form.showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="form.showConfirm = !form.showConfirm"
          label="Potvrdenie hesla *"
          :rules="[
            v => !!v || 'Povinné pole',
            v => v === form.newPassword || 'Heslá sa nezhodujú'
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
          :disabled="!token"
          @click="updatePassword"
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
