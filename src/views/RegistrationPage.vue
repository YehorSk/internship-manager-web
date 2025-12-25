<script>
import { useAuthStore } from '@/stores/authStore.js'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useLoadingStore } from '@/stores/loadingStore.js'
import TextField from '@/components/common/TextField.vue'

export default {
  components: { TextField, AppFooter, AppHeader },
  data() {
    return {
      authStore: useAuthStore(),
      loadingStore: useLoadingStore(),
      selectedRole: 'student',
      valid: false,
      studentData: this.getEmptyStudent(),
      companyData: this.getEmptyCompany(),
      studyPrograms: useStudyProgramsStore(),
      rules: {
        required: v => !!v || this.$t('common.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('common.email'),
        phone: v => /^\+?\d{7,15}$/.test(v) || this.$t('RegistrationPage.errors.phone'),
        ico: v => /^\d{8}$/.test(v) || this.$t('RegistrationPage.errors.ico'),
        studentEmail: v =>
          /@student\.ukf\.sk$/i.test(v) || this.$t('RegistrationPage.errors.student_email'),
        password: v =>
          /^(?=.*\d)[A-Za-z\d]{8,}$/.test(v)
          || this.$t('ResetPasswordPage.rules.password'),
        match: v =>
          v === this.companyData.password || this.$t('ChangePassword.rules.match'),
      },
    }
  },
  mounted() {
    const role = this.$route.query.role
    if (role === 'company') {
      this.selectedRole = 'company'
    }
    this.studyPrograms.fetchPrograms()
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
        contact_position: '',
        password: '',
        password_confirmation: '',
        ico: ''
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
      this.authStore.clearErrors()
      this.valid = false
      this.$refs.studentForm?.resetValidation()
      this.$refs.companyForm?.resetValidation()
    }
  },
}
</script>


