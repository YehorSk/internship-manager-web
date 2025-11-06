<template>
  <v-card outlined>
    <v-card-title>Zmeniť heslo</v-card-title>
    <v-card-subtitle>
      Pravidelne aktualizujte svoje heslo, aby ste udržali svoj účet v bezpečí
    </v-card-subtitle>
    <v-card-text>
      <v-form ref="resetForm" v-model="validReset" class="form-fix">
      <v-row>
        <v-col cols="12" md="4">
          <v-label class="opacity-100">
            <span class="font-weight-bold">Aktuálne heslo</span>
            <span class="font-weight-bold text-red ml-2">*</span>
          </v-label>
          <v-text-field
            rounded="lg"
            density="compact"
            variant="solo-filled"
            flat
            single-line
            type="password"
            v-model="form.currentPassword"
            :rules="[rules.required, rules.password]"
            prepend-inner-icon="mdi-lock"
            required
            placeholder="Zadajte aktuálne heslo"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-label class="opacity-100">
            <span class="font-weight-bold">Nové heslo</span>
            <span class="font-weight-bold text-red ml-2">*</span>
          </v-label>
          <v-text-field
            rounded="lg"
            density="compact"
            variant="solo-filled"
            flat
            single-line
            type="password"
            v-model="form.newPassword"
            :rules="[rules.required, rules.password, rules.match]"
            prepend-inner-icon="mdi-lock"
            required
            placeholder="Zadajte nové heslo"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-label class="opacity-100">
            <span class="font-weight-bold">Potvrďte heslo</span>
            <span class="font-weight-bold text-red ml-2">*</span>
          </v-label>
          <v-text-field
            rounded="lg"
            density="compact"
            variant="solo-filled"
            flat
            single-line
            type="password"
            v-model="form.confirmPassword"
            :rules="[rules.required, rules.password, rules.match]"
            prepend-inner-icon="mdi-lock"
            required
            placeholder="Potvrďte nové heslo"
          />
        </v-col>

        <v-col cols="12">
          <v-alert type="info" variant="tonal" rounded="lg" density="compact">
            Heslo musí mať aspoň 8 znakov a obsahovať kombináciu písmen, číslic a špeciálnych znakov
          </v-alert>
        </v-col>

        <v-col cols="12" class="text-right">
          <v-btn
            :loading="authStore.loading"
            rounded="lg"
            @click="changePassword"
            prepend-icon="mdi-lock"
            class="confirm-btn text-none"
            :disabled="false"
          >
            Zmeniť heslo
          </v-btn>
        </v-col>
      </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js'

export default {
  data() {
    return {
      authStore: useAuthStore(),
      validReset: false,
      form: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      rules: {
        required: v => !!v || 'Povinné pole',
        password: v =>
          /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v) ||
          'Min. 8 znakov, aspoň 1 písmeno a 1 číslo',
        match: v =>
          v === this.form.newPassword || 'Heslá sa nezhodujú',
      }
    }
  },
  created() {
  },
  methods: {
    async changePassword() {
      const { valid } = await this.$refs.resetForm.validate()
      if (!valid) return
      if (this.form?.newPassword === this.form?.currentPassword) {
        this.showError = true
        return
      }
      await this.authStore.changePassword({
        current_password: this.form?.currentPassword,
        password: this.form?.newPassword,
        password_confirmation: this.form?.confirmPassword,
      })
    },
  }
}
</script>
<style scoped>
::v-deep(.v-container) {
  margin-left: 260px;
  width: calc(100vw - 260px);
}
.confirm-btn {
  background-color: #3A803D;
  color: white;
}
.confirm-btn:hover {
  background-color: #3A803D !important;
}
</style>
