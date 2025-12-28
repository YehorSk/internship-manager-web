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
            <TextField
              v-model="form.email"
              :label="$t('RegistrationPage.company.email')"
              :placeholder="$t('RegistrationPage.company.email2')"
              :rules="[rules.required, rules.email]"
              :important="true"
              :outlined="true"
              type="email"
              textColor="opacity-100"
            />
            <TextField
              v-model="form.password"
              :label="$t('RegistrationPage.company.password')"
              :placeholder="$t('RegistrationPage.company.password2')"
              :rules="[rules.required, rules.password]"
              :important="true"
              :outlined="true"
              type="password"
              textColor="opacity-100"
            />
            <TextField
              v-model="form.password_confirmation"
              :label="$t('RegistrationPage.company.confirm_password')"
              :placeholder="$t('RegistrationPage.company.confirm_password2')"
              :rules="[rules.required, rules.password, rules.match]"
              :important="true"
              :outlined="true"
              type="password"
              textColor="opacity-100"
            />
            <PrimaryButton
              size="large"
              class="login-btn mt-2"
              block
              :loading="loadingStore.is('activateCompany')"
              :disabled="!valid"
              @click="submit"
            >
              {{ $t('CompanyActivationView.buttons.activate') }}
            </PrimaryButton>
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
import TextField from '@/components/common/TextField.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

export default {
  name: 'CompanyActivationView',
  components: { TextField, AppFooter, AppHeader, PrimaryButton },
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
        password: v =>
          /^(?=.*\d)[A-Za-z\d]{8,}$/.test(v)
          || this.$t('ResetPasswordPage.rules.password'),
        match: v =>
          v === this.form.password || this.$t('ChangePassword.rules.match'),
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
