<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar/>

        <v-container fluid class="pa-4">
          <v-row class="align-center mb-4">
            <v-col cols="8">
              <h1 class="text-h5 mb-1">{{ $t('StudentPraxePage.title') }}</h1>
              <p class="text-subtitle-1">{{ $t('StudentPraxePage.subtitle') }}</p>
            </v-col>
            <v-col cols="4" class="d-flex justify-end">
              <v-btn
                color="#3A803D"
                class="text-white"
                @click="openForm"
              >
                <v-icon start>mdi-plus</v-icon>
                <span v-if="!$vuetify.display.smAndDown">{{ $t('StudentPraxePage.addPractice') }}</span>
              </v-btn>
            </v-col>
          </v-row>

          <v-card class="pa-6 mb-6">
            <v-row class="align-center mb-3">
              <v-icon color="grey-darken-1" start>mdi-filter-outline</v-icon>
              <span class="font-weight-medium text-grey-darken-2 text-subtitle-1">{{ $t('StudentPraxePage.filters') }}</span>
            </v-row>

            <v-row class="mt-2" dense>
              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="filters.study_program"
                  :items="studyPrograms"
                  :label="$t('StudentPraxePage.studyProgram')"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-autocomplete
                  v-model="filters.year"
                  :items="yearSuggestions"
                  :label="$t('StudentPraxePage.year')"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  @focus="generateYearSuggestions('')"
                  @update:search="generateYearSuggestions"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-select
                  v-model="filters.semester"
                  :items="[
                    { title: $t('semesters.winter'), value: 'winter' },
                    { title: $t('semesters.summer'), value: 'summer' }
                  ]"
                  :label="$t('StudentPraxePage.semester')"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="filters.employer"
                  :items="companiesStore.companies"
                  item-title="name"
                  item-value="id"
                  :label="$t('StudentPraxePage.employer')"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  :loading="companiesStore.loading"
                  @update:search="searchCompanies"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-select
                  v-model="filters.status"
                  :items="statusOptions()"
                  item-title="label"
                  item-value="value"
                  :label="$t('StudentPraxePage.status')"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>
            </v-row>
          </v-card>

          <v-card class="mb-6">
            <v-card-title class="text-h6 d-flex justify-space-between">
              <div>{{ $t('StudentPraxePage.listTitle') }}</div>
              <span class="text-body-2 text-grey-darken-1">
                 {{ $t('StudentPraxePage.total') }} {{ store.total_items }} {{ $t('StudentPraxePage.total2') }}
              </span>
            </v-card-title>

            <v-divider />

            <v-card-text>
              <template v-if="store.loading">
                <div class="text-center py-10">{{ $t('common.loading') }}</div>
              </template>

              <template v-else-if="!store.list.length">
                <div class="text-center py-12 text-grey-darken-1">
                  <v-icon size="64" color="#3A803D" class="mb-3">mdi-check-circle-outline</v-icon>
                  <p>{{ $t('StudentPraxePage.noPractices') }}</p>
                </div>
              </template>

              <template v-else>
                <v-table>
                  <thead>
                  <tr>
                    <th>{{ $t('StudentPraxePage.employer') }}</th>
                    <th>{{ $t('StudentPraxePage.pozicia') }}</th>
                    <th>{{ $t('StudentPraxePage.studyProgram') }}</th>
                    <th>{{ $t('StudentPraxePage.semester') }}</th>
                    <th>{{ $t('StudentPraxePage.year') }}</th>
                    <th>{{ $t('StudentPraxePage.obdobie') }}</th>
                    <th>{{ $t('StudentPraxePage.status') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                    v-for="p in store.list"
                    :key="p.id"
                    class="hover:bg-grey-lighten-5 cursor-pointer"
                    @click="openDetails(p)"
                  >
                  <td>{{ p.practice_company?.name || p.company?.name || '—' }}</td>
                    <td>{{ p.job_title || '—' }}</td>
                    <td>{{ p.study_program?.name || '—' }}</td>
                    <td>{{ $t('semesters.' + p.semester) }}</td>
                    <td>{{ p.academic_year }}</td>
                    <td>{{ formatDate(p.start_date) }} – {{ formatDate(p.end_date) }}</td>
                    <td>
                      <v-chip :style="{ backgroundColor: getStatusColor(p.status) }" class="text-white" size="small">
                        {{ $t(getStatusText(p.status)) }}
                      </v-chip>
                    </td>
                  </tr>
                  </tbody>
                </v-table>

                <v-pagination
                  v-if="store.total_pages > 1"
                  v-model="store.current_page"
                  :length="store.total_pages"
                  rounded="circle"
                  @update:modelValue="page => store.changePage(page, filters)"
                />
              </template>
            </v-card-text>
          </v-card>
          <StudentDetailsPraxeDialog
            v-model="detailsDialog"
            v-if="selectedPracticeId"
            :practice-id="selectedPracticeId"
            @update="updatePractice"
          />
          <StudentAddPraxeForm ref="formDialog" />
        </v-container>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import StudentAddPraxeForm from '@/components/StudentAddPraxeForm.vue'
import DetailsPraxeDialog from '@/components/DetailsPraxeDialog.vue'
import { usePracticesStore } from '@/stores/practicesStore.js'
import { useCompaniesStore } from '@/stores/companiesStore.js'
import { getStatusColor, getStatusText, statusOptions } from '@/utils/statusHelpers.js'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
import { generateAcademicYearSuggestions } from '@/utils/yearHelpers.js'
import { useAuthStore } from '@/stores/authStore.js'
import { debounce } from 'lodash'

export default {
  components: { Sidebar, StudentAddPraxeForm, StudentDetailsPraxeDialog: DetailsPraxeDialog },

  data() {
    return {
      detailsDialog: false,
      selectedPracticeId: null,
      store: usePracticesStore(),
      programsStore: useStudyProgramsStore(),
      companiesStore: useCompaniesStore(),
      yearSuggestions: [],
      authStore: useAuthStore(),
      filters: {
        year: null,
        semester: null,
        status: null,
        employer: null,
        study_program: null,
      },
    }
  },

  computed: {
    studyPrograms() {
      return this.programsStore.list.map(p => p.name)
    },
    role() {
      return this.authStore?.user?.roles?.[0]?.name
    },
  },

  watch: {
    filters: {
      deep: true,
      handler() {
        const filters = { ...this.filters }
        if (filters.employer) {
          const company = this.companiesStore.companies.find(c => c.id === filters.employer)
          if (company) {
            filters.company_name = company.name
          }
        }
        delete filters.employer
        this.store.current_page = 1
        this.store.fetchPractices(filters)
      }
    }
  },

  async mounted() {
    await this.programsStore.fetchPrograms()
    await this.store.fetchPractices()
  },

  created() {
    this.debouncedSearchCompanies = debounce(async (query) => {
      if (query?.trim().length >= 1) {
        await this.companiesStore.searchCompanies(query.trim())
      }
    }, 500)
  },

  methods: {
    statusOptions() {
      return statusOptions
    },
    openForm() {
      this.$refs.formDialog.openDialog()
    },
    formatDate(date) {
      if (!date) return '—'
      const d = new Date(date)
      return d.toISOString().split('T')[0]
    },
    getStatusColor,
    getStatusText,
    openDetails(practice) {
      this.selectedPracticeId = practice.id
      this.detailsDialog = true
    },
    updatePractice(updated) {
      if (!updated) return
      const idx = this.store.list.findIndex(p => p.id === updated.id)
      if (idx !== -1) this.store.list[idx] = { ...this.store.list[idx], ...updated }
    },
    async searchCompanies(query) {
      this.debouncedSearchCompanies(query)
    },
    generateYearSuggestions(query) {
      this.yearSuggestions = generateAcademicYearSuggestions(query, this.role)
    },
  },
}
</script>
