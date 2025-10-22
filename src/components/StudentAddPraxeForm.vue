<template>
  <v-dialog v-model="dialog" max-width="900">
    <v-card outlined>
      <v-card-title>Vytvoriť novú prax</v-card-title>
      <v-card-subtitle>Vyplňte údaje o vašej odbornej praxi</v-card-subtitle>

      <v-card-text>
        <v-form ref="internForm" v-model="valid">
          <v-row>
            <v-col cols="12" md="6">
              <v-label>
                <span class="font-weight-bold">Zamestnávateľ</span>
                <span class="font-weight-bold text-red ml-2">*</span>
              </v-label>

              <v-radio-group v-model="employerMode" row>
                <v-radio label="Vybrať z databázy" value="existing" />
                <v-radio label="Nový zamestnávateľ" value="new" />
              </v-radio-group>

              <v-autocomplete
                v-if="employerMode === 'existing'"
                v-model="form.company"
                :items="companiesStore.companies"
                item-title="name"
                item-value="id"
                :loading="companiesStore.loading"
                :rules="[rules.required]"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                placeholder="Vyhľadajte zamestnávateľa"
                @update:search="searchCompanies"
              />

              <div v-else>
                <div v-if="companyAdded" class="mt-2">
                  <div
                    class="d-flex align-center justify-space-between pa-3 bg-grey-lighten-4 rounded-lg"
                  >
                    <div class="d-flex align-center">
                      <v-icon color="grey-darken-2" start>mdi-office-building</v-icon>
                      <span class="ml-2">{{ company.company_name }}</span>
                    </div>
                    <v-btn size="small" variant="tonal" color="grey" @click="editCompany">
                      Zmeniť
                    </v-btn>
                  </div>
                </div>

                <div v-else>
                  <v-btn
                    color="#3A803D"
                    class="text-white mt-2"
                    rounded="lg"
                    @click="openCompanyDialog"
                  >
                    + Pridať nového zamestnávateľa
                  </v-btn>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <v-label>
                <span class="font-weight-bold">Študijný program</span>
                <span class="font-weight-bold text-red ml-2">*</span>
              </v-label>
              <v-autocomplete
                v-model="form.study_program_id"
                :items="programsStore.list.map(p => ({ title: p.name, value: p.id }))"
                item-title="title"
                item-value="value"
                :loading="programsStore.loading"
                :rules="[rules.required]"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                placeholder="Vyberte študijný program"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">Pozícia</span></v-label>
              <v-text-field
                v-model="form.position"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                placeholder="Napr. Frontend Developer"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">Popis činností</span></v-label>
              <v-textarea
                v-model="form.description"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                placeholder="Stručný popis činností počas praxe"
                rows="3"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">Začiatok</span></v-label>
              <v-text-field
                v-model="form.start_date"
                type="date"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">Koniec</span></v-label>
              <v-text-field
                v-model="form.end_date"
                type="date"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label
              ><span class="font-weight-bold">Semester</span
              ><span class="text-red ml-2">*</span></v-label
              >
              <v-select
                v-model="form.semester"
                :items="['Zimný', 'Letný']"
                :rules="[rules.required]"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label
              ><span class="font-weight-bold">Akademický rok</span
              ><span class="text-red ml-2">*</span></v-label
              >
              <v-select
                v-model="form.academic_year"
                :items="academicYears"
                :rules="[rules.required]"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
            </v-col>

            <v-col cols="12" class="text-right mt-4">
              <v-btn color="#3A803D" class="text-white" rounded="lg" @click="submitForm">
                <v-icon start>mdi-check</v-icon> Uložiť prax
              </v-btn>
              <v-btn
                variant="tonal"
                color="grey"
                rounded="lg"
                class="ml-2"
                @click="closeDialog"
              >
                Zrušiť
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="companyDialog" max-width="700">
    <v-card outlined>
      <v-card-title>{{ editMode ? 'Upraviť zamestnávateľa' : 'Pridať nového zamestnávateľa' }}</v-card-title>
      <v-card-subtitle>Vyplňte všetky informácie o spoločnosti</v-card-subtitle>

      <v-card-text>
        <v-form ref="companyForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">Názov spoločnosti</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.company_name" :rules="[rules.required]" rounded="lg" density="compact" variant="solo-filled" flat single-line placeholder="Zadajte názov spoločnosti" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">Adresa</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.company_address" :rules="[rules.required]" rounded="lg" density="compact" variant="solo-filled" flat single-line placeholder="Zadajte adresu spoločnosti" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">Kontaktná osoba</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.contact_name" :rules="[rules.required]" rounded="lg" density="compact" variant="solo-filled" flat single-line placeholder="Zadajte meno kontaktnej osoby" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">Firemný email</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.company_email" :rules="[rules.required, rules.email]" type="email" rounded="lg" density="compact" variant="solo-filled" flat single-line placeholder="napr. info@firma.sk" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">Email kontaktnej osoby</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.contact_email" :rules="[rules.required, rules.email]" type="email" rounded="lg" density="compact" variant="solo-filled" flat single-line placeholder="napr. jan@firma.sk" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">Telefón</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.contact_phone" :rules="[rules.required, rules.phone]" rounded="lg" density="compact" variant="solo-filled" flat single-line placeholder="+421 900 000 000" />
            </v-col>

            <v-col cols="12" class="text-right mt-4">
              <v-btn color="#3A803D" class="text-white" rounded="lg" @click="saveCompany">
                <v-icon start>mdi-check</v-icon>{{ editMode ? 'Uložiť zmeny' : 'Uložiť' }}
              </v-btn>
              <v-btn variant="tonal" color="grey" rounded="lg" class="ml-2" @click="companyDialog = false">
                Zrušiť
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useToast } from 'vue-toastification'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
import { usePracticesStore } from '@/stores/practicesStore.js'
import { useCompaniesStore } from '@/stores/companies.js'

