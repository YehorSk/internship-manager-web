<script>
import { useAuthStore } from '@/stores/authStore.js'
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      authStore: useAuthStore(),
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
      toast: useToast()
    }
  },
  methods: {
    async submit() {

      const result = await this.$refs.loginForm.validate()
      if (!result) return

      await this.authStore.login(this.loginData.email, this.loginData.password)
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
          :loading="authStore.loading"
          :disabled="!valid"
          @click="submit"
        >
          Prihlásiť sa
        </v-btn>
      </v-form>

      <div class="text-center mt-6">
        <v-btn
          variant="text"
          color="#3A803D"
          class="font-weight-bold"
          :to="{ name: 'rest-password' }"
        >
          Zabudnuté heslo?
        </v-btn>
      </div>

      <div class="my-6 text-center">
        <v-divider />
        <div class="text-caption mt-n3 bg-white px-3 d-inline-block">Alebo</div>
      </div>

      <v-btn variant="outlined" block class="mb-4 rounded-xl" :to="{ name: 'Info' }">
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
