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
                :error-messages="fieldMsg('name')"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-office-building"
                :rules="[rules.required]"
                placeholder="Zadajte názov spoločnosti"
                @update:modelValue="clearFieldError('name')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">E-mail spoločnosti</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.company_email"
                :error-messages="fieldMsg('company_email')"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-email"
                :rules="[rules.required, rules.email]"
                placeholder="Zadajte e-mail spoločnosti"
                @update:modelValue="clearFieldError('company_email')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">Adresa</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.address"
                :error-messages="fieldMsg('address')"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-map-marker"
                :rules="[rules.required]"
                placeholder="Zadajte adresu"
                @update:modelValue="clearFieldError('address')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">Meno kontaktnej osoby</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.contact_name"
                :error-messages="fieldMsg('contact_name')"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-account"
                :rules="[rules.required]"
                placeholder="Zadajte meno kontaktnej osoby"
                @update:modelValue="clearFieldError('contact_name')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">E-mail kontaktnej osoby</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.contact_email"
                :error-messages="fieldMsg('contact_email')"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-email"
                :rules="[rules.required, rules.email]"
                placeholder="Zadajte e-mail kontaktnej osoby"
                @update:modelValue="clearFieldError('contact_email')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">Telefónne číslo kontaktnej osoby</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.contact_phone"
                :error-messages="fieldMsg('contact_phone')"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-phone"
                :rules="[rules.required, rules.phone]"
                placeholder="Zadajte telefónne číslo"
                @update:modelValue="clearFieldError('contact_phone')"
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
  watch: {
    'authStore.user': {
      deep: true,
      handler() {
        // Обновляем форму при изменении данных пользователя
        if (!this.isChanged) {
          this.loadFormData()
        }
      }
    }
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
    clearFieldError(field) {
      delete this.profileStore.fieldErrors?.[field]
    },
    fieldMsg(field) {
      return this.profileStore.fieldErrors?.[field] || []
    },
    async saveProfile() {
      const isValid = await this.$refs.profileForm.validate()
      if (!isValid) return
      
      this.profileStore.fieldErrors = {}
      const data = { ...this.form }
      
      try {
        await this.profileStore.updateProfile(data)
        // Данные пользователя обновляются в profileStore, форма обновится через watch
        // Обновляем initialForm, чтобы кнопка сохранить стала неактивной
        this.loadFormData()
      } catch (e) {
        // Ошибки уже обработаны в profileStore через handleError
        console.error('Error saving profile:', e)
      }
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

