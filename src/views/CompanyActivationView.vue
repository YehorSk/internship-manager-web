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

          <v-row class="mt-4" align="center" justify="space-between">
            <v-col cols="12" sm="6">
              <v-btn
                :disabled="!token || loading || activated"
                color="primary"
                rounded="lg"
                class="activate-btn text-none"
                block
                @click="activateCompany"
              >
                <span v-if="!loading">{{ $t('CompanyActivationView.buttons.activate') }}</span>
                <span v-else>{{ $t('CompanyActivationView.buttons.activating') }}</span>
              </v-btn>
            </v-col>

            <v-col cols="12" sm="6">
              <v-btn
                color="#3A803D"
                rounded="lg"
                class="login-btn text-none"
                block
                :to="{ name: 'Login' }"
              >
                {{ $t('CompanyActivationView.buttons.login') }}
              </v-btn>
            </v-col>
          </v-row>
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

export default {
  name: 'CompanyActivationView',
  components: { AppFooter, AppHeader },
  data() {
    return {
      token: null,
      companiesStore: useCompaniesStore()
    }
  },
  created() {
    const q = this.$route?.query || {}
    if (q?.token) {
      this.token = String(q.token)
    }
  },
  computed: {
    loading() {
      return this.companiesStore.loading
    },
    activated() {
      return this.companiesStore.activated
    }
  },
  methods: {
    activateCompany() {
      this.companiesStore.activateCompany(this.token)
    }
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
