<template>
  <v-app>
    <AppHeader />
    <section class="py-16">
      <v-container class="form-container fill-height d-flex align-center justify-center">
        <v-card elevation="12" class="pa-6 rounded-2xl" max-width="600">
          <v-card-title class="text-h5 text-center font-weight-bold"> {{ $t('ResetPasswordPage.title') }} </v-card-title>

          <v-card-subtitle class="text-center mb-6" v-if="step === 'request'">
            {{ $t('ResetPasswordPage.subtitle_request') }}
          </v-card-subtitle>
          <v-card-subtitle class="text-center mb-6" v-else>
            {{ $t('ResetPasswordPage.subtitle_reset') }}
          </v-card-subtitle>
          <v-window v-model="step">
            <v-window-item value="request">
              <v-form ref="requestForm" v-model="validRequest" class="form-fix">
                <v-label class="opacity-100">
                  <span class="font-weight-bold">{{ $t('ResetPasswordPage.form.email') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  v-model="requestData.email"
                  :placeholder="$t('ResetPasswordPage.form.email_placeholder')"
                  type="email"
                  :rules="[rules.required, rules.email]"
                />

                <v-alert type="info" variant="tonal" class="mt-2 rounded-lg">
                  {{ $t('ResetPasswordPage.form.info_reset') }}
                </v-alert>

                <v-btn
                  color="#3A803D"
                  rounded="lg"
                  size="large"
                  class="mt-4 text-white"
                  block
                  :loading="loadingStore.is('forgotPassword')"
                  @click="sendResetLink"
                >
                  {{ $t('ResetPasswordPage.buttons.send_reset') }}
                </v-btn>
              </v-form>
            </v-window-item>
            <v-window-item value="reset">
              <v-form ref="resetForm" v-model="validReset" class="form-fix">
                <v-label class="opacity-100">
                  <span class="font-weight-bold">{{ $t('ResetPasswordPage.form.email') }}</span>
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
                  :placeholder="$t('ResetPasswordPage.form.email_placeholder')"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  readonly
                />

                <v-label class="opacity-100 mt-4">
                  <span class="font-weight-bold">{{ $t('ResetPasswordPage.form.new_password') }}</span>
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
                  :placeholder="$t('ResetPasswordPage.form.new_password_placeholder')"
                  :rules="[rules.required, rules.password]"
                />

                <v-label class="opacity-100 mt-4">
                  <span class="font-weight-bold">{{ $t('ResetPasswordPage.form.confirm_password') }}</span>
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
                  :placeholder="$t('ResetPasswordPage.form.confirm_password_placeholder')"
                  :rules="[
                    rules.required,
                    v => v === resetData.newPassword || $t('ResetPasswordPage.rules.password_match')
                  ]"
                />

                <v-alert type="warning" variant="tonal" class="mt-2 rounded-lg" v-if="!token">
                  {{ $t('ResetPasswordPage.alerts.invalid_token') }}
                </v-alert>

                <v-btn
                  color="#3A803D"
                  rounded="lg"
                  size="large"
                  class="mt-4 text-white"
                  block
                  :loading="loadingStore.is('updatePassword')"
                  :disabled="!token"
                  @click="updatePassword"
                >
                  {{ $t('ResetPasswordPage.buttons.update_password') }}
                </v-btn>
              </v-form>
            </v-window-item>
          </v-window>

          <div class="my-6 text-center">
            <v-divider />
            <div class="text-caption mt-n3 bg-white px-3 d-inline-block">{{ $t('ResetPasswordPage.or') }}</div>
          </div>

          <v-btn variant="outlined" rounded="lg" block class="mb-4" :to="{ name: 'Login' }">
            {{ $t('ResetPasswordPage.buttons.back_to_login') }}
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
import { useLoadingStore } from '@/stores/loadingStore.js'

export default {
  components: { AppHeader, AppFooter },
  data() {
    return {
      authStore: useAuthStore(),
      loadingStore: useLoadingStore(),
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
        required: v => !!v || this.$t('common.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('common.email'),
        password: v =>
          /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v) ||
          this.$t('ResetPasswordPage.rules.password'),
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
