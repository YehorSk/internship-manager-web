<template>
  <v-card outlined>
    <v-card-title>{{ $t('SupervisorProfileSettings.title') }}</v-card-title>
    <v-card-subtitle>{{ $t('SupervisorProfileSettings.subtitle') }}</v-card-subtitle>

    <v-card-text>
      <v-form ref="profileForm" v-model="valid" lazy-validation class="form-fix">
        <v-row>

          <template v-if="role === 'supervisor'">
            <v-col cols="12" md="3">
              <TextField
                icon="mdi-school"
                :label="$t('SupervisorProfileSettings.form.title')"
                :rules="[rules.required]"
                :important="true"
                v-model="form.title"
                :placeholder="$t('SupervisorProfileSettings.form.placeholders.title')"
              />
            </v-col>

            <v-col cols="12" md="4">
              <TextField
                icon="mdi-account"
                :label="$t('SupervisorProfileSettings.form.firstName')"
                :rules="[rules.required]"
                :important="true"
                v-model="form.first_name"
                :placeholder="$t('SupervisorProfileSettings.form.placeholders.firstName')"
              />
            </v-col>

            <v-col cols="12" md="4">
              <TextField
                icon="mdi-account"
                :label="$t('SupervisorProfileSettings.form.lastName')"
                :rules="[rules.required]"
                :important="true"
                v-model="form.last_name"
                :placeholder="$t('SupervisorProfileSettings.form.placeholders.lastName')"
              />
            </v-col>

            <v-col cols="12" md="5">
              <TextField
                icon="mdi-email"
                :label="$t('SupervisorProfileSettings.form.email')"
                :isDisabled="true"
                v-model="form.email"
                :placeholder="$t('SupervisorProfileSettings.form.placeholders.email')"
              />
            </v-col>
          </template>

          <v-col cols="12" class="text-right">
            <v-btn
              rounded="lg"
              :disabled="!valid || !isChanged || loadingStore.is('updateProfile')"
              :loading="loadingStore.is('updateProfile')"
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
import { useLoadingStore } from '@/stores/loadingStore.js'
import TextField from '@/components/common/TextField.vue'

export default {
  components: { TextField },
  data() {
    return {
      authStore: useAuthStore(),
      profileStore: useProfileStore(),
      loadingStore: useLoadingStore(),
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


