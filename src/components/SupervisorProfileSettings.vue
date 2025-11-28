<template>
  <v-card outlined>
    <v-card-title>{{ $t('SupervisorProfileSettings.title') }}</v-card-title>
    <v-card-subtitle>{{ $t('SupervisorProfileSettings.subtitle') }}</v-card-subtitle>

    <v-card-text>
      <v-form ref="profileForm" v-model="valid" lazy-validation class="form-fix">
        <v-row>

          <template v-if="role === 'supervisor'">
            <v-col cols="12" md="3">
              <v-label class="opacity-100">
                <span class="font-weight-bold">{{ $t('SupervisorProfileSettings.form.title') }}</span>
              </v-label>
              <v-text-field
                v-model="form.title"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                prepend-inner-icon="mdi-school"
                :placeholder="$t('SupervisorProfileSettings.form.placeholders.title')"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="opacity-100">
                <span class="font-weight-bold">{{ $t('SupervisorProfileSettings.form.firstName') }}</span>
                <span class="font-weight-bold text-red ml-2">*</span>
              </v-label>
              <v-text-field
                v-model="form.first_name"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                prepend-inner-icon="mdi-account"
                :rules="[rules.required]"
                :placeholder="$t('SupervisorProfileSettings.form.placeholders.firstName')"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="opacity-100">
                <span class="font-weight-bold">{{ $t('SupervisorProfileSettings.form.lastName') }}</span>
                <span class="font-weight-bold text-red ml-2">*</span>
              </v-label>
              <v-text-field
                v-model="form.last_name"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                prepend-inner-icon="mdi-account"
                :rules="[rules.required]"
                :placeholder="$t('SupervisorProfileSettings.form.placeholders.lastName')"
              />
            </v-col>

            <v-col cols="12" md="5">
              <v-label class="opacity-100">
                <span class="font-weight-bold">{{ $t('SupervisorProfileSettings.form.email') }}</span>
              </v-label>
              <v-text-field
                v-model="form.email"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                readonly
                disabled
                color="grey"
                hide-details
                prepend-inner-icon="mdi-email"
                :rules="[rules.required, rules.email]"
                :placeholder="$t('SupervisorProfileSettings.form.placeholders.email')"
              />
            </v-col>
          </template>

          <v-col cols="12" class="text-right">
            <v-btn
              rounded="lg"
              :disabled="!valid || !isChanged || profileStore.loading"
              :loading="profileStore.loading"
              prepend-icon="mdi-content-save"
              class="confirm-btn text-none"
              @click="saveProfile"
            >
              {{ $t('common.saveChanges') }}
            </v-btn>
          </v-col>

        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js'
import { useProfileStore } from '@/stores/profileStore.js'

export default {
  data() {
    return {
      authStore: useAuthStore(),
      profileStore: useProfileStore(),
      valid: false,
      form: {},
      role: '',
      rules: {
        required: v => !!v || this.$t('SupervisorProfileSettings.form.requiredField'),
        email: v =>
          /^(?!.*\.\.)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v) ||
          this.$t('SupervisorProfileSettings.form.invalidEmail')
      }
    }
  },

  async created() {
    const user = this.authStore.user || {}
    this.role = user.roles?.[0]?.name || ''

    if (this.role === 'supervisor') {
      const formData = {
        title: user.supervisor?.title || '',
        first_name: user.supervisor?.first_name || '',
        last_name: user.supervisor?.last_name || '',
        email: user.supervisor?.email || '',
      }
      this.form = { ...formData }
      this.initialForm = { ...formData }
    }
  },

  computed: {
    isChanged() {
      return JSON.stringify(this.form) !== JSON.stringify(this.initialForm)
    },
  },

  methods: {
    async saveProfile() {
      const isValid = await this.$refs.profileForm.validate()
      if (!isValid) return
      await this.profileStore.updateProfile(this.form)
      this.initialForm = { ...this.form }
      this.valid = false
    }
  },
}
</script>

<style scoped>
.confirm-btn {
  background-color: #3A803D;
  color: white;
}
.confirm-btn:hover {
  background-color: #3A803D !important;
}
</style>


