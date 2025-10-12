<script>
import { useAuthStore } from '@/stores/authStore.js'

export default {
  data() {
    return {
      isLoading: false,
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
        required: (v) => !!v || 'Pole je povinné',
        email: (v) => /.+@.+\..+/.test(v) || 'Neplatný e-mail',
      },
    }
  },
  methods: {
    async submit() {
      this.isLoading = true

      const result = await this.$refs.loginForm.validate()
      if (!result) {
        this.isLoading = false
        return
      }

      const auth = useAuthStore()

      try {
        const res = await auth.login(this.loginData.email, this.loginData.password)
        const roles = res.data.roles || []
        const roleName = roles[0]?.name || ''

        const routes = {
          student: 'StudentDashboard',
          supervisor: 'SupervisorDashboard',
          company: 'CompanyDashboard',
        }

        const targetRoute = routes[roleName]
        this.$router.push({ name: targetRoute })
      } catch {
        this.snackbar.message = useAuthStore().error || 'prihlasenie zlyhalo.'
        this.snackbar.show = true
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<template>
  <v-container class="form-container fill-height d-flex align-center justify-center">
    <v-card elevation="12" class="pa-6 rounded-2xl" max-width="500">
      <v-card-title class="text-h5 text-center font-weight-bold">
        Prihlásenie
      </v-card-title>

      <v-card-subtitle class="text-center mb-6">
        Zadajte svoj e-mail a heslo pre prihlásenie
      </v-card-subtitle>

      <v-form ref="loginForm" v-model="valid" class="d-flex flex-column gap-4">
        <v-text-field
          v-model="loginData.email"
          label="E-mail *"
          type="email"
          :rules="[rules.required, rules.email]"
          variant="outlined"
          density="comfortable"
          rounded="xl"
        />

        <v-text-field
          v-model="loginData.password"
          label="Heslo *"
          type="password"
          :rules="[rules.required]"
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
          @click="submit"
        >
          Prihlásiť sa
        </v-btn>
      </v-form>

      <div class="text-center mt-6">
        <v-btn variant="text" color="#3A803D" class="font-weight-bold">
          Zabudnuté heslo?
        </v-btn>
      </div>

      <div class="my-6 text-center">
        <v-divider />
        <div class="text-caption mt-n3 bg-white px-3 d-inline-block">Alebo</div>
      </div>

      <v-btn variant="outlined" block class="mb-4 rounded-xl">
        Prihlásiť sa ako hosť
      </v-btn>

      <div class="text-center">
        <span class="text-body-2">Nemáte účet?</span>
        <v-btn
          variant="text"
          color="#3A803D"
          class="font-weight-bold"
          :to="{ name: 'Register' }"
        >
          Registrovať sa tu
        </v-btn>
      </div>
    </v-card>

    <v-snackbar
      v-model="snackbar.show"
      color="red"
      timeout="4000"
      location="top center"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>
