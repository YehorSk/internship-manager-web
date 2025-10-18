<template>
  <v-card outlined>
    <v-card-title>Change Password</v-card-title>
    <v-card-subtitle>
      Update your account password regularly to keep your account secure
    </v-card-subtitle>
    <v-card-text>
      <v-form ref="resetForm" v-model="validReset" class="form-fix">
      <v-row>
        <v-col cols="12" md="4">
          <v-label class="opacity-100">
            <span class="font-weight-bold">Current Password</span>
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
            placeholder="Enter current password"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-label class="opacity-100">
            <span class="font-weight-bold">New Password</span>
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
            placeholder="Enter new password"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-label class="opacity-100">
            <span class="font-weight-bold">Confirm Password</span>
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
            placeholder="Confirm new password"
          />
        </v-col>

        <v-col cols="12">
          <v-alert type="info" variant="tonal" rounded="lg" density="compact">
            Password must be at least 8 characters long and contain a mix of letters, numbers, and special characters
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
            Change Password
          </v-btn>
        </v-col>
      </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js'
import { useToast } from 'vue-toastification'

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
      },
      toast: useToast()
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
<style scoped>
::v-deep(.v-container) {
  margin-left: 260px;
  width: calc(100vw - 260px);
}
.confirm-btn {
  background-color: #2563eb; /* bg-blue-600 */
  color: white;
}
.confirm-btn:hover {
  background-color: #1d4ed8 !important; /* bg-blue-700 */
}
</style>
