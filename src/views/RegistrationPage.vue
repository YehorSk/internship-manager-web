<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import SuccessAlert from '@/components/alerts/SuccessAlert.vue'
import ErrorAlert from '@/components/alerts/ErrorAlert.vue'

const auth = useAuthStore()

const selectedRole = ref('student')
const showSuccess = ref(false)
const showError = ref(false)
const valid = ref(false)
const studentForm = ref(null)
const companyForm = ref(null)
const successMsg = ref('')
const errorMsg = computed(() => auth.error || 'Nastala chyba')

const fe = computed(() => auth.fieldErrors)
const fieldMsg = k => fe.value?.[k] || []
const clearFieldError = k => { if (auth.fieldErrors[k]) delete auth.fieldErrors[k] }

const studentData = ref({
  first_name: '',
  last_name: '',
  address: '',
  student_email: '',
  alternative_email: '',
  phone_number: '',
  study_program: '',
})

const companyData = ref({
  name: '',
  address: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
})

const fieldsOfStudy = [
  'Bachelor in Informatics',
  'biológia',
  'digitálna ekonomika',
  'fyzika',
  'geografia v regionálnom rozvoji',
  'umelá inteligencia - spracovanie prirodzených jazykov',
]

const rules = {
  required: v => !!v || 'Povinné pole',
  email: v => /.+@.+\..+/.test(v) || 'Neplatný e-mail',
  phone: v => /^\+?\d{7,15}$/.test(v) || 'Neplatné číslo',
}

const revalidate = async () => {
  await nextTick()
  const form = selectedRole.value === 'student' ? studentForm.value : companyForm.value
  await form?.validate()
}

watch(selectedRole, () => {
  auth.fieldErrors = {}
  valid.value = false
  nextTick(() => {
    const form = selectedRole.value === 'student' ? studentForm.value : companyForm.value
    form?.resetValidation()
  })
})

const submit = async () => {
  showSuccess.value = false
  showError.value = false
  const form = selectedRole.value === 'student' ? studentForm.value : companyForm.value
  const result = await form?.validate()
  if (!result?.valid) {
    showError.value = true
    return
  }
  try {
    const res = selectedRole.value === 'student'
      ? await auth.registerStudent(studentData.value)
      : await auth.registerCompany(companyData.value)
    successMsg.value = res?.message || 'Registrácia prebehla úspešne'
    showSuccess.value = true
  } catch {
    showError.value = true
  }
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
          <v-form ref="studentForm" v-model="valid" class="d-flex flex-column gap-4" @submit.prevent="submit">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="studentData.first_name"
                  :error-messages="fieldMsg('first_name')"
                  label="Krstné meno *"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                  rounded="xl"
                  @update:modelValue="clearFieldError('first_name'); revalidate()"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="studentData.last_name"
                  :error-messages="fieldMsg('last_name')"
                  label="Priezvisko *"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                  rounded="xl"
                  @update:modelValue="clearFieldError('last_name'); revalidate()"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="studentData.address"
              :error-messages="fieldMsg('address')"
              label="Adresa *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('address'); revalidate()"
            />
            <v-text-field
              v-model="studentData.student_email"
              :error-messages="fieldMsg('student_email')"
              label="Študentský e-mail *"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('student_email'); revalidate()"
            />
            <v-text-field
              v-model="studentData.alternative_email"
              :error-messages="[...fieldMsg('primary_email'), ...fieldMsg('alternative_email')]"
              label="Primárny/Alternatívny e-mail *"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('primary_email'); clearFieldError('alternative_email'); revalidate()"
            />
            <v-text-field
              v-model="studentData.phone_number"
              :error-messages="[...fieldMsg('phone_number'), ...fieldMsg('phone')]"
              label="Telefónne číslo *"
              type="tel"
              :rules="[rules.required, rules.phone]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('phone_number'); clearFieldError('phone'); revalidate()"
            />

            <v-autocomplete
              v-model="studentData.study_program"
              :error-messages="fieldMsg('study_program')"
              :items="fieldsOfStudy"
              label="Študijný odbor *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              clearable
              hide-details="auto"
              @update:modelValue="clearFieldError('study_program'); revalidate()"
            />

            <v-alert type="info" variant="tonal" class="mt-2 rounded-lg">Po registrácii dostanete heslo e-mailom.</v-alert>

            <v-btn
              color="#3A803D"
              size="large"
              class="mt-4 rounded-xl text-white"
              block
              :loading="auth.loading"
              :disabled="auth.loading"
              type="submit"
            >
              Registrovať sa ako študent
            </v-btn>
          </v-form>
        </v-window-item>

        <v-window-item value="company">
          <v-form ref="companyForm" v-model="valid" class="d-flex flex-column gap-4" @submit.prevent="submit">
            <v-text-field
              v-model="companyData.name"
              :error-messages="fieldMsg('name')"
              label="Názov spoločnosti *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('name'); revalidate()"
            />
            <v-text-field
              v-model="companyData.address"
              :error-messages="fieldMsg('address')"
              label="Adresa *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('address'); revalidate()"
            />
            <v-text-field
              v-model="companyData.contact_name"
              :error-messages="fieldMsg('contact_name')"
              label="Meno kontaktnej osoby *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              @update:modelValue="clearFieldError('contact_name'); revalidate()"
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
              @update:modelValue="clearFieldError('contact_email'); revalidate()"
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
              @update:modelValue="clearFieldError('contact_phone'); revalidate()"
            />

            <v-alert type="warning" variant="tonal" class="mt-2 rounded-lg">Váš firemný účet potrebuje aktiváciu. Po kontrole vás budeme kontaktovať.</v-alert>

            <v-btn
              color="#3A803D"
              size="large"
              class="mt-4 rounded-xl text-white"
              block
              :loading="auth.loading"
              :disabled="auth.loading"
              type="submit"
            >
              Registrovať sa ako spoločnosť
            </v-btn>
          </v-form>
        </v-window-item>
      </v-window>

      <div class="my-6 text-center">
        <v-divider />
        <div class="text-caption mt-n3 bg-white px-3 d-inline-block">Or</div>
      </div>

      <v-btn variant="outlined" block class="mb-4 rounded-xl">Prihlásiť sa ako hosť</v-btn>
      <div class="text-center">
        <span class="text-body-2">Už máte účet?</span>
        <v-btn variant="text" color="#3A803D" class="font-weight-bold">Prihlásiť sa tu</v-btn>
      </div>
    </v-card>

    <SuccessAlert v-model="showSuccess">
      {{ successMsg }}
    </SuccessAlert>

    <ErrorAlert v-model="showError" :message="errorMsg" :items="auth.fieldErrors" />
  </v-container>
</template>
