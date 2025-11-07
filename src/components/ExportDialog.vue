<template>
  <v-dialog v-model="localDialog" max-width="700">
    <v-card outlined rounded="lg">
      <v-card-title class="text-h6 font-weight-bold">
        Export reportov
      </v-card-title>
      <v-card-subtitle>
        Vyberte požadované filtre pre export reportov do CSV súboru
      </v-card-subtitle>

      <v-card-text>
        <v-form class="form-fix">
          <v-row>
            <v-col cols="12" md="6">
              <v-label class="opacity-100">
                <span class="font-weight-bold">Rok</span>
              </v-label>
              <v-autocomplete
                v-model="filters.year"
                :items="yearSuggestions"
                label="Rok"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                clearable
                prepend-inner-icon="mdi-calendar"
                @update:search="generateYearSuggestions"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100">
                <span class="font-weight-bold">Semester</span>
              </v-label>
              <v-select
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                :items="['Zimný', 'Letný']"
                label="Vyberte semester"
                v-model="filters.semester"
                prepend-inner-icon="mdi-school"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100">
                <span class="font-weight-bold">Zamestnávateľ</span>
              </v-label>
              <v-autocomplete
                v-model="filters.employer"
                :items="companiesStore.companies"
                item-title="name"
                item-value="id"
                label="Zamestnávateľ"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                clearable
                :loading="companiesStore.loading"
                @update:search="searchCompanies"
                prepend-inner-icon="mdi-domain"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100">
                <span class="font-weight-bold">Študijný odbor</span>
              </v-label>
              <v-autocomplete
                v-model="filters.study_program"
                :items="studyPrograms"
                label="Študijný program"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                clearable
                prepend-inner-icon="mdi-book-open-page-variant"
              />
            </v-col>

            <v-col cols="12">
              <v-label class="opacity-100">
                <span class="font-weight-bold">Stav</span>
              </v-label>
              <v-select
                v-model="filters.status"
                :items="statusOptions()"
                item-title="label"
                item-value="value"
                label="Stav"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                clearable
                prepend-inner-icon="mdi-file-chart"
              />
            </v-col>

            <v-col cols="12">
              <v-alert type="info" variant="tonal" rounded="lg" density="compact">
                Po potvrdení sa vygeneruje report s uvedenými filtrami vo formáte CSV
              </v-alert>
            </v-col>

            <v-col cols="12" class="text-right">
              <v-btn
                rounded="lg"
                variant="text"
                class="mr-2"
                @click="localDialog = false"
              >
                Zrušiť
              </v-btn>
              <v-btn
                rounded="lg"
                prepend-icon="mdi-file-export"
                class="confirm-btn text-none"
              >
                Exportovať
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { generateAcademicYearSuggestions } from '@/utils/yearHelpers.js'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
import { useCompaniesStore } from '@/stores/companiesStore.js'
import { usePracticesStore } from '@/stores/practicesStore.js'
import { statusOptions } from '@/utils/statusHelpers.js'

export default {
  props: {
    dialog: Boolean,
  },
  data() {
    return {
      localDialog: this.dialog,
      yearSuggestions: [],
      programsStore: useStudyProgramsStore(),
      companiesStore: useCompaniesStore(),
      store: usePracticesStore(),
      filters: {
        year: null,
        semester: null,
        employer: null,
        study_program: null,
        status: null,
      },
    }
  },
  computed: {
    studyPrograms() {
      return this.programsStore.list.map(p => p.name)
    },
  },
  watch: {
    dialog(val) {
      this.localDialog = val
    },
    localDialog(val) {
      if (!val) this.$emit('close')
    },
  },
  async mounted() {
    await this.searchCompanies('')
    await this.searchStudents('')
  },
  methods: {
    async searchCompanies(query) {
      if (query?.trim().length >= 1) {
        await this.companiesStore.searchCompanies(query.trim())
      }
    },
    generateYearSuggestions(query) {
      this.yearSuggestions = generateAcademicYearSuggestions(query, this.role)
    },
    statusOptions() {
      return statusOptions
    },
  },
}
</script>

<style scoped>
.confirm-btn {
  background-color: #3A803D;
  color: white;
}
</style>
