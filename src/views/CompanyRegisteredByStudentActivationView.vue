<template>
  <v-app>
    <AppHeader />
    <section class="py-16">
      <v-container class="form-container fill-height d-flex align-center justify-center">
        <v-card elevation="12" class="pa-6 rounded-2xl" max-width="600">
          <v-card-title class="text-h5 text-center font-weight-bold">
            {{ $t('CompanyActivationView.title') }}
          </v-card-title>

          <v-card-text class="text-center">
            <div>
              {{ $t('CompanyActivationView.description') }}
            </div>
            <div v-if="!token" class="mt-4 text-red-600">
              {{ $t('CompanyActivationView.missingToken') }}
            </div>
          </v-card-text>

          <v-form ref="activateForm" v-model="valid" class="form-fix" @submit.prevent="submit">
            <v-label class="opacity-100">
              <span class="font-weight-bold">{{ $t('RegistrationPage.company.email') }}</span>
              <span class="font-weight-bold text-red ml-2">*</span>
            </v-label>
            <v-text-field
              v-model="form.email"
              :placeholder="$t('RegistrationPage.company.email2')"
              type="email"
              :rules="[rules.required, rules.email]"
              rounded="lg"
              density="compact"
              variant="solo-filled"
              flat
              single-line
            />
            <v-label class="opacity-100">
              <span class="font-weight-bold">{{ $t('RegistrationPage.company.password') }}</span>
              <span class="font-weight-bold text-red ml-2">*</span>
            </v-label>
            <v-text-field
              v-model="form.password"
              :placeholder="$t('RegistrationPage.company.password2')"
              type="password"
              :rules="[rules.required, v => v.length >= 8 || 'Minimálne 8 znakov']"
              rounded="lg"
              density="compact"
              variant="solo-filled"
              flat
              single-line
            />
            <v-label class="opacity-100">
              <span class="font-weight-bold">{{ $t('RegistrationPage.company.confirm_password') }}</span>
              <span class="font-weight-bold text-red ml-2">*</span>
            </v-label>
            <v-text-field
              v-model="form.password_confirmation"
              :placeholder="$t('RegistrationPage.company.confirm_password2')"
              type="password"
              :rules="[rules.required, v => v === form.password || 'Heslá sa nezhodujú']"
              rounded="lg"
              density="compact"
              variant="solo-filled"
              flat
              single-line
            />
            <v-btn
              color="#3A803D"
              rounded="lg"
              size="large"
              class="login-btn mt-2 text-white"
              block
              :loading="loadingStore.is('activateCompany')"
              :disabled="!valid"
              @click="submit"
            >
              {{ $t('CompanyActivationView.buttons.activate') }}
            </v-btn>
          </v-form>
          <div class="text-center mt-6">
            <v-btn
              color="#3A803D"
              rounded="lg"
              class="login-btn text-none"
              block
              :to="{ name: 'Login' }"
            >
              {{ $t('CompanyActivationView.buttons.login') }}
            </v-btn>
          </div>
        </v-card>
      </v-container>
    </section>
    <AppFooter />
  </v-app>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useCompaniesStore } from '@/stores/companiesStore.js'
import { useLoadingStore } from '@/stores/loadingStore.js'

export default {
  name: 'CompanyActivationView',
  components: { AppFooter, AppHeader },
  data() {
    return {
      token: null,
      companiesStore: useCompaniesStore(),
      loadingStore: useLoadingStore(),
      form: {
        email: '',
        password: '',
        password_confirmation: '',
      },
      valid: false,
      rules: {
        required: v => !!v || this.$t('common.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('common.email'),
      },
    }
  },
  created() {
    const q = this.$route?.query || {}
    if (q?.token) {
      this.token = String(q.token)
    }
  },
  computed: {
    activated() {
      return this.companiesStore.activated
    }
  },
  methods: {
    async submit() {
      const result = await this.$refs.activateForm.validate()
      if (!result) return

      await this.companiesStore.activateCompanyData(this.token, this.form)
    },
  }
}
</script>

<style scoped>
.activate-btn {
  background-color: #3A803D;
  color: white;
}
.activate-btn:hover {
  background-color: #3A803D !important;
}
.login-btn {
  background-color: #3A803D;
  color: white;
}
.login-btn:hover {
  background-color: #3A803D !important;
}
</style>
