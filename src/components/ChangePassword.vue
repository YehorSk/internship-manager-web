<template>
  <v-card outlined>
    <v-card-title>{{ $t('ChangePassword.title') }}</v-card-title>
    <v-card-subtitle>
      {{ $t('ChangePassword.subtitle') }}
    </v-card-subtitle>
    <v-card-text>
      <v-form ref="resetForm" v-model="validReset" class="form-fix">
      <v-row>
        <v-col cols="12" md="4">
          <v-label class="opacity-100">
            <span class="font-weight-bold">{{ $t('ChangePassword.current') }}</span>
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
            :placeholder="$t('ChangePassword.placeholder_current')"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-label class="opacity-100">
            <span class="font-weight-bold">{{ $t('ChangePassword.new') }}</span>
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
            :placeholder="$t('ChangePassword.placeholder_new')"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-label class="opacity-100">
            <span class="font-weight-bold">{{ $t('ChangePassword.confirm') }}</span>
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
            :placeholder="$t('ChangePassword.placeholder_confirm')"
          />
        </v-col>

        <v-col cols="12">
          <v-alert type="info" variant="tonal" rounded="lg" density="compact">
            {{ $t('ChangePassword.alert') }}
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
            {{ $t('ChangePassword.button') }}
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
        required: v => !!v || this.$t('ChangePassword.rules.required'),
        password: v =>
          /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v) ||
          this.$t('ChangePassword.rules.password'),
        match: v =>
          v === this.form.newPassword || this.$t('ChangePassword.rules.match'),
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
