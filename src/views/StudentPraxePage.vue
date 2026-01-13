<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar />

        <v-container fluid class="pa-4">
          <v-row class="align-center mb-4">
            <v-col cols="8">
              <h1 class="text-h5 mb-1">{{ $t('StudentPraxePage.title') }}</h1>
              <p class="text-subtitle-1">{{ $t('StudentPraxePage.subtitle') }}</p>
            </v-col>
            <v-col cols="4" class="d-flex justify-end">
              <PrimaryButton icon="mdi-plus" @click="openForm">
                <span v-if="!$vuetify.display.smAndDown">{{
                  $t('StudentPraxePage.addPractice')
                }}</span>
              </PrimaryButton>
            </v-col>
          </v-row>

          <Filters
            v-model="filters"
            :show-student="false"
            @change="onFiltersChange"
          />

          <v-card class="mb-6">
            <v-card-title class="text-h6 d-flex justify-space-between">
              <div>{{ $t('StudentPraxePage.listTitle') }}</div>
              <span class="text-body-2 text-grey-darken-1">
                {{ $t('StudentPraxePage.total') }} {{ store.total_items }}
                {{ $t('StudentPraxePage.total2') }}
              </span>
            </v-card-title>

            <v-divider />

            <v-card-text>
              <template v-if="loadingStore.is('fetchPractices')">
                <div class="text-center py-10">{{ $t('common.loading') }}</div>
              </template>

              <template v-else-if="!store.list.length && !store.last_added_list.length && !loadingStore.is('fetchPractices')">
                <div class="text-center py-12 text-grey-darken-1">
                  <v-icon size="64" color="#3A803D" class="mb-3">mdi-check-circle-outline</v-icon>
                  <p>{{ $t('StudentPraxePage.noPractices') }}</p>
                </div>
              </template>

              <template v-else>
                <v-table>
                  <thead>
                    <tr>
                      <th>{{ $t('Filters.employer') }}</th>
                      <th>{{ $t('StudentPraxePage.pozicia') }}</th>
                      <th>{{ $t('Filters.studyProgram') }}</th>
                      <th>{{ $t('Filters.semester') }}</th>
                      <th>{{ $t('Filters.year') }}</th>
                      <th>{{ $t('StudentPraxePage.obdobie') }}</th>
                      <th>{{ $t('Filters.status') }}</th>
                    </tr>
                  </thead>
                  <tbody v-if="store.last_added_list.length > 0">
                    <tr class="bg-green-lighten-5 text-green-darken-3">
                      <td colspan="7" class="text-caption font-weight-medium">
                        {{ $t('common.last_added') }}
                      </td>
                    </tr>
                    <tr
                      v-for="p in store.last_added_list"
                      :key="p.id"
                      class="bg-green-lighten-5 cursor-pointer"
                      @click="openDetails(p)"
                    >
                      <td>{{ p.practice_company?.name || p.company?.name || '—' }}</td>
                      <td>{{ p.job_title || '—' }}</td>
                      <td>{{ p.study_program?.name || '—' }}</td>
                      <td>{{ $t('semesters.' + p.semester) }}</td>
                      <td>{{ p.academic_year }}</td>
                      <td>{{ formatDate(p.start_date) }} – {{ formatDate(p.end_date) }}</td>
                      <td>
                        <StatusChip :backgroundColor="getStatusColor(p.status)">
                          {{ $t(getStatusText(p.status)) }}
                        </StatusChip>
                      </td>
                    </tr>
                  </tbody>
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
                        <StatusChip :backgroundColor="getStatusColor(p.status)">
                          {{ $t(getStatusText(p.status)) }}
                        </StatusChip>
                      </td>
                    </tr>
                  </tbody>
                </v-table>

                <v-pagination
                  v-if="store.total_pages > 1"
                  v-model="store.current_page"
                  :length="store.total_pages"
                  rounded="circle"
                  @update:modelValue="(page) => store.changePage(page, filters)"
                />
              </template>
            </v-card-text>
          </v-card>
          <StudentDetailsPraxeDialog
            v-model="detailsDialog"
            v-if="selectedPracticeId"
            :practice-id="selectedPracticeId"
          />
          <StudentAddPraxeForm ref="formDialog" />
        </v-container>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import Sidebar from '@/components/SideBar.vue'
import StudentAddPraxeForm from '@/components/StudentAddPraxeForm.vue'
import DetailsPraxeDialog from '@/components/DetailsPraxeDialog.vue'
import { usePracticesStore } from '@/stores/practicesStore.js'
import { useCompaniesStore } from '@/stores/companiesStore.js'
import { getStatusColor, getStatusText } from '@/utils/statusHelpers.js'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useLoadingStore } from '@/stores/loadingStore.js'
import Filters from '@/components/common/Filters.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import StatusChip from '@/components/common/StatusChip.vue'

export default {
  components: {
    Filters,
    Sidebar,
    StudentAddPraxeForm,
    StudentDetailsPraxeDialog: DetailsPraxeDialog,
    PrimaryButton,
    StatusChip,
  },

  data() {
    return {
      detailsDialog: false,
      selectedPracticeId: null,
      store: usePracticesStore(),
      programsStore: useStudyProgramsStore(),
      companiesStore: useCompaniesStore(),
      loadingStore: useLoadingStore(),
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
      return this.programsStore.list.map((p) => p.name)
    },
    role() {
      return this.authStore?.user?.roles?.[0]?.name
    },
  },

  async mounted() {
    await this.programsStore.fetchPrograms()
    this.onFiltersChange({ ...this.filters })
  },

  methods: {
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
    onFiltersChange(payload) {
      this.store.setPage(1)
      this.store.fetchPractices(payload)
    },
  },
}
</script>
