<script>
import { ref } from 'vue'
import SuccessAlert from '@/components/alerts/SuccessAlert.vue'
import ErrorAlert from '@/components/alerts/ErrorAlert.vue'

export default {
  components: { ErrorAlert, SuccessAlert },
  data() {
    return {
      selectedRole: 'student',
      isLoading: false,
      showSuccess: false,
      showError: false,
      valid: false,

      studentData: {
        firstName: '',
        lastName: '',
        address: '',
        studentEmail: '',
        alternativeEmail: '',
        phoneNumber: '',
        fieldOfStudy: '',
      },

      companyData: {
        companyName: '',
        address: '',
        contactPersonName: '',
        contactPersonEmail: '',
        contactPersonPhone: '',
      },

      fieldsOfStudy: [
        'aplikovaná ekológia a environmentalistika',
        'aplikovaná informatika',
        'biológia',
        'digitálna ekonomika',
        'fyzika',
        'geografia v regionálnom rozvoji',
        'matematicko-štatistické a informačné metódy v ekonómii a finančníctve',
        'učiteľstvo biológie (v kombinácii)',
        'učiteľstvo ekológie (v kombinácii)',
        'učiteľstvo fyziky (v kombinácii)',
        'učiteľstvo geografie (v kombinácii)',
        'učiteľstvo chémie (v kombinácii)',
        'učiteľstvo informatiky (v kombinácii)',
        'učiteľstvo matematiky (v kombinácii)',
        'učiteľstvo odborných ekonomických predmetov (v kombinácii)',
        'umelá inteligencia - spracovanie prirodzených jazykov',
      ],

      rules: {
        required: (v) => !!v || 'Field is required',
        email: (v) => /.+@.+\..+/.test(v) || 'Invalid email',
        phone: (v) => /^\+?\d{7,15}$/.test(v) || 'Invalid phone number',
      },
    }
  },
  methods: {
    async submit() {
      this.showSuccess = false
      this.showError = false
      this.isLoading = true

      await new Promise(r => setTimeout(r, 500))

      let result

      if (this.selectedRole === 'student') {
        result = await this.$refs.studentForm.validate()
      } else {
        result = await this.$refs.companyForm.validate()
      }

      if (result.valid) {
        this.showSuccess = true
      } else {
        this.showError = true
      }

      this.isLoading = false
    },
  }
}
</script>

<template>
  <v-container class="form-container fill-height d-flex align-center justify-center">
    <v-card elevation="12" class="pa-6 rounded-2xl" max-width="600">
      <v-card-title class="text-h5 text-center font-weight-bold"> Vytvoriť účet </v-card-title>

      <v-card-subtitle class="text-center mb-6">
        Vyberte si svoju rolu a dokončite registráciu
      </v-card-subtitle>

      <v-tabs
        v-model="selectedRole"
        class="mb-6 rounded-lg"
        color="primary"
        align-tabs="center"
        grow
      >
        <v-tab value="student">
          <v-icon start>mdi-account</v-icon>
          Študent
        </v-tab>
        <v-tab value="company">
          <v-icon start>mdi-office-building</v-icon>
          Spoločnosť
        </v-tab>
      </v-tabs>

      <v-window v-model="selectedRole" class="rounded-xl">
        <v-window-item value="student">
          <v-form ref="studentForm" v-model="valid" class="d-flex flex-column gap-4">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="studentData.firstName"
                  label="Krstné meno *"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                  rounded="xl"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="studentData.lastName"
                  label="Priezvisko *"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                  rounded="xl"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="studentData.address"
              label="Adresa *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />


            <v-text-field
              v-model="studentData.studentEmail"
              label="Študentský e-mail *"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-text-field
              v-model="studentData.alternativeEmail"
              label="Alternatívny e-mail *"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-text-field
              v-model="studentData.phoneNumber"
              label="Telefónne číslo *"
              type="tel"
              :rules="[rules.required, rules.phone]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-autocomplete
              v-model="studentData.fieldOfStudy"
              :items="fieldsOfStudy"
              label="Študijný odbor *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              clearable
              hide-details="auto"
              persistent-hint
            />

            <v-alert type="info" variant="tonal" class="mt-2 rounded-lg">
              Po registrácii dostanete heslo e-mailom.
            </v-alert>

            <v-btn
              color="#3A803D"
              size="large"
              class="mt-4 rounded-xl text-white"
              block
              :loading="isLoading"
              @click="submit"
            >
              Registrovať sa ako študent
            </v-btn>
          </v-form>
        </v-window-item>

        <v-window-item value="company">
          <v-form ref="companyForm" v-model="valid" class="d-flex flex-column gap-4">
            <v-text-field
              v-model="companyData.companyName"
              label="Názov spoločnosti *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-text-field
              v-model="companyData.address"
              label="Adresa *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-text-field
              v-model="companyData.contactPersonName"
              label="Meno kontaktnej osoby *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-text-field
              v-model="companyData.contactPersonEmail"
              label="E-mail kontaktnej osoby *"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-text-field
              v-model="companyData.contactPersonPhone"
              label="Telefón kontaktnej osoby *"
              type="tel"
              :rules="[rules.required, rules.phone]"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />

            <v-alert type="warning" variant="tonal" class="mt-2 rounded-lg">
              Váš firemný účet potrebuje aktiváciu. Po kontrole vás budeme kontaktovať.
            </v-alert>

            <v-btn
              color="#3A803D"
              size="large"
              class="mt-4 rounded-xl text-white"
              block
              :loading="isLoading"
              @click="submit"
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

      <v-btn variant="outlined" block class="mb-4 rounded-xl"> Prihlásiť sa ako hosť </v-btn>

      <div class="text-center">
        <span class="text-body-2">Už máte účet?</span>
        <v-btn variant="text" color="#3A803D" class="font-weight-bold">Prihlásiť sa tu</v-btn>
      </div>
    </v-card>
    <SuccessAlert v-model="showSuccess" />
    <ErrorAlert v-model="showError" />
  </v-container>
</template>
