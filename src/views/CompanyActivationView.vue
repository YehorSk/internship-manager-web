<template>
  <v-app>
    <AppHeader />
    <section class="py-16">
      <v-container class="form-container fill-height d-flex align-center justify-center">
        <v-card elevation="12" class="pa-6 rounded-2xl" max-width="600">
          <v-card-title class="text-h5 text-center font-weight-bold">
            Aktivácia spoločnosti
          </v-card-title>

          <v-card-text class="text-center">
            <div>
              Kliknite na tlačidlo nižšie pre aktiváciu vašej spoločnosti. Ak už máte aktivovaný účet,
              môžete sa prihlásiť pomocou tlačidla "Prihlásiť sa".
            </div>
            <div v-if="!token" class="mt-4 text-red-600">
              Chýba aktivačný token. Skontrolujte aktivačný odkaz vo vašom e-maile.
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
                <span v-if="!loading">Aktivovať</span>
                <span v-else>Aktivujem…</span>
              </v-btn>
            </v-col>

            <v-col cols="12" sm="6">
              <v-btn
                color="#3A803D"
                rounded="lg"
                class="login-btn text-none"
                block
                @click="$router.push('/login')"
              >
                Prihlásiť sa
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
import axios from 'axios'
import { useToast } from 'vue-toastification'

export default {
  name: 'CompanyActivationView',
  components: { AppFooter, AppHeader },
  data() {
    return {
      token: null,
      loading: false,
      toast: useToast(),
      activated: false
    }
  },
  created: function () {
    const q = this.$route?.query || {}
    if (q?.token) {
      this.token = String(q.token)
    }
  },
  methods: {
    async activateCompany() {
      if (!this.token) return
      this.loading = true
      let message = ''
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
        const url = `${baseUrl.replace(/\/$/, '')}/api/company/activate/${this.token}`
        const { data } = await axios.get(url)

        if (data?.success) {
          message = data.message || 'Aktivácia prebehla úspešne.'
          this.toast.success(message)
          this.activated = true
        } else {
          message = data?.message || 'Chyba pri aktivácii.'
          this.toast.error(message)
        }
      } catch (e) {
        message = e?.response?.data?.message || e.message || 'Chyba pri komunikácii so serverom.'
        this.toast.error(message)
      } finally {
        this.loading = false
      }
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
