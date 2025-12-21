<template>
  <v-card outlined>
    <v-card-title>{{ $t('CompanyProfileSettings.title') }}</v-card-title>
    <v-card-subtitle>{{ $t('CompanyProfileSettings.subtitle') }}</v-card-subtitle>
    <v-card-text>
      <v-form ref="profileForm" v-model="valid" lazy-validation class="form-fix">
        <v-row>

          <template v-if="role === 'company'">
            <v-col cols="12" md="6">
              <TextField
                icon="mdi-domain"
                :label="$t('common.enter_ico')"
                :rules="[rules.required, rules.ico]"
                :important="true"
                v-model="form.ico"
                :placeholder="$t('common.ico')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <TextField
                icon="mdi-office-building"
                :label="$t('CompanyProfileSettings.form.name')"
                :rules="[rules.required]"
                :important="true"
                v-model="form.name"
                :placeholder="$t('CompanyProfileSettings.form.placeholders.name')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <TextField
                icon="mdi-email"
                :label="$t('CompanyProfileSettings.form.companyEmail')"
                :rules="[rules.required]"
                :isDisabled="true"
                v-model="form.company_email"
                :placeholder="$t('CompanyProfileSettings.form.placeholders.companyEmail')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <TextField
                icon="mdi-map-marker"
                :label="$t('CompanyProfileSettings.form.address')"
                :rules="[rules.required]"
                :important="true"
                v-model="form.address"
                :placeholder="$t('CompanyProfileSettings.form.placeholders.address')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <TextField
                icon="mdi-account"
                :label="$t('CompanyProfileSettings.form.contactName')"
                :rules="[rules.required]"
                :important="true"
                v-model="form.contact_name"
                :placeholder="$t('CompanyProfileSettings.form.placeholders.contactName')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <TextField
                icon="mdi-badge-account"
                :label="$t('CompanyProfileSettings.form.contactPosition')"
                :rules="[rules.required]"
                :important="true"
                v-model="form.contact_position"
                :placeholder="$t('CompanyProfileSettings.form.placeholders.contactPosition')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <TextField
                icon="mdi-email"
                :label="$t('CompanyProfileSettings.form.contactEmail')"
                :rules="[rules.required, rules.email]"
                :important="true"
                v-model="form.contact_email"
                :placeholder="$t('CompanyProfileSettings.form.placeholders.contactEmail')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <TextField
                icon="mdi-phone"
                :label="$t('CompanyProfileSettings.form.contactPhone')"
                :rules="[rules.required, rules.phone]"
                :important="true"
                v-model="form.contact_phone"
                :placeholder="$t('CompanyProfileSettings.form.placeholders.contactPhone')"
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
      initialForm: {},
      role: '',
      rules: {
        required: v => !!v || this.$t('CompanyProfileSettings.form.requiredField'),
        email: v => /^(?!.*\.\.)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v) || this.$t('CompanyProfileSettings.form.invalidEmail'),
        ico: v => /^\d{8}$/.test(v) || this.$t('CompanyProfileSettings.form.invalidIco'),
        phone: v => /^\+?\d{7,15}$/.test(v) || this.$t('CompanyProfileSettings.form.invalidPhone'),
      },
    }
  },

  async created() {
    this.loadFormData()
  },
  computed: {
    isChanged() {
      return JSON.stringify(this.form) !== JSON.stringify(this.initialForm)
    },
  },

  methods: {
    loadFormData() {
      const user = this.authStore.user || {}
      this.role = user.roles?.[0]?.name || 'company'

      if (this.role === 'company') {
        const formData = {
          name: user.company?.name || '',
          company_email: user.company?.company_email || '',
          address: user.company?.address || '',
          contact_name: user.company?.contact_name || '',
          contact_position: user.company?.contact_position || '',
          contact_email: user.company?.contact_email || '',
          contact_phone: user.company?.contact_phone || '',
          ico: user.company?.ico || '',
        }
        this.form = { ...formData }
        this.initialForm = { ...formData }
      }
    },

    async saveProfile() {
      const isValid = await this.$refs.profileForm.validate()
      if (!isValid) return
      const data = { ...this.form }
      await this.profileStore.updateProfile(data)
      this.loadFormData()
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

