<template>
  <v-app>
    <AppHeader />
    <section class="py-16">
      <v-container class="form-container fill-height d-flex align-center justify-center">
        <v-card elevation="12" class="pa-6 rounded-2xl" max-width="500">
          <v-card-title class="text-h5 text-center font-weight-bold"> {{ $t('LoginPage.title') }} </v-card-title>

          <v-card-subtitle class="text-center mb-6">
            {{ $t('LoginPage.subtitle') }}
          </v-card-subtitle>

          <v-form ref="loginForm" v-model="valid" class="d-flex flex-column gap-4">
            <v-text-field
              v-model="loginData.email"
              :label="$t('LoginPage.form.email')"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              rounded="lg"
            />

            <v-text-field
              v-model="loginData.password"
              :label="$t('LoginPage.form.password')"
              type="password"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="lg"
            />

            <v-btn
              color="#3A803D"
              rounded="lg"
              size="large"
              class="login-btn mt-2 text-white"
              block
              :loading="loadingStore.is('login')"
              :disabled="!valid"
              @click="submit"
            >
              {{ $t('LoginPage.buttons.login') }}
            </v-btn>
          </v-form>

          <div class="text-center mt-6">
            <v-btn
              variant="text"
              color="#3A803D"
              class="font-weight-bold"
              :to="{ name: 'reset-password' }"
            >
              {{ $t('LoginPage.buttons.forgot') }}
            </v-btn>
          </div>

          <div class="my-6 text-center">
            <v-divider />
            <div class="text-caption mt-n3 bg-white px-3 d-inline-block">{{ $t('LoginPage.other.or') }}</div>
          </div>

          <v-btn variant="outlined" rounded="lg" block class="home-btn mb-4" :to="{ name: 'Info' }">
            {{ $t('LoginPage.buttons.guest') }}
          </v-btn>

          <div class="text-center">
            <span class="text-body-2">{{ $t('LoginPage.other.noAccount') }}</span>
            <v-btn
              variant="text"
              color="#3A803D"
              class="font-weight-bold"
              :to="{ name: 'Register' }"
            >
              {{ $t('LoginPage.buttons.registerHere') }}
            </v-btn>
          </div>
        </v-card>

        <v-snackbar v-model="snackbar.show" color="red" timeout="4000" location="top center">
          {{ snackbar.message }}
        </v-snackbar>
      </v-container>
    </section>
    <AppFooter />
  </v-app>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useLoadingStore } from '@/stores/loadingStore.js'

export default {
  components: { AppFooter, AppHeader },
  data() {
    return {
      authStore: useAuthStore(),
      loadingStore: useLoadingStore(),
      valid: false,
      snackbar: {
        show: false,
        message: '',
      },
      loginData: {
        email: '',
        password: '',
      },
      rules: {
        required: v => !!v || this.$t('common.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('common.email'),
      },
    }
  },
  methods: {
    async submit() {
      const result = await this.$refs.loginForm.validate()
      if (!result) return

      await this.authStore.login(this.loginData.email, this.loginData.password)
    },
  },
}
</script>

<style scoped>
.login-btn {
  background-color: #3a803d;
}
.login-btn:hover {
  background-color: #3a803d !important;
}
</style>
