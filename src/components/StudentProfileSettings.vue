<template>
  <v-card outlined>
    <v-card-title>Nastavenia profilu</v-card-title>
    <v-card-subtitle>Spravujte svoje osobné údaje podľa svojej roly</v-card-subtitle>
    <v-card-text>
      <v-form ref="profileForm" v-model="valid" class="form-fix">
        <v-row>

          <template v-if="role === 'student'">
            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">Krstné meno</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.first_name"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-account"
                :rules="[rules.required]"
                placeholder="Zadajte krstné meno"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">Priezvisko</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.last_name"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-account"
                :rules="[rules.required]"
                placeholder="Zadajte priezvisko"
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
              <v-label class="opacity-100"><span class="font-weight-bold">Študentský e-mail</span></v-label>
              <v-text-field
                v-model="form.student_email"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-email"
                readonly
                disabled
                color="grey"
                hide-details
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">Primárny/Alternatívny e-mail</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.primary_email"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-email"
                :rules="[rules.required, rules.email]"
                placeholder="Zadajte primárny e-mail"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">Telefónne číslo</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.phone"
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

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">Študijný odbor</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-autocomplete
                v-model="form.study_program_id"
                :items="programsStore.list.map(p => ({ title: p.name, value: p.id }))"
                item-title="title"
                item-value="value"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-school"
                :loading="programsStore.loading"
                :rules="[rules.required]"
                placeholder="Vyberte študijný odbor"
              />
            </v-col>
          </template>

          <v-col cols="12" class="text-right">
            <v-btn
              :loading="authStore.loading"
              rounded="lg"
              @click="saveProfile"
              prepend-icon="mdi-content-save"
              class="confirm-btn text-none"
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
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'

export default {
  data() {
    return {
      authStore: useAuthStore(),
      programsStore: useStudyProgramsStore(),
      valid: false,
      form: {},
      role: '',
      rules: {
        required: v => !!v || 'Povinné pole',
        email: v => /.+@.+\..+/.test(v) || 'Neplatný e-mail',
        phone: v => /^\+?\d{7,15}$/.test(v) || 'Neplatné číslo',
      },
    }
  },

  async created() {
    const user = this.authStore.user || {}
    this.role = user.roles?.[0]?.name || 'student'

    if (this.role === 'student') {
      this.form = {
        ...user.student,
        study_program_id: user.student?.study_program?.[0]?.id || null,
      }
      await this.programsStore.fetchPrograms()
    }
  },

  methods: {
    async saveProfile() {

    },
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


