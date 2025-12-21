<template>
  <v-dialog v-model="localDialog" max-width="700">
    <v-card outlined rounded="lg">
      <v-card-title class="text-h6 font-weight-bold">{{ $t('ExportDialog.title') }}</v-card-title>
      <v-card-subtitle>{{ $t('ExportDialog.subtitle') }}</v-card-subtitle>

      <v-card-text>
        <v-form class="form-fix">
          <v-row>
            <v-col cols="12">
              <v-label class="opacity-100">
                <span class="font-weight-bold">{{ $t('ExportDialog.type') }}</span>
              </v-label>
              <v-select
                v-model="filters.report_type"
                :items="[
                  { title: $t('ExportDialog.reportTypes.practices_list'), value: 'practices_list' },
                  { title: $t('ExportDialog.reportTypes.practices_status_summary'), value: 'practices_status_summary' },
                  { title: $t('ExportDialog.reportTypes.companies_without_activation'), value: 'companies_without_activation' },
                  { title: $t('ExportDialog.reportTypes.companies_without_practices'), value: 'companies_without_practices' }
                ]"
                :label="$t('ExportDialog.type')"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                clearable
                prepend-inner-icon="mdi-file-chart"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">{{ $t('ExportDialog.year') }}</span></v-label>
              <v-autocomplete
                v-model="filters.year"
                :items="yearSuggestions"
                :label="$t('ExportDialog.year')"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                clearable
                prepend-inner-icon="mdi-calendar"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">{{ $t('ExportDialog.semester') }}</span></v-label>
              <v-select
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                :items="[
                  { title: $t('semesters.winter'), value: 'winter' },
                  { title: $t('semesters.summer'), value: 'summer' }
                ]"
                :label="$t('ExportDialog.semester')"
                v-model="filters.semester"
                clearable
                prepend-inner-icon="mdi-school"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">{{ $t('ExportDialog.employer') }}</span></v-label>
              <v-autocomplete
                v-model="filters.employer"
                :items="companiesStore.companies"
                item-title="name"
                item-value="id"
                :label="$t('ExportDialog.employer')"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                clearable
                :loading="loadingStore.is('searchCompanies')"
                @update:search="searchCompanies"
                prepend-inner-icon="mdi-domain"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">{{ $t('ExportDialog.studyProgram') }}</span></v-label>
              <v-autocomplete
                v-model="filters.study_program"
                :items="studyPrograms"
                :label="$t('ExportDialog.studyProgram')"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                clearable
                prepend-inner-icon="mdi-book-open-page-variant"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="opacity-100">
                <span class="font-weight-bold">{{ $t('ExportDialog.fromDate') }}</span>
              </v-label>
              <v-text-field
                v-model="filters.start_date"
                type="date"
                :label="$t('ExportDialog.fromDate')"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                clearable
                prepend-inner-icon="mdi-calendar-start"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100">
                <span class="font-weight-bold">{{ $t('ExportDialog.toDate') }}</span>
              </v-label>
              <v-text-field
                v-model="filters.end_date"
                type="date"
                :label="$t('ExportDialog.toDate')"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                clearable
                prepend-inner-icon="mdi-calendar-end"
              />
            </v-col>

            <v-col cols="12">
              <v-label class="opacity-100"><span class="font-weight-bold">{{ $t('ExportDialog.status') }}</span></v-label>
              <v-select
                v-model="filters.status"
                :items="reportStatusOptions().map(s => ({ ...s, label: $t(s.label) }))"
                item-title="label"
                item-value="value"
                :label="$t('ExportDialog.status')"
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
                {{ $t('ExportDialog.info') }}
              </v-alert>
            </v-col>

            <v-col cols="12" class="text-right">
              <v-btn rounded="lg" variant="text" class="mr-2" @click="localDialog = false">{{ $t('common.cancel') }}</v-btn>
              <v-btn rounded="lg" prepend-icon="mdi-file-export" class="confirm-btn text-none" :loading="loadingStore.is('generateReport')" @click="exportReport">
                {{ $t('ExportDialog.export') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
import { useCompaniesStore } from '@/stores/companiesStore.js'
import { useReportsStore } from '@/stores/reportsStore.js'
import { reportStatusOptions } from '@/utils/statusHelpers.js'
import { debounce } from 'lodash'
import { useLoadingStore } from '@/stores/loadingStore.js'
import TextField from '@/components/common/TextField.vue'

export default {
  components: { TextField },
  props: { dialog: Boolean },
  data() {
    return {
      localDialog: this.dialog,
      yearSuggestions: [],
      programsStore: useStudyProgramsStore(),
      companiesStore: useCompaniesStore(),
      reportsStore: useReportsStore(),
      loadingStore: useLoadingStore(),
      filters: {
        report_type: 'practices_list',
        year: null,
        semester: null,
        employer: null,
        study_program: null,
        status: null,
        start_date: null,
        end_date: null,
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
    await this.programsStore.fetchPrograms()
    this.yearSuggestions = await this.reportsStore.fetchAcademicYears()
  },
  created() {
    this.debouncedSearchCompanies = debounce(async (query) => {
      if (query?.trim().length >= 1) {
        await this.companiesStore.searchCompanies(query.trim())
      }
    }, 500)
  },
  methods: {
    reportStatusOptions() {
      return reportStatusOptions
    },
    async searchCompanies(query) {
      this.debouncedSearchCompanies(query)
    },
    async exportReport() {
      if (this.filters.employer) {
        const company = this.companiesStore.companies.find(c => c.id === this.filters.employer)
        if (company) this.filters.company_name = company.name
      }

      await this.reportsStore.generateReport(this.filters)

      Object.keys(this.filters).forEach(k => this.filters[k] = null)
      this.filters.report_type = 'practices_list'
      this.localDialog = false
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