<template>
  <v-app>
    <AppHeader />
    <section class="py-16">
      <v-container class="form-container fill-height d-flex align-center justify-center">
        <v-card elevation="12" class="pa-6 rounded-2xl" max-width="600">
          <v-card-title class="text-h5 text-center font-weight-bold">{{ $t('RegistrationPage.title') }}</v-card-title>
          <v-card-subtitle class="text-center mb-6">{{ $t('RegistrationPage.subtitle') }}</v-card-subtitle>

          <v-tabs v-model="selectedRole" class="mb-6 rounded-lg" color="primary" align-tabs="center" grow>
            <v-tab value="student"><v-icon start>mdi-account</v-icon> {{ $t('RegistrationPage.tabs.student') }}</v-tab>
            <v-tab value="company"><v-icon start>mdi-office-building</v-icon> {{ $t('RegistrationPage.tabs.company') }}</v-tab>
          </v-tabs>

          <v-window v-model="selectedRole">
            <v-window-item value="student">
              <v-form ref="studentForm" v-model="valid" class="form-fix" @submit.prevent="submit">
                <TextField
                  v-model="studentData.first_name"
                  :label="$t('RegistrationPage.student.first_name')"
                  :placeholder="$t('RegistrationPage.student.first_name2')"
                  :rules="[rules.required]"
                  :error-messages="fieldMsg('first_name')"
                  @update:modelValue="clearFieldError('first_name')"
                  :important="true"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="studentData.last_name"
                  :label="$t('RegistrationPage.student.last_name')"
                  :placeholder="$t('RegistrationPage.student.last_name2')"
                  :rules="[rules.required]"
                  :error-messages="fieldMsg('last_name')"
                  @update:modelValue="clearFieldError('last_name')"
                  :important="true"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="studentData.address"
                  :label="$t('RegistrationPage.student.address')"
                  :placeholder="$t('RegistrationPage.student.address2')"
                  :rules="[rules.required]"
                  :error-messages="fieldMsg('address')"
                  @update:modelValue="clearFieldError('address')"
                  :important="true"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="studentData.student_email"
                  :label="$t('RegistrationPage.student.student_email')"
                  :placeholder="$t('RegistrationPage.student.student_email2')"
                  :rules="[rules.required, rules.email, rules.studentEmail]"
                  :error-messages="fieldMsg('student_email')"
                  @update:modelValue="clearFieldError('student_email')"
                  :important="true"
                  type="email"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="studentData.primary_email"
                  :label="$t('RegistrationPage.student.primary_email')"
                  :placeholder="$t('RegistrationPage.student.primary_email2')"
                  :rules="[rules.required, rules.email]"
                  :error-messages="fieldMsg('student_email')"
                  @update:modelValue="clearFieldError('primary_email')"
                  :important="true"
                  type="email"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="studentData.phone"
                  :label="$t('RegistrationPage.student.phone')"
                  :placeholder="$t('RegistrationPage.student.phone2')"
                  :rules="[rules.required, rules.phone]"
                  :error-messages="fieldMsg('phone')"
                  @update:modelValue="clearFieldError('phone')"
                  :important="true"
                  type="tel"
                  textColor="opacity-100"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">{{ $t('RegistrationPage.student.study_program') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-autocomplete
                  v-model="studentData.study_program"
                  :error-messages="fieldMsg('study_program')"
                  :items="studyPrograms.list"
                  :loading="loadingStore.is('fetchPrograms')"
                  item-title="name"
                  item-value="id"
                  :placeholder="$t('RegistrationPage.student.study_program2')"
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

                <v-alert type="info" variant="tonal" class="mt-2 rounded-lg">{{ $t('RegistrationPage.student.student_info') }}</v-alert>

                <v-btn
                  color="#3A803D"
                  size="large"
                  rounded="lg"
                  class="mt-4 text-white"
                  block
                  :loading="loadingStore.is('register')"
                  :disabled="!valid || loadingStore.is('register')"
                  type="submit"
                >
                  {{ $t('RegistrationPage.student.button') }}
                </v-btn>
              </v-form>
            </v-window-item>

            <v-window-item value="company">
              <v-form ref="companyForm" v-model="valid" class="form-fix" @submit.prevent="submit">
                <TextField
                  v-model="companyData.ico"
                  :label="$t('common.ico')"
                  :placeholder="$t('common.enter_ico')"
                  :rules="[rules.required, rules.ico]"
                  :error-messages="fieldMsg('ico')"
                  @update:modelValue="clearFieldError('ico')"
                  :important="true"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="companyData.name"
                  :label="$t('RegistrationPage.company.name')"
                  :placeholder="$t('RegistrationPage.company.name2')"
                  :rules="[rules.required]"
                  :error-messages="fieldMsg('name')"
                  @update:modelValue="clearFieldError('name')"
                  :important="true"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="companyData.company_email"
                  :label="$t('RegistrationPage.company.email')"
                  :placeholder="$t('RegistrationPage.company.email2')"
                  :rules="[rules.required, rules.email]"
                  :error-messages="fieldMsg('company_email')"
                  @update:modelValue="clearFieldError('company_email')"
                  type="email"
                  :important="true"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="companyData.address"
                  :label="$t('RegistrationPage.company.address')"
                  :placeholder="$t('RegistrationPage.company.address2')"
                  :rules="[rules.required]"
                  :error-messages="fieldMsg('address')"
                  @update:modelValue="clearFieldError('address')"
                  :important="true"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="companyData.contact_name"
                  :label="$t('RegistrationPage.company.contact_name')"
                  :placeholder="$t('RegistrationPage.company.contact_name2')"
                  :rules="[rules.required]"
                  :error-messages="fieldMsg('contact_name')"
                  @update:modelValue="clearFieldError('contact_name')"
                  :important="true"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="companyData.contact_position"
                  :label="$t('RegistrationPage.company.contact_position')"
                  :placeholder="$t('RegistrationPage.company.contact_position2')"
                  :error-messages="fieldMsg('contact_position')"
                  @update:modelValue="clearFieldError('contact_position')"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="companyData.contact_email"
                  :label="$t('RegistrationPage.company.contact_email')"
                  :placeholder="$t('RegistrationPage.company.contact_email2')"
                  :rules="[rules.required, rules.email]"
                  :error-messages="fieldMsg('contact_email')"
                  @update:modelValue="clearFieldError('contact_email')"
                  :important="true"
                  type="email"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="companyData.contact_phone"
                  :label="$t('RegistrationPage.company.contact_phone')"
                  :placeholder="$t('RegistrationPage.company.contact_phone2')"
                  :rules="[rules.required, rules.phone]"
                  :error-messages="fieldMsg('contact_phone')"
                  @update:modelValue="clearFieldError('contact_phone')"
                  :important="true"
                  type="tel"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="companyData.password"
                  :label="$t('RegistrationPage.company.password')"
                  :placeholder="$t('RegistrationPage.company.password2')"
                  :rules="[rules.required, rules.password]"
                  :error-messages="fieldMsg('password')"
                  @update:modelValue="clearFieldError('password')"
                  :important="true"
                  type="password"
                  textColor="opacity-100"
                />
                <TextField
                  v-model="companyData.password_confirmation"
                  :label="$t('RegistrationPage.company.confirm_password')"
                  :placeholder="$t('RegistrationPage.company.confirm_password2')"
                  :rules="[rules.required, rules.password, rules.match]"
                  :important="true"
                  type="password"
                  textColor="opacity-100"
                />

                <v-alert type="warning" variant="tonal" class="mt-2 rounded-lg">{{ $t('RegistrationPage.company.company_warning') }}</v-alert>

                <v-btn
                  color="#3A803D"
                  size="large"
                  rounded="lg"
                  class="mt-4 text-white"
                  block
                  :loading="loadingStore.is('register')"
                  :disabled="!valid || loadingStore.is('register')"
                  type="submit"
                >
                  {{ $t('RegistrationPage.company.button') }}
                </v-btn>
              </v-form>
            </v-window-item>
          </v-window>

          <div class="my-6 text-center">
            <v-divider />
            <div class="text-caption mt-n3 bg-white px-3 d-inline-block">{{ $t('RegistrationPage.or') }}</div>
          </div>

          <v-btn
            variant="outlined"
            block
            rounded="lg"
            class="mb-4"
            :to="{ name: 'Info' }"
          >
            {{ $t('RegistrationPage.guest') }}
          </v-btn>
          <div class="text-center">
            <span class="text-body-2">{{ $t('RegistrationPage.have_account') }}</span>
            <v-btn
              variant="text"
              color="#3A803D"
              class="font-weight-bold"
              :to="{ name: 'Login' }"
            >
              {{ $t('RegistrationPage.login_here') }}
            </v-btn>
          </div>
        </v-card>
      </v-container>

    </section>
    <AppFooter />
  </v-app>
</template>
