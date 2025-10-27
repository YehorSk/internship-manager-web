<script>
import { useAuthStore } from '@/stores/authStore.js'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
import { useToast } from "vue-toastification";
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  components: { AppFooter, AppHeader },
  data() {
    return {
      authStore: useAuthStore(),
      selectedRole: 'student',
      valid: false,
      studentData: this.getEmptyStudent(),
      companyData: this.getEmptyCompany(),
      studyPrograms: useStudyProgramsStore(),
      rules: {
        required: v => !!v || 'Povinné pole',
        email: v => /.+@.+\..+/.test(v) || 'Neplatný e-mail',
        phone: v => /^\+?\d{7,15}$/.test(v) || 'Neplatné číslo',
        studentEmail: v => /@student\.ukf\.sk$/i.test(v) || 'Musí byť univerzitný e-mail (@student.ukf.sk)',
      },
      toast: useToast()
    }
  },
  mounted() {
    const role = this.$route.query.role
    if (role === 'company') {
      this.selectedRole = 'company'
    }
    this.studyPrograms.fetchPrograms()
  },
  computed: {
    errorMsg() {
      return this.authStore.error || 'Nastala chyba'
    },
  },
  methods: {
    getEmptyStudent() {
      return {
        type: 1,
        first_name: '',
        last_name: '',
        address: '',
        student_email: '',
        primary_email: '',
        phone: '',
        study_program: '',
      }
    },
    getEmptyCompany() {
      return {
        type: 3,
        name: '',
        company_email: '',
        address: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        password: '',
        password_confirmation: ''
      }
    },
    clearFieldError(field) {
      delete this.authStore.fieldErrors?.[field]
    },
    fieldMsg(field) {
      return this.authStore.fieldErrors?.[field] || []
    },
    async submit() {
      this.showSuccess = this.showError = false
      this.authStore.error = ''
      this.authStore.fieldErrors = {}

      const isStudent = this.selectedRole === 'student'
      const form = this.$refs[isStudent ? 'studentForm' : 'companyForm']
      const result = await form?.validate()
      if (!result?.valid) return

      const data = isStudent ? this.studentData : this.companyData
      await this.authStore.register(data)

      if (isStudent) {
        this.studentData = this.getEmptyStudent()
        this.$refs.studentForm?.reset()
      } else {
        this.companyData = this.getEmptyCompany()
        this.$refs.companyForm?.reset()
      }

      this.valid = false
    },
  },
  watch: {
    selectedRole() {
      this.authStore.fieldErrors = {}
      this.authStore.error = ''
      this.valid = false
      this.$refs.studentForm?.resetValidation()
      this.$refs.companyForm?.resetValidation()
    },
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
  },
}
</script>


