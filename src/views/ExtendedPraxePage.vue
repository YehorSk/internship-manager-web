<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar />

        <v-container fluid class="pa-4">
          <v-row class="align-center mb-4">
            <v-col cols="12">
              <h1 class="text-h5 mb-1">{{ $t('ExtendedPraxePage.title') }}</h1>
              <p class="text-subtitle-1">{{ $t('ExtendedPraxePage.subtitle') }}</p>
            </v-col>
          </v-row>

          <Filters v-model="filters" @change="onFiltersChange" />

          <v-card class="mb-6">
            <v-card-title class="text-h6 d-flex justify-space-between">
              <div>{{ $t('ExtendedPraxePage.table.title') }}</div>
              <span class="text-body-2 text-grey-darken-1">
                {{ $t('ExtendedPraxePage.table.total') }} {{ store.total_items }}
                {{ $t('ExtendedPraxePage.table.total2') }}
              </span>
            </v-card-title>

            <v-divider />

            <v-card-text>
              <template v-if="loadingStore.is('fetchPractices')">
                <div class="text-center py-10">{{ $t('common.loading') }}</div>
              </template>

              <template v-else-if="!store.list.length && !loadingStore.is('fetchPractices')">
                <div class="text-center py-12 text-grey-darken-1">
                  <v-icon size="64" color="#3A803D" class="mb-3">mdi-check-circle-outline</v-icon>
                  <p>{{ $t('ExtendedPraxePage.table.noData') }}</p>
                </div>
              </template>

              <template v-else>
                <v-table>
                  <thead>
                    <tr>
                      <th>{{ $t('ExtendedPraxePage.table.student') }}</th>
                      <th v-if="isSupervisor">{{ $t('ExtendedPraxePage.table.employer') }}</th>
                      <th>{{ $t('ExtendedPraxePage.table.position') }}</th>
                      <th>{{ $t('ExtendedPraxePage.table.studyProgram') }}</th>
                      <th>{{ $t('ExtendedPraxePage.table.semester') }}</th>
                      <th>{{ $t('ExtendedPraxePage.table.academicYear') }}</th>
                      <th>{{ $t('ExtendedPraxePage.table.period') }}</th>
                      <th>{{ $t('ExtendedPraxePage.table.status') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="p in store.list"
                      :key="p.id"
                      class="hover:bg-grey-lighten-5 cursor-pointer"
                      @click="openDetails(p)"
                    >
                      <td>{{ p.student?.first_name + ' ' + p.student?.last_name || '—' }}</td>
                      <td v-if="isSupervisor">
                        {{ p.practice_company?.name || p.company?.name || '—' }}
                      </td>
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
                  @update:modelValue="(page) => loadPractices(page)"
                />
              </template>
            </v-card-text>
          </v-card>
          <DetailsPraxeDialog
            v-model="detailsDialog"
            v-if="selectedPracticeId"
            :practice-id="selectedPracticeId"
            @update="updatePractice"
          />
        </v-container>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import Sidebar from '@/components/SideBar.vue'
import { usePracticesStore } from '@/stores/practicesStore.js'
import { getStatusColor, getStatusText } from '@/utils/statusHelpers.js'
import DetailsPraxeDialog from '@/components/DetailsPraxeDialog.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useLoadingStore } from '@/stores/loadingStore.js'
import Filters from '@/components/common/Filters.vue'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'

import StatusChip from '@/components/common/StatusChip.vue'

export default {
  components: { Filters, DetailsPraxeDialog, Sidebar, StatusChip },

  data() {
    return {
      detailsDialog: false,
      selectedPracticeId: null,
      store: usePracticesStore(),
      loadingStore: useLoadingStore(),
      authStore: useAuthStore(),
      programsStore: useStudyProgramsStore(),
      filters: {
        year: null,
        semester: null,
        status: null,
        employer: null,
        student: null,
        study_program: null,
      },
    }
  },

  computed: {
    role() {
      return this.authStore?.user?.roles?.[0]?.name
    },
    studyPrograms() {
      return this.programsStore.list.map((p) => p.name)
    },
    isSupervisor() {
      return this.role === 'supervisor'
    },
  },

  async mounted() {
    await this.programsStore.fetchPrograms()
    this.onFiltersChange({ ...this.filters })
  },

  methods: {
    loadPractices(page = 1) {
      this.store.setPage(page)
      this.store.fetchPractices({ ...this.filters })
    },
    formatDate(date) {
      if (!date) return '—'
      const d = new Date(date)
      return d.toISOString().split('T')[0]
    },
    openDetails(practice) {
      this.selectedPracticeId = practice.id
      this.detailsDialog = true
    },
    updatePractice(updated) {
      if (!updated) return
      const idx = this.store.list.findIndex((p) => p.id === updated.id)
      if (idx !== -1) this.store.list[idx] = { ...this.store.list[idx], ...updated }
    },
    getStatusColor,
    getStatusText,
    onFiltersChange(payload) {
      this.store.setPage(1)
      this.store.fetchPractices(payload)
    },
  },
}
</script>
