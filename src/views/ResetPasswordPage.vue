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
          <v-form ref="requestForm" v-model="validRequest" class="form-fix">
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
              :loading="authStore.loading"
              @click="sendResetLink"
            >
              Odoslať odkaz na obnovenie
            </v-btn>
          </v-form>
        </v-window-item>
        <v-window-item value="reset">
          <v-form ref="resetForm" v-model="validReset" class="form-fix">
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
              type="password"
              label="Nové heslo *"
              :rules="[rules.required, rules.password]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-text-field
              v-model="resetData.confirmPassword"
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

            <v-alert type="warning" variant="tonal" class="mt-2 rounded-lg" v-if="!token">
              Neplatný alebo chýbajúci token. Skúste znova požiadať o odkaz na obnovenie.
            </v-alert>

            <v-btn
              color="#3A803D"
              size="large"
              class="mt-4 rounded-xl text-white"
              block
              :loading="authStore.loading"
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

      <v-btn variant="outlined" block class="mb-4 rounded-xl" :to="{ name: 'Login' }">
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
    const q = this.$route?.query || {}
    if (q?.token && q?.email) {
      this.token = String(q.token)
      this.requestData.email = String(q.email)
      this.resetData.email = String(q.email)
      this.step = 'reset'
    }
  },
  methods: {
    async sendResetLink() {

      const { valid } = await this.$refs.requestForm.validate()
      if (!valid) return

      await this.authStore.forgotPassword({email: this.requestData?.email})
    },
    async updatePassword() {
      const { valid } = await this.$refs.resetForm.validate()
      if (!valid) return

      if (!this.token) {
        return
      }

      await this.authStore.updatePassword({
        email: this.resetData?.email,
        token: this.token,
        password: this.resetData?.newPassword,
        password_confirmation: this.resetData?.confirmPassword,
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