<template>
  <v-app>
    <AppHeader />
    <section class="py-16">
      <v-container class="form-container fill-height d-flex align-center justify-center">
        <v-card elevation="12" class="pa-6 rounded-2xl" max-width="600">
          <v-card-title class="text-h5 text-center font-weight-bold">Vytvoriť účet</v-card-title>
          <v-card-subtitle class="text-center mb-6">Vyberte si svoju rolu a dokončite registráciu</v-card-subtitle>

          <v-tabs v-model="selectedRole" class="mb-6 rounded-lg" color="primary" align-tabs="center" grow>
            <v-tab value="student"><v-icon start>mdi-account</v-icon> Študent</v-tab>
            <v-tab value="company"><v-icon start>mdi-office-building</v-icon> Spoločnosť</v-tab>
          </v-tabs>

          <v-window v-model="selectedRole">
            <v-window-item value="student">
              <v-form ref="studentForm" v-model="valid" class="form-fix" @submit.prevent="submit">
                <v-label class="opacity-100">
                  <span class="font-weight-bold">Krstné meno</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="studentData.first_name"
                  :error-messages="fieldMsg('first_name')"
                  placeholder="Zadajte krstné meno"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('first_name')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">Priezvisko</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="studentData.last_name"
                  :error-messages="fieldMsg('last_name')"
                  placeholder="Zadajte priezvisko"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('last_name')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">Adresa</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="studentData.address"
                  :error-messages="fieldMsg('address')"
                  placeholder="Zadajte adresu"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('address')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">Študentský e-mail</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="studentData.student_email"
                  :error-messages="fieldMsg('student_email')"
                  placeholder="Zadajte študentský e-mail"
                  type="email"
                  :rules="[rules.required, rules.email, rules.studentEmail]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('student_email')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">Primárny/Alternatívny e-mail</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="studentData.primary_email"
                  :error-messages="[...fieldMsg('primary_email'), ...fieldMsg('primary_email')]"
                  placeholder="Zadajte primárny e-mail"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('primary_email'); clearFieldError('primary_email')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">Telefónne číslo</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="studentData.phone"
                  :error-messages="[...fieldMsg('phone'), ...fieldMsg('phone')]"
                  placeholder="Zadajte telefónne číslo"
                  type="tel"
                  :rules="[rules.required, rules.phone]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('phone'); clearFieldError('phone')"
                />

                <v-label class="opacity-100">
                  <span class="font-weight-bold">Študijný odbor</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-autocomplete
                  v-model="studentData.study_program"
                  :error-messages="fieldMsg('study_program')"
                  :items="studyPrograms.list"
                  item-title="name"
                  item-value="id"
                  placeholder="Vyberte študijný odbor"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  clearable
                  hide-details="auto"
                  @update:modelValue="clearFieldError('study_program')"
                />

                <v-alert type="info" variant="tonal" class="mt-2 rounded-lg">Po registrácii dostanete heslo e-mailom.</v-alert>

                <v-btn
                  color="#3A803D"
                  size="large"
                  rounded="lg"
                  class="mt-4 text-white"
                  block
                  :loading="authStore.loading"
                  :disabled="!valid || authStore.loading"
                  type="submit"
                >
                  Registrovať sa ako študent
                </v-btn>
              </v-form>
            </v-window-item>

            <v-window-item value="company">
              <v-form ref="companyForm" v-model="valid" class="form-fix" @submit.prevent="submit">
                <v-label class="opacity-100">
                  <span class="font-weight-bold">Názov spoločnosti</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.name"
                  :error-messages="fieldMsg('name')"
                  placeholder="Zadajte názov spoločnosti"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('name')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">E-mail spoločnosti</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.company_email"
                  :error-messages="fieldMsg('company_email')"
                  placeholder="Zadajte e-mail spoločnosti"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('company_email')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">Adresa</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.address"
                  :error-messages="fieldMsg('address')"
                  placeholder="Zadajte adresu spoločnosti"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('address')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">Meno kontaktnej osoby</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.contact_name"
                  :error-messages="fieldMsg('contact_name')"
                  placeholder="Zadajte meno kontaktnej osoby"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('contact_name')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">E-mail kontaktnej osoby</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.contact_email"
                  :error-messages="fieldMsg('contact_email')"
                  placeholder="Zadajte e-mail kontaktnej osoby"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('contact_email')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">Telefón kontaktnej osoby</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.contact_phone"
                  :error-messages="fieldMsg('contact_phone')"
                  placeholder="Zadajte telefón kontaktnej osoby"
                  type="tel"
                  :rules="[rules.required, rules.phone]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('contact_phone')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">Heslo</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.password"
                  :error-messages="fieldMsg('password')"
                  placeholder="Zadajte heslo"
                  type="password"
                  :rules="[rules.required, v => v.length >= 8 || 'Minimálne 8 znakov']"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('password')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">Potvrdenie hesla</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.password_confirmation"
                  placeholder="Potvrďte heslo"
                  type="password"
                  :rules="[rules.required, v => v === companyData.password || 'Heslá sa nezhodujú']"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                />

                <v-alert type="warning" variant="tonal" class="mt-2 rounded-lg">Váš firemný účet potrebuje aktiváciu. Po kontrole vás budeme kontaktovať.</v-alert>

                <v-btn
                  color="#3A803D"
                  size="large"
                  rounded="lg"
                  class="mt-4 text-white"
                  block
                  :loading="authStore.loading"
                  :disabled="!valid || authStore.loading"
                  type="submit"
                >
                  Registrovať sa ako spoločnosť
                </v-btn>
              </v-form>
            </v-window-item>
          </v-window>

          <div class="my-6 text-center">
            <v-divider />
            <div class="text-caption mt-n3 bg-white px-3 d-inline-block">Alebo</div>
          </div>

          <v-btn
            variant="outlined"
            block
            rounded="lg"
            class="mb-4"
            :to="{ name: 'Info' }"
          >
            Prihlásiť sa ako hosť
          </v-btn>
          <div class="text-center">
            <span class="text-body-2">Už máte účet?</span>
            <v-btn
              variant="text"
              color="#3A803D"
              class="font-weight-bold"
              :to="{ name: 'Login' }"
            >
              Prihlásiť sa tu
            </v-btn>
          </div>
        </v-card>
      </v-container>

    </section>
    <AppFooter />
  </v-app>
</template>
