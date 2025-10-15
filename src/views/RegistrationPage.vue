<script>
import { useAuthStore } from '@/stores/authStore.js'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
import { useToast } from "vue-toastification";

export default {
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
          const toast = useToast();
          toast.success(newValue);
          this.authStore.success = "";
        }
      },
      immediate: true,
    },
    'authStore.error': {
      handler(newValue) {
        if (newValue) {
          const toast = useToast();
          toast.error(newValue);
          this.authStore.error = "";
        }
      },
      immediate: true,
    },
  },
}
</script>


<template>
  <v-container class="form-container fill-height d-flex align-center justify-center">
    <v-card elevation="12" class="pa-6 rounded-2xl" max-width="600">
      <v-card-title class="text-h5 text-center font-weight-bold">Vytvoriť účet</v-card-title>
      <v-card-subtitle class="text-center mb-6">Vyberte si svoju rolu a dokončite registráciu</v-card-subtitle>

      <v-tabs v-model="selectedRole" class="mb-6 rounded-lg" color="primary" align-tabs="center" grow>
        <v-tab value="student"><v-icon start>mdi-account</v-icon> Študent</v-tab>
        <v-tab value="company"><v-icon start>mdi-office-building</v-icon> Spoločnosť</v-tab>
      </v-tabs>

      <v-window v-model="selectedRole" class="rounded-xl">
        <v-window-item value="student">
          <v-form ref="studentForm" v-model="valid" class="form-fix" @submit.prevent="submit">
            <v-text-field
              v-model="studentData.first_name"
              :error-messages="fieldMsg('first_name')"
              label="Krstné meno *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('first_name')"
            />
            <v-text-field
              v-model="studentData.last_name"
              :error-messages="fieldMsg('last_name')"
              label="Priezvisko *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('last_name')"
            />
            <v-text-field
              v-model="studentData.address"
              :error-messages="fieldMsg('address')"
              label="Adresa *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('address')"
            />
            <v-text-field
              v-model="studentData.student_email"
              :error-messages="fieldMsg('student_email')"
              label="Študentský e-mail *"
              type="email"
              :rules="[rules.required, rules.email, rules.studentEmail]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('student_email')"
            />
            <v-text-field
              v-model="studentData.primary_email"
              :error-messages="[...fieldMsg('primary_email'), ...fieldMsg('primary_email')]"
              label="Primárny/Alternatívny e-mail *"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('primary_email'); clearFieldError('primary_email')"
            />
            <v-text-field
              v-model="studentData.phone"
              :error-messages="[...fieldMsg('phone'), ...fieldMsg('phone')]"
              label="Telefónne číslo *"
              type="tel"
              :rules="[rules.required, rules.phone]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('phone'); clearFieldError('phone')"
            />

            <v-autocomplete
              v-model="studentData.study_program"
              :error-messages="fieldMsg('study_program')"
              :items="studyPrograms.list"
              item-title="name"
              item-value="id"
              label="Študijný odbor *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              clearable
              hide-details="auto"
              @update:modelValue="clearFieldError('study_program')"
            />

            <v-alert type="info" variant="tonal" class="mt-2 rounded-lg">Po registrácii dostanete heslo e-mailom.</v-alert>

            <v-btn
              color="#3A803D"
              size="large"
              class="mt-4 rounded-xl text-white"
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
            <v-text-field
              v-model="companyData.name"
              :error-messages="fieldMsg('name')"
              label="Názov spoločnosti *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('name')"
            />
            <v-text-field
              v-model="companyData.company_email"
              :error-messages="fieldMsg('company_email')"
              label="E-mail spoločnosti *"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('company_email')"
            />
            <v-text-field
              v-model="companyData.address"
              :error-messages="fieldMsg('address')"
              label="Adresa *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('address')"
            />
            <v-text-field
              v-model="companyData.contact_name"
              :error-messages="fieldMsg('contact_name')"
              label="Meno kontaktnej osoby *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('contact_name')"
            />
            <v-text-field
              v-model="companyData.contact_email"
              :error-messages="fieldMsg('contact_email')"
              label="E-mail kontaktnej osoby *"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('contact_email')"
            />
            <v-text-field
              v-model="companyData.contact_phone"
              :error-messages="fieldMsg('contact_phone')"
              label="Telefón kontaktnej osoby *"
              type="tel"
              :rules="[rules.required, rules.phone]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('contact_phone')"
            />
            <v-text-field
              v-model="companyData.password"
              :error-messages="fieldMsg('password')"
              label="Heslo *"
              type="password"
              :rules="[rules.required, v => v.length >= 8 || 'Minimálne 8 znakov']"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('password')"
            />
            <v-text-field
              v-model="companyData.password_confirmation"
              label="Potvrdenie hesla *"
              type="password"
              :rules="[rules.required, v => v === companyData.password || 'Heslá sa nezhodujú']"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-alert type="warning" variant="tonal" class="mt-2 rounded-lg">Váš firemný účet potrebuje aktiváciu. Po kontrole vás budeme kontaktovať.</v-alert>

            <v-btn
              color="#3A803D"
              size="large"
              class="mt-4 rounded-xl text-white"
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
        class="mb-4 rounded-xl"
        @click="$router.push('/')"
      >
        Prihlásiť sa ako hosť
      </v-btn>
      <div class="text-center">
        <span class="text-body-2">Už máte účet?</span>
        <v-btn
          variant="text"
          color="#3A803D"
          class="font-weight-bold"
          @click="$router.push('/login')"
        >
          Prihlásiť sa tu
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>
