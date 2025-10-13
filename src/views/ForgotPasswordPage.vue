<script>
import SuccessAlert from '@/components/alerts/SuccessAlert.vue'
import ErrorAlert from '@/components/alerts/ErrorAlert.vue'
import api from '@/services/api'

export default {
  name: 'PasswordResetPage',
  components: { ErrorAlert, SuccessAlert },
  data() {
    return {
      isLoading: false,
      showSuccess: false,
      showError: false,
      step: 'request', // 'request' | 'reset'
      token: null,
      validRequest: false,
      validReset: false,
      requestData: {
        email: '',
      },

      resetData: {
        email: '',
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
    const q = this.$route?.query || {}
    if (q.token) {
      this.token = String(q.token)
      this.step = 'reset'
    }
    if (q.email) {
      this.requestData.email = String(q.email)
      this.resetData.email = String(q.email)
    }
  },
  methods: {
    async simulateNetwork(delay = 700) {
      await new Promise(r => setTimeout(r, delay))
    },

    // async sendResetLink() {
    //   this.showSuccess = false
    //   this.showError = false
    //   const { valid } = await this.$refs.requestForm.validate()
    //   if (!valid) return

    //   this.isLoading = true
    //   try {
    //     await this.simulateNetwork()
    //     this.showSuccess = true
    //   } catch (e) {
    //     this.showError = true
    //   } finally {
    //     this.isLoading = false
    //   }
    // },
    async sendResetLink() {
      this.showSuccess = false
      this.showError = false

      const { valid } = await this.$refs.requestForm.validate()
      if (!valid) return

      this.isLoading = true
      try {
        await api.auth.forgotPassword({
          email: this.requestData.email,
        })
        this.showSuccess = true
      } catch (e) {
        this.showError = true
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    



    async updatePassword() {
      this.showSuccess = false
      this.showError = false
      const { valid } = await this.$refs.resetForm.validate()
      if (!valid) return

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

      <v-card-subtitle class="text-center mb-6" v-if="step === 'request'">
        Zadajte svoj e-mail a pošleme vám odkaz na obnovenie hesla
      </v-card-subtitle>
      <v-card-subtitle class="text-center mb-6" v-else>
        Nastavte si nové heslo
      </v-card-subtitle>
      <v-window v-model="step" class="rounded-xl">
        <v-window-item value="request">
          <v-form ref="requestForm" v-model="validRequest" class="d-flex flex-column gap-4">
            <v-text-field
              v-model="requestData.email"
              label="E-mail *"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-alert type="info" variant="tonal" class="mt-2 rounded-lg">
              Ak existuje účet s týmto e-mailom, odošleme odkaz na obnovenie hesla.
            </v-alert>

            <v-btn
              color="#3A803D"
              size="large"
              class="mt-4 rounded-xl text-white"
              block
              :loading="isLoading"
              @click="sendResetLink"
            >
              Odoslať odkaz na obnovenie
            </v-btn>
          </v-form>
        </v-window-item>
        <v-window-item value="reset">
          <v-form ref="resetForm" v-model="validReset" class="d-flex flex-column gap-4">
            <v-text-field
              v-if="resetData.email"
              v-model="resetData.email"
              label="E-mail"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              readonly
            />

            <v-text-field
              v-model="resetData.newPassword"
              :type="resetData.showNew ? 'text' : 'password'"
              :append-inner-icon="resetData.showNew ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="resetData.showNew = !resetData.showNew"
              label="Nové heslo *"
              :rules="[rules.required, rules.password]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-text-field
              v-model="resetData.confirmPassword"
              :type="resetData.showConfirm ? 'text' : 'password'"
              :append-inner-icon="resetData.showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="resetData.showConfirm = !resetData.showConfirm"
              label="Potvrdenie hesla *"
              :rules="[
                rules.required,
                v => v === resetData.newPassword || 'Heslá sa nezhodujú'
              ]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-alert type="warning" variant="tonal" class="mt-2 rounded-lg" v-if="!token">
              Neplatný alebo chýbajúci token. Skúste znova požiadať o odkaz na obnovenie.
            </v-alert>

            <v-btn
              color="#3A803D"
              size="large"
              class="mt-4 rounded-xl text-white"
              block
              :loading="isLoading"
              :disabled="!token"
              @click="updatePassword"
            >
              Aktualizovať heslo
            </v-btn>
          </v-form>
        </v-window-item>
      </v-window>

      <div class="my-6 text-center">
        <v-divider />
        <div class="text-caption mt-n3 bg-white px-3 d-inline-block">Alebo</div>
      </div>

      <v-btn variant="outlined" block class="mb-4 rounded-xl" @click="$router.push({ name: 'login' })">
        Späť na prihlásenie
      </v-btn>
    </v-card>

    <SuccessAlert v-model="showSuccess" />
    <ErrorAlert v-model="showError" />
  </v-container>
</template>
