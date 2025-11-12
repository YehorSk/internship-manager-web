<script>
import { useAuthStore } from '@/stores/authStore.js'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
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
        required: v => !!v || this.$t('RegistrationPage.errors.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('RegistrationPage.errors.email'),
        phone: v => /^\+?\d{7,15}$/.test(v) || this.$t('RegistrationPage.errors.phone'),
        studentEmail: v =>
          /@student\.ukf\.sk$/i.test(v) || this.$t('RegistrationPage.errors.student_email')
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
                <v-label class="opacity-100">
                  <span class="font-weight-bold">{{ $t('RegistrationPage.student.first_name') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="studentData.first_name"
                  :error-messages="fieldMsg('first_name')"
                  :placeholder="$t('RegistrationPage.student.first_name2')"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('first_name')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">{{ $t('RegistrationPage.student.last_name') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="studentData.last_name"
                  :error-messages="fieldMsg('last_name')"
                  :placeholder="$t('RegistrationPage.student.last_name2')"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('last_name')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">{{ $t('RegistrationPage.student.address') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="studentData.address"
                  :error-messages="fieldMsg('address')"
                  :placeholder="$t('RegistrationPage.student.address2')"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('address')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">{{ $t('RegistrationPage.student.student_email') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="studentData.student_email"
                  :error-messages="fieldMsg('student_email')"
                  :placeholder="$t('RegistrationPage.student.student_email2')"
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
                  <span class="font-weight-bold">{{ $t('RegistrationPage.student.primary_email') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="studentData.primary_email"
                  :error-messages="[...fieldMsg('primary_email'), ...fieldMsg('primary_email')]"
                  :placeholder="$t('RegistrationPage.student.primary_email2')"
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
                  <span class="font-weight-bold">{{ $t('RegistrationPage.student.phone') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="studentData.phone"
                  :error-messages="[...fieldMsg('phone'), ...fieldMsg('phone')]"
                  :placeholder="$t('RegistrationPage.student.phone2')"
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
                  <span class="font-weight-bold">{{ $t('RegistrationPage.student.study_program') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-autocomplete
                  v-model="studentData.study_program"
                  :error-messages="fieldMsg('study_program')"
                  :items="studyPrograms.list"
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
                  :loading="authStore.loading"
                  :disabled="!valid || authStore.loading"
                  type="submit"
                >
                  {{ $t('RegistrationPage.student.button') }}
                </v-btn>
              </v-form>
            </v-window-item>

            <v-window-item value="company">
              <v-form ref="companyForm" v-model="valid" class="form-fix" @submit.prevent="submit">
                <v-label class="opacity-100">
                  <span class="font-weight-bold">{{ $t('RegistrationPage.company.name') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.name"
                  :error-messages="fieldMsg('name')"
                  :placeholder="$t('RegistrationPage.company.name2')"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('name')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">{{ $t('RegistrationPage.company.email') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.company_email"
                  :error-messages="fieldMsg('company_email')"
                  :placeholder="$t('RegistrationPage.company.email2')"
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
                  <span class="font-weight-bold">{{ $t('RegistrationPage.company.address') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.address"
                  :error-messages="fieldMsg('address')"
                  :placeholder="$t('RegistrationPage.company.address2')"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('address')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">{{ $t('RegistrationPage.company.contact_name') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.contact_name"
                  :error-messages="fieldMsg('contact_name')"
                  :placeholder="$t('RegistrationPage.company.contact_name2')"
                  :rules="[rules.required]"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('contact_name')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">{{ $t('RegistrationPage.company.contact_position') }}</span>
                </v-label>
                <v-text-field
                  v-model="companyData.contact_position"
                  :error-messages="fieldMsg('contact_position')"
                  :placeholder="$t('RegistrationPage.company.contact_position2')"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  @update:modelValue="clearFieldError('contact_position')"
                />
                <v-label class="opacity-100">
                  <span class="font-weight-bold">{{ $t('RegistrationPage.company.contact_email') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.contact_email"
                  :error-messages="fieldMsg('contact_email')"
                  :placeholder="$t('RegistrationPage.company.contact_email2')"
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
                  <span class="font-weight-bold">{{ $t('RegistrationPage.company.contact_phone') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.contact_phone"
                  :error-messages="fieldMsg('contact_phone')"
                  :placeholder="$t('RegistrationPage.company.contact_phone2')"
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
                  <span class="font-weight-bold">{{ $t('RegistrationPage.company.password') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.password"
                  :error-messages="fieldMsg('password')"
                  :placeholder="$t('RegistrationPage.company.password2')"
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
                  <span class="font-weight-bold">{{ $t('RegistrationPage.company.confirm_password') }}</span>
                  <span class="font-weight-bold text-red ml-2">*</span>
                </v-label>
                <v-text-field
                  v-model="companyData.password_confirmation"
                  :placeholder="$t('RegistrationPage.company.confirm_password2')"
                  type="password"
                  :rules="[rules.required, v => v === companyData.password || 'Heslá sa nezhodujú']"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                />

                <v-alert type="warning" variant="tonal" class="mt-2 rounded-lg">{{ $t('RegistrationPage.company.company_warning') }}</v-alert>

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