export default {
  data() {
    return {
      dialog: false,
      companyDialog: false,
      employerMode: 'existing',
      companyAdded: false,
      editMode: false,
      valid: false,
      toast: useToast(),
      programsStore: useStudyProgramsStore(),
      companiesStore: useCompaniesStore(),
      form: {
        company: '',
        semester: '',
        academic_year: '',
        start_date: '',
        end_date: '',
        study_program_id: '',
        position: '',
        description: '',
      },
      company: {
        company_name: '',
        company_address: '',
        contact_name: '',
        company_email: '',
        contact_email: '',
        contact_phone: '',
      },
      rules: {
        required: v => !!v || 'Povinné pole',
        email: v => /.+@.+\..+/.test(v) || 'Neplatný e-mail',
        phone: v => /^\+?\d{7,15}$/.test(v) || 'Neplatné číslo',
      }
    }
  },

  computed: {
    academicYears() {
      const year = new Date().getFullYear()
      return Array.from({ length: 5 }, (_, i) => `${year + i}/${year + i + 1}`)
    },
  },

  mounted() {
    this.searchCompanies('')
  },

  methods: {
    async searchCompanies(query) {
      if (query?.trim().length >= 1) {
        await this.companiesStore.searchCompanies(query.trim())
      }
    },

    formatDate(d) {
      return d ? new Date(d).toISOString().split('T')[0] : null
    },

    resetForm() {
      this.form = Object.assign({}, this.$options.data().form)
      this.company = Object.assign({}, this.$options.data().company)
      this.companyAdded = false
      this.employerMode = 'existing'
    },

    openDialog() {
      this.dialog = true
      if (!this.programsStore.list.length) this.programsStore.fetchPrograms()
    },

    closeDialog() {
      this.dialog = false
    },

    openCompanyDialog(edit = false) {
      this.editMode = edit
      if (!edit) this.resetCompany()
      this.companyDialog = true
    },

    resetCompany() {
      this.company = Object.assign({}, this.$options.data().company)
    },

    async saveCompany() {
      const result = await this.$refs.companyForm.validate()
      if (!result.valid) return
      this.companyAdded = true
      this.companyDialog = false
      this.toast.success(this.editMode ? 'Zamestnávateľ upravený!' : 'Zamestnávateľ pridaný!')
    },

    async submitForm() {
      const valid = await this.$refs.internForm.validate()
      if (!valid) return

      const t = this.toast
      const store = usePracticesStore()

      const data = {
        company_id: this.employerMode === 'existing' ? this.form.company : null,
        study_program_id: this.form.study_program_id,
        semester: this.form.semester === 'Zimný' ? 'winter' : 'summer',
        academic_year: this.form.academic_year,
        start_date: this.formatDate(this.form.start_date),
        end_date: this.formatDate(this.form.end_date),
        job_title: this.form.position,
        job_description: this.form.description,
        ...(this.employerMode === 'new' && this.company),
      }

      try {
        await store.createPractice(data)
        t.success(store.success)
        this.resetForm()
        this.closeDialog()
      } catch {
        Object.values(store.fieldErrors || { general: [store.error] })
          .flat()
          .forEach(msg => t.error(msg))
      }
    },
  },
}
</script>
