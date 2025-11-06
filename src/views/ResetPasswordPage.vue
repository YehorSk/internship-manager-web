<template>
  <v-app>
    <AppHeader />
    <section class="py-16">
      <v-container class="form-container fill-height d-flex align-center justify-center">
        <v-card elevation="12" class="pa-6 rounded-2xl" max-width="600">
          <v-card-title class="text-h5 text-center font-weight-bold"> Obnova hesla </v-card-title>

          <v-card-subtitle class="text-center mb-6" v-if="step === 'request'">
            Zadajte svoj e-mail a pošleme vám odkaz na obnovenie hesla
          </v-card-subtitle>
          <v-card-subtitle class="text-center mb-6" v-else>
            Nastavte si nové heslo
          </v-card-subtitle>
          <v-window v-model="step">
            <v-window-item value="request">
              <v-form ref="requestForm" v-model="validRequest" class="form-fix">
                <v-label class="opacity-100">
                  <span class="font-weight-bold">E-mail *</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  v-model="requestData.email"
                  placeholder="Zadajte váš e-mail"
                  type="email"
                  :rules="[rules.required, rules.email]"
                />

                <v-alert type="info" variant="tonal" class="mt-2 rounded-lg">
                  Ak existuje účet s týmto e-mailom, odošleme odkaz na obnovenie hesla.
                </v-alert>

                <v-btn
                  color="#3A803D"
                  rounded="lg"
                  size="large"
                  class="mt-4 text-white"
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
                <v-label class="opacity-100">
                  <span class="font-weight-bold">E-mail</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  v-if="resetData.email"
                  v-model="resetData.email"
                  placeholder="Váš e-mail"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  readonly
                />

                <v-label class="opacity-100 mt-4">
                  <span class="font-weight-bold">Nové heslo</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  v-model="resetData.newPassword"
                  type="password"
                  placeholder="Zadajte nové heslo"
                  :rules="[rules.required, rules.password]"
                />

                <v-label class="opacity-100 mt-4">
                  <span class="font-weight-bold">Potvrdenie hesla</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  v-model="resetData.confirmPassword"
                  type="password"
                  placeholder="Potvrďte nové heslo"
                  :rules="[
                    rules.required,
                    (v) => v === resetData.newPassword || 'Heslá sa nezhodujú',
                  ]"
                />

                <v-alert type="warning" variant="tonal" class="mt-2 rounded-lg" v-if="!token">
                  Neplatný alebo chýbajúci token. Skúste znova požiadať o odkaz na obnovenie.
                </v-alert>

                <v-btn
                  color="#3A803D"
                  rounded="lg"
                  size="large"
                  class="mt-4 text-white"
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

          <v-btn variant="outlined" rounded="lg" block class="mb-4" :to="{ name: 'Login' }">
            Späť na prihlásenie
          </v-btn>
        </v-card>
      </v-container>
    </section>
    <AppFooter />
  </v-app>
</template>
<script>
import { useAuthStore } from '@/stores/authStore.js'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'

export default {
  components: { AppHeader, AppFooter },
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
      }
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
  }
}
</script>
<style>

</style>
