<template>
  <v-card outlined>
    <v-card-title>Nastavenia profilu</v-card-title>
    <v-card-subtitle>Spravujte svoje osobné údaje podľa svojej roly</v-card-subtitle>
    <v-card-text>
      <v-form ref="profileForm" v-model="valid" lazy-validation class="form-fix">
        <v-row>

          <template v-if="role === 'company'">
            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">Názov spoločnosti</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.name"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-office-building"
                :rules="[rules.required]"
                placeholder="Zadajte názov spoločnosti"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">E-mail spoločnosti</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.company_email"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-email"
                :rules="[rules.required, rules.email]"
                placeholder="Zadajte e-mail spoločnosti"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">Adresa</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.address"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-map-marker"
                :rules="[rules.required]"
                placeholder="Zadajte adresu"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">Meno kontaktnej osoby</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.contact_name"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-account"
                :rules="[rules.required]"
                placeholder="Zadajte meno kontaktnej osoby"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">E-mail kontaktnej osoby</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.contact_email"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-email"
                :rules="[rules.required, rules.email]"
                placeholder="Zadajte e-mail kontaktnej osoby"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">Telefónne číslo kontaktnej osoby</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.contact_phone"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-phone"
                :rules="[rules.required, rules.phone]"
                placeholder="Zadajte telefónne číslo"
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
              Uložiť zmeny
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
      initialForm: {},
      role: '',
      rules: {
        required: v => !!v || 'Povinné pole',
        email: v => /^(?!.*\.\.)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v) || 'Neplatný e-mail',
        phone: v => /^\+?\d{7,15}$/.test(v) || 'Neplatné číslo',
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
          contact_email: user.company?.contact_email || '',
          contact_phone: user.company?.contact_phone || '',
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

