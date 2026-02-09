<template>
  <v-card outlined>
    <v-card-title>{{ $t('ChangePassword.title') }}</v-card-title>
    <v-card-subtitle>
      {{ $t('ChangePassword.subtitle') }}
    </v-card-subtitle>
    <v-card-text>
      <v-form
        ref="resetForm"
        v-model="validReset"
        class="form-fix"
        @submit.prevent="changePassword"
      >
        <v-row>
          <v-col cols="12" md="4">
            <TextField
              icon="mdi-lock"
              type="password"
              :label="$t('ChangePassword.current')"
              :important="true"
              v-model="form.currentPassword"
              :rules="[rules.required]"
              :placeholder="$t('ChangePassword.placeholder_current')"
            />
          </v-col>

          <v-col cols="12" md="4">
            <TextField
              icon="mdi-lock"
              type="password"
              :label="$t('ChangePassword.new')"
              :important="true"
              v-model="form.newPassword"
              :rules="[rules.required, rules.password]"
              :placeholder="$t('ChangePassword.placeholder_new')"
            />
          </v-col>

          <v-col cols="12" md="4">
            <TextField
              icon="mdi-lock"
              type="password"
              :label="$t('ChangePassword.confirm')"
              :important="true"
              v-model="form.confirmPassword"
              :rules="[rules.required, rules.password, rules.match]"
              :placeholder="$t('ChangePassword.placeholder_confirm')"
            />
          </v-col>

          <v-col cols="12">
            <v-alert type="info" variant="tonal" rounded="lg" density="compact">
              {{ $t('ChangePassword.alert') }}
            </v-alert>
          </v-col>

          <v-col cols="12" class="text-right">
            <PrimaryButton
              icon="mdi-lock"
              class="confirm-btn text-none"
              rounded="lg"
              type="submit"
              :loading="loadingStore.is('changePassword')"
              :disabled="!validReset"
            >
              {{ $t('ChangePassword.button') }}
            </PrimaryButton>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js'
import { useLoadingStore } from '@/stores/loadingStore.js'
import TextField from '@/components/common/TextField.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

export default {
  components: { PrimaryButton, TextField },
  data() {
    return {
      authStore: useAuthStore(),
      loadingStore: useLoadingStore(),
      validReset: false,
      form: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      rules: {
        required: (v) => !!v || this.$t('common.required'),
        password: (v) =>
          /^(?=.*\d)[A-Za-z\d]{8,}$/.test(v) || this.$t('ResetPasswordPage.rules.password'),
        match: (v) => v === this.form.newPassword || this.$t('ChangePassword.rules.match'),
      },
    }
  },
  created() {},
  methods: {
    async changePassword() {
      console.log(this.form)
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
}
</script>
<style scoped>
::v-deep(.v-container) {
  margin-left: 260px;
  width: calc(100vw - 260px);
}
.confirm-btn {
  background-color: #3a803d;
  color: white;
}
.confirm-btn:hover {
  background-color: #3a803d !important;
}
</style>
