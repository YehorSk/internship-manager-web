<template>
  <v-dialog v-model="dialog" max-width="900">
    <v-card outlined>
      <v-card-title>{{ $t('StudentAddPraxeForm.title') }}</v-card-title>
      <v-card-subtitle>{{ $t('StudentAddPraxeForm.subtitle') }}</v-card-subtitle>

      <v-card-text>
        <v-form ref="internForm" v-model="valid">
          <v-row>
            <v-col cols="12" md="6">
              <v-label>
                <span class="font-weight-bold">{{ $t('StudentAddPraxeForm.form.employer') }}</span>
                <span class="font-weight-bold text-red ml-2">*</span>
              </v-label>

              <v-radio-group v-model="employerMode" row>
                <v-radio :label="$t('StudentAddPraxeForm.form.chooseExisting')" value="existing" />
                <v-radio :label="$t('StudentAddPraxeForm.form.addNew')" value="new" />
              </v-radio-group>

              <v-autocomplete
                v-if="employerMode === 'existing'"
                v-model="form.company"
                :items="companiesStore.companies"
                item-title="name"
                item-value="id"
                :loading="loadingStore.is('searchCompanies')"
                :rules="[rules.required]"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                :placeholder="$t('StudentAddPraxeForm.form.searchEmployer')"
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
                    <v-btn size="small" variant="tonal" color="grey" @click="openCompanyDialog">
                      {{ $t('StudentAddPraxeForm.buttons.change') }}
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
                    {{ $t('StudentAddPraxeForm.buttons.addEmployer') }}
                  </v-btn>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <v-label>
                <span class="font-weight-bold">{{ $t('StudentAddPraxeForm.form.studyProgram') }}</span>
                <span class="font-weight-bold text-red ml-2">*</span>
              </v-label>
              <v-autocomplete
                v-model="form.study_program_id"
                :items="programsStore.list.map(p => ({ title: p.name, value: p.id }))"
                item-title="title"
                item-value="value"
                :loading="loadingStore.is('fetchPrograms')"
                :rules="[rules.required]"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                :placeholder="$t('StudentAddPraxeForm.form.selectStudyProgram')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.form.position') }}</span></v-label>
              <v-text-field
                v-model="form.position"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                :placeholder="$t('StudentAddPraxeForm.form.positionPlaceholder')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.form.description') }}</span></v-label>
              <v-textarea
                v-model="form.description"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                :placeholder="$t('StudentAddPraxeForm.form.descriptionPlaceholder')"
                rows="3"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.form.start') }}</span></v-label>
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
              <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.form.end') }}</span></v-label>
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
              ><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.form.semester') }}</span
              ><span class="text-red ml-2">*</span></v-label
              >
              <v-select
                v-model="form.semester"
                :items="[
                  { title: $t('semesters.winter'), value: 'winter' },
                  { title: $t('semesters.summer'), value: 'summer' }
                ]"
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
              ><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.form.academicYear') }}</span
              ><span class="text-red ml-2">*</span></v-label
              >
              <v-autocomplete
                v-model="form.academic_year"
                :items="yearSuggestions"
                :rules="[rules.required]"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                @focus="generateYearSuggestions('')"
                @update:search="generateYearSuggestions"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.form.is_paid_type_upper') }}</span></v-label>
              <v-checkbox
                :label="$t('StudentAddPraxeForm.form.is_paid_label')"
                v-model="form.is_paid"
              />
            </v-col>

            <v-col cols="12" class="text-right mt-4">
              <v-btn color="#3A803D"
                     class="text-white"
                     rounded="lg"
                     :loading="loadingStore.is('createPractice')"
                     @click="submitForm"
              >
                <v-icon start>mdi-check</v-icon> {{ $t('StudentAddPraxeForm.buttons.save') }}
              </v-btn>
              <v-btn
                variant="tonal"
                color="grey"
                rounded="lg"
                class="ml-2"
                @click="closeDialog"
              >
                {{ $t('common.cancel') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="companyDialog" max-width="700">
    <v-card outlined>
      <v-card-title>  {{ editMode ? $t('StudentAddPraxeForm.companyDialog.titleEdit') : $t('StudentAddPraxeForm.companyDialog.titleNew') }}</v-card-title>
      <v-card-subtitle>{{ $t('StudentAddPraxeForm.companyDialog.subtitle') }}</v-card-subtitle>

      <v-card-text>
        <v-form ref="companyForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">{{ $t('common.ico') }}</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.ico" :rules="[rules.required, rules.ico]" rounded="lg" density="compact" variant="solo-filled" flat single-line :placeholder="$t('common.enter_ico')" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.companyDialog.fields.name') }}</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.company_name" :rules="[rules.required]" rounded="lg" density="compact" variant="solo-filled" flat single-line :placeholder="$t('StudentAddPraxeForm.companyDialog.fields.name2')" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.companyDialog.fields.address') }}</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.company_address" :rules="[rules.required]" rounded="lg" density="compact" variant="solo-filled" flat single-line :placeholder="$t('StudentAddPraxeForm.companyDialog.fields.address2')" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.companyDialog.fields.contactName') }}</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.contact_name" :rules="[rules.required]" rounded="lg" density="compact" variant="solo-filled" flat single-line :placeholder="$t('StudentAddPraxeForm.companyDialog.fields.contactName2')" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.companyDialog.fields.companyEmail') }}</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.company_email" :rules="[rules.required, rules.email]" type="email" rounded="lg" density="compact" variant="solo-filled" flat single-line :placeholder="$t('StudentAddPraxeForm.companyDialog.fields.companyEmail2')" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.companyDialog.fields.contactEmail') }}</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.contact_email" :rules="[rules.required, rules.email]" type="email" rounded="lg" density="compact" variant="solo-filled" flat single-line :placeholder="$t('StudentAddPraxeForm.companyDialog.fields.contactEmail2')" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.companyDialog.fields.contactPhone') }}</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.contact_phone" :rules="[rules.required, rules.phone]" rounded="lg" density="compact" variant="solo-filled" flat single-line :placeholder="$t('StudentAddPraxeForm.companyDialog.fields.contactPhone2')" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.companyDialog.fields.contactPosition') }}</span><span class="text-red ml-2">*</span></v-label>
              <v-text-field v-model="company.contact_position" :rules="[rules.required]" rounded="lg" density="compact" variant="solo-filled" flat single-line :placeholder="$t('StudentAddPraxeForm.companyDialog.fields.contactPosition2')" />
            </v-col>

            <v-col cols="12" class="text-right mt-4">
              <v-btn color="#3A803D" class="text-white" rounded="lg" @click="saveCompany">
                <v-icon start>mdi-check</v-icon>{{ editMode ? $t('common.saveChanges') : $t('StudentAddPraxeForm.companyDialog.buttons.save') }}
              </v-btn>
              <v-btn variant="tonal" color="grey" rounded="lg" class="ml-2" @click="companyDialog = false">
                {{ $t('common.cancel') }}
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
import { useCompaniesStore } from '@/stores/companiesStore.js'
import { generateAcademicYearSuggestions } from '@/utils/yearHelpers.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useLoadingStore } from '@/stores/loadingStore.js'

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'update'],
  data() {
    return {
      dialog: false,
      companyDialog: false,
      employerMode: 'existing',
      valid: false,
      toast: useToast(),
      companyAdded: false,
      programsStore: useStudyProgramsStore(),
      companiesStore: useCompaniesStore(),
      loadingStore: useLoadingStore(),
      yearSuggestions: [],
      authStore: useAuthStore(),
      form: {
        company: '',
        semester: '',
        academic_year: '',
        start_date: '',
        end_date: '',
        study_program_id: '',
        position: '',
        description: '',
        is_paid: false
      },
      company: {
        company_name: '',
        company_address: '',
        contact_name: '',
        company_email: '',
        contact_email: '',
        contact_phone: '',
        contact_position: '',
        ico: ''
      },
      rules: {
        required: v => !!v || this.$t('common.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('common.email'),
        ico: v => /^\d{8}$/.test(v) || this.$t('CompanyProfileSettings.form.invalidIco'),
        phone: v => /^\+?\d{7,15}$/.test(v) || this.$t('StudentAddPraxeForm.form.invalidPhone')
      }
    }
  },

  computed: {
    role() {
      return this.authStore?.user?.roles?.[0]?.name
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
      this.form.company = this.company
      this.toast.success(
        this.editMode
          ? this.$t('StudentAddPraxeForm.companyDialog.messages.updated')
          : this.$t('StudentAddPraxeForm.companyDialog.messages.added')
      )
    },

    async submitForm() {
      const valid = await this.$refs.internForm.validate()
      if (!valid) return

      const store = usePracticesStore()

      const selectedCompany = this.companiesStore.companies.find(
        c => c.id === this.form.company
      )

      const data = {
        company_id: this.employerMode === 'existing' ? selectedCompany?.user_id : null,
        study_program_id: this.form.study_program_id,
        semester: this.form.semester,
        academic_year: this.form.academic_year,
        start_date: this.formatDate(this.form.start_date),
        end_date: this.formatDate(this.form.end_date),
        job_title: this.form.position,
        job_description: this.form.description,
        is_paid: this.form.is_paid,
        ...(this.employerMode === 'new' && this.company),
      }

      try {
        await store.createPractice(data)
        this.$emit('update')
        this.resetForm()
        this.closeDialog()
      } catch { /* empty */ }
    },
    generateYearSuggestions(query) {
      this.yearSuggestions = generateAcademicYearSuggestions(query, this.role)
    },
  },
}
</script>
