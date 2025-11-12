<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <SideBar />
        <v-container fluid class="pa-8">
          <v-row class="mb-6">
            <v-col cols="12" class="text-center">
              <h1 class="text-h4 font-weight-bold mb-1 text-grey-darken-4">Rozhranie spoločnosti</h1>
              <p class="text-subtitle-1 text-grey-darken-1">
                Prehľad odborných praxí a štatistiky vašej spoločnosti
              </p>
            </v-col>
          </v-row>

          <v-row v-if="loading" class="justify-center py-12">
            <v-progress-circular indeterminate color="#3A803D" size="48" />
          </v-row>

          <template v-else>
            <v-row class="mb-6">
              <v-col cols="12" md="3">
                <v-card class="pa-4 rounded-xl" elevation="2" :style="{ border: '1px solid #E0E0E0' }">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <p class="text-body-2 text-grey-darken-1 mb-1">Celkovo praxí</p>
                      <h2 class="text-h4 font-weight-bold text-grey-darken-4">{{ statistics.totalPractices || 0 }}</h2>
                    </div>
                    <v-icon size="40" color="#3A803D">mdi-briefcase-outline</v-icon>
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card class="pa-4 rounded-xl" elevation="2" :style="{ border: '1px solid #E0E0E0' }">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <p class="text-body-2 text-grey-darken-1 mb-1">Aktívne praxe</p>
                      <h2 class="text-h4 font-weight-bold text-grey-darken-4">{{ statistics.activePractices || 0 }}</h2>
                    </div>
                    <v-icon size="40" color="#3A803D">mdi-check-circle-outline</v-icon>
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card class="pa-4 rounded-xl" elevation="2" :style="{ border: '1px solid #E0E0E0' }">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <p class="text-body-2 text-grey-darken-1 mb-1">Ukončené praxe</p>
                      <h2 class="text-h4 font-weight-bold text-grey-darken-4">{{ statistics.completedPractices || 0 }}</h2>
                    </div>
                    <v-icon size="40" color="#3A803D">mdi-check-all</v-icon>
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card class="pa-4 rounded-xl" elevation="2" :style="{ border: '1px solid #E0E0E0' }">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <p class="text-body-2 text-grey-darken-1 mb-1">Počet študentov</p>
                      <h2 class="text-h4 font-weight-bold text-grey-darken-4">{{ statistics.totalStudents || 0 }}</h2>
                    </div>
                    <v-icon size="40" color="#3A803D">mdi-account-group-outline</v-icon>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mb-6">
              <v-col cols="12">
                <v-card class="rounded-xl" elevation="2" :style="{ border: '1px solid #E0E0E0' }">
                  <v-card-title class="d-flex align-center pa-4">
                    <v-icon color="#3A803D" class="mr-3">mdi-clock-outline</v-icon>
                    <span class="text-h6 font-weight-medium">Praxí na potvrdenie</span>
                    <v-spacer />
                    <v-chip color="#3A803D" class="text-white">
                      {{ practicesAwaitingConfirmation.length }}
                    </v-chip>
                  </v-card-title>

                  <v-divider />

                  <v-card-text class="pa-4">
                    <template v-if="practicesAwaitingConfirmation.length === 0">
                      <div class="text-center py-8">
                        <v-icon size="64" color="#3A803D" class="mb-3">mdi-check-circle-outline</v-icon>
                        <p class="text-body-1 text-grey-darken-1">Žiadne praxe nečakajú na potvrdenie</p>
                      </div>
                    </template>

                    <template v-else>
                      <v-row>
                        <v-col
                          v-for="practice in practicesAwaitingConfirmation"
                          :key="practice.id"
                          cols="12"
                          md="6"
                          lg="4"
                        >
                          <v-hover v-slot="{ isHovering, props }">
                            <v-card
                              v-bind="props"
                              class="pa-4 transition-all duration-300"
                              rounded="lg"
                              elevation="1"
                              @click="openPractice(practice.id)"
                              :style="{
                                transform: isHovering ? 'translateY(-4px)' : 'translateY(0)',
                                boxShadow: isHovering ? '0 8px 24px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
                                border: '1px solid #E0E0E0',
                                cursor: 'pointer',
                                background: 'white'
                              }"
                            >
                              <div class="d-flex justify-space-between align-center mb-3">
                                <h3 class="text-h6 font-weight-medium text-grey-darken-4">
                                  {{ getStudentName(practice) }}
                                </h3>
                                <v-chip
                                  :style="{
                                    backgroundColor: getStatusColor(practice.status),
                                    color: 'white',
                                    fontWeight: '500'
                                  }"
                                  size="small"
                                  class="px-3"
                                >
                                  {{ $t(getStatusText(practice.status)) }}
                                </v-chip>
                              </div>

                              <v-divider class="my-3"></v-divider>

                              <div class="text-body-2 text-grey-darken-2 mb-2 d-flex align-center">
                                <v-icon size="18" color="#3A803D" class="mr-2">mdi-briefcase-outline</v-icon>
                                <span>{{ practice.job_title || '—' }}</span>
                              </div>

                              <div class="text-body-2 text-grey-darken-2 mb-2 d-flex align-center">
                                <v-icon size="18" color="#3A803D" class="mr-2">mdi-calendar-range</v-icon>
                                <span>{{ formatDate(practice.start_date) }} – {{ formatDate(practice.end_date) }}</span>
                              </div>

                              <div class="text-body-2 text-grey-darken-2 d-flex align-center">
                                <v-icon size="18" color="#3A803D" class="mr-2">mdi-school-outline</v-icon>
                                <span>{{ practice.study_program?.name || '—' }}</span>
                              </div>
                            </v-card>
                          </v-hover>
                        </v-col>
                      </v-row>
                    </template>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mb-6">
              <v-col cols="12" md="6">
                <v-card class="rounded-xl" elevation="2" :style="{ border: '1px solid #E0E0E0' }">
                  <v-card-title class="d-flex align-center pa-4">
                    <v-icon color="#3A803D" class="mr-3">mdi-chart-bar</v-icon>
                    <span class="text-h6 font-weight-medium">Praxí podľa stavu</span>
                  </v-card-title>

                  <v-divider />

                  <v-card-text class="pa-4">
                    <div v-for="(count, status) in statistics.practicesByStatus" :key="status" class="mb-4">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2 font-weight-medium text-grey-darken-2">
                          {{ $t(getStatusText(status)) }}
                        </span>
                        <span class="text-body-2 font-weight-bold text-grey-darken-4">{{ count }}</span>
                      </div>
                      <v-progress-linear
                        :model-value="statistics.totalPractices > 0 ? (count / statistics.totalPractices) * 100 : 0"
                        color="#3A803D"
                        height="8"
                        rounded
                        class="mb-2"
                      ></v-progress-linear>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card class="rounded-xl" elevation="2" :style="{ border: '1px solid #E0E0E0' }">
                  <v-card-title class="d-flex align-center pa-4">
                    <v-icon color="#3A803D" class="mr-3">mdi-chart-pie</v-icon>
                    <span class="text-h6 font-weight-medium">Prehľad praxí</span>
                  </v-card-title>

                  <v-divider />

                  <v-card-text class="pa-4">
                    <div class="d-flex align-center justify-space-between mb-4">
                      <div class="d-flex align-center">
                        <div
                          class="mr-3"
                          style="width: 20px; height: 20px; background-color: #3A803D; border-radius: 4px"
                        ></div>
                        <span class="text-body-1">Aktívne</span>
                      </div>
                      <span class="text-h6 font-weight-bold">{{ statistics.activePractices || 0 }}</span>
                    </div>

                    <div class="d-flex align-center justify-space-between mb-4">
                      <div class="d-flex align-center">
                        <div
                          class="mr-3"
                          style="width: 20px; height: 20px; background-color: #2E7D32; border-radius: 4px"
                        ></div>
                        <span class="text-body-1">Ukončené</span>
                      </div>
                      <span class="text-h6 font-weight-bold">{{ statistics.completedPractices || 0 }}</span>
                    </div>

                    <div class="d-flex align-center justify-space-between">
                      <div class="d-flex align-center">
                        <div
                          class="mr-3"
                          style="width: 20px; height: 20px; background-color: #757575; border-radius: 4px"
                        ></div>
                        <span class="text-body-1">Čakajúce na potvrdenie</span>
                      </div>
                      <span class="text-h6 font-weight-bold">{{ practicesAwaitingConfirmation.length }}</span>
                    </div>

                    <v-divider class="my-4" />

                    <div class="d-flex justify-center align-center" style="height: 150px">
                      <div class="text-center">
                        <div class="text-h3 font-weight-bold text-grey-darken-4 mb-1">
                          {{ statistics.totalStudents || 0 }}
                        </div>
                        <div class="text-body-1 text-grey-darken-2">Celkový počet študentov</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-card class="rounded-xl" elevation="2" :style="{ border: '1px solid #E0E0E0' }">
                  <v-card-title class="d-flex align-center pa-4">
                    <v-icon color="#3A803D" class="mr-3">mdi-format-list-bulleted</v-icon>
                    <span class="text-h6 font-weight-medium">Aktívne a ukončené praxe</span>
                  </v-card-title>

                  <v-divider />

                  <v-card-text class="pa-4">
                    <template v-if="activeAndCompletedPractices.length === 0">
                      <div class="text-center py-8">
                        <v-icon size="64" color="#3A803D" class="mb-3">mdi-domain-off</v-icon>
                        <p class="text-body-1 text-grey-darken-1">Žiadne aktívne alebo ukončené praxe</p>
                      </div>
                    </template>

                    <template v-else>
                      <v-row>
                        <v-col
                          v-for="practice in activeAndCompletedPractices"
                          :key="practice.id"
                          cols="12"
                          md="6"
                          lg="4"
                        >
                          <v-hover v-slot="{ isHovering, props }">
                            <v-card
                              v-bind="props"
                              class="pa-4 transition-all duration-300"
                              rounded="lg"
                              elevation="1"
                              @click="openPractice(practice.id)"
                              :style="{
                                transform: isHovering ? 'translateY(-4px)' : 'translateY(0)',
                                boxShadow: isHovering ? '0 8px 24px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
                                border: '1px solid #E0E0E0',
                                cursor: 'pointer',
                                background: 'white'
                              }"
                            >
                              <div class="d-flex justify-space-between align-center mb-3">
                                <h3 class="text-h6 font-weight-medium text-grey-darken-4">
                                  {{ getStudentName(practice) }}
                                </h3>
                                <v-chip
                                  :style="{
                                    backgroundColor: getStatusColor(practice.status),
                                    color: 'white',
                                    fontWeight: '500'
                                  }"
                                  size="small"
                                  class="px-3"
                                >
                                  {{ $t(getStatusText(practice.status)) }}
                                </v-chip>
                              </div>

                              <v-divider class="my-3"></v-divider>

                              <div class="text-body-2 text-grey-darken-2 mb-2 d-flex align-center">
                                <v-icon size="18" color="#3A803D" class="mr-2">mdi-briefcase-outline</v-icon>
                                <span>{{ practice.job_title || '—' }}</span>
                              </div>

                              <div class="text-body-2 text-grey-darken-2 mb-2 d-flex align-center">
                                <v-icon size="18" color="#3A803D" class="mr-2">mdi-calendar-range</v-icon>
                                <span>{{ formatDate(practice.start_date) }} – {{ formatDate(practice.end_date) }}</span>
                              </div>

                              <div class="text-body-2 text-grey-darken-2 d-flex align-center">
                                <v-icon size="18" color="#3A803D" class="mr-2">mdi-school-outline</v-icon>
                                <span>{{ practice.study_program?.name || '—' }}</span>
                              </div>
                            </v-card>
                          </v-hover>
                        </v-col>
                      </v-row>
                    </template>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-container>
      </v-row>
    </v-container>

    <PracticeDialog
      v-model="showPracticeDialog"
      :practice-id="selectedPracticeId"
      @update="refreshData"
    />

    <PracticeDialog
      v-model="showPracticeDialog"
      :practice-id="selectedPracticeId"
      @update="refreshData"
    />
  </v-main>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import DetailsPraxeDialog from '@/components/DetailsPraxeDialog.vue'
import { usePracticesStore } from '@/stores/practicesStore.js'
import { getStatusColor, getStatusText } from '@/utils/statusHelpers.js'
import { useToastStore } from '@/stores/toastStore.js'
import { handleError } from '@/utils/httpError.js'

export default {
  components: { SideBar, PracticeDialog: DetailsPraxeDialog },
  data() {
    return {
      showPracticeDialog: false,
      selectedPracticeId: null,
      loading: false,
      statistics: {
        totalPractices: 0,
        activePractices: 0,
        completedPractices: 0,
        totalStudents: 0,
        practicesByStatus: {},
      },
      allPractices: [],
    }
  },
  computed: {
    store() {
      return usePracticesStore()
    },
    practicesAwaitingConfirmation() {
      const apiStats = this.store.statistics
      if (apiStats && apiStats.pending && Array.isArray(apiStats.pending)) {
        return apiStats.pending
      }
      return this.allPractices.filter(
        p => ['agreement_confirm_requested', 'report_confirm_requested'].includes(p.status)
      )
    },
    activeAndCompletedPractices() {
      return this.allPractices.filter(
        p => !['agreement_confirm_requested', 'report_confirm_requested', 'canceled'].includes(p.status)
      )
    },
  },
  async mounted() {
    await this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
      this.loading = true
      const toast = useToastStore()

      try {
        await this.store.fetchStatistics()
        await this.loadPracticesFromList()
        this.adaptStatisticsFromAPI()
      } catch (e) {
        handleError(e, this, toast)
      } finally {
        this.loading = false
      }
    },

    async loadPracticesFromList() {
      const originalPerPage = this.store.per_page
      this.store.current_page = 1
      this.store.per_page = 100

      try {
        await this.store.fetchPractices()

        const allPractices = [...this.store.list]
        const totalPages = this.store.total_pages

        for (let page = 2; page <= totalPages; page++) {
          await this.store.changePage(page)
          allPractices.push(...this.store.list)
        }

        this.allPractices = allPractices.map((p) => {
          const practice = { ...p }
          if (practice.student && !practice.student.full_name) {
            practice.student = {
              ...practice.student,
              full_name: `${practice.student.first_name || ''} ${practice.student.last_name || ''}`.trim(),
            }
          }
          return practice
        })
      } finally {
        this.store.per_page = originalPerPage
      }
    },

    adaptStatisticsFromAPI() {
      const apiStats = this.store.statistics
      if (!apiStats) {
        return
      }

      const practicesByStatus = {}
      if (apiStats.statistics) {
        if (apiStats.statistics.created !== undefined && apiStats.statistics.created > 0) {
          practicesByStatus.created = apiStats.statistics.created
        }
        if (apiStats.statistics.agreement_confirm_requested !== undefined && apiStats.statistics.agreement_confirm_requested > 0) {
          practicesByStatus.agreement_confirm_requested = apiStats.statistics.agreement_confirm_requested
        }
        if (apiStats.statistics.canceled !== undefined && apiStats.statistics.canceled > 0) {
          practicesByStatus.canceled = apiStats.statistics.canceled
        }
      }

      const totalPractices = (apiStats.active || 0) + (apiStats.finished || 0) + (apiStats.cancelled || 0)

      this.statistics = {
        totalPractices: totalPractices,
        activePractices: apiStats.active || 0,
        completedPractices: apiStats.finished || 0,
        totalStudents: apiStats.students || 0,
        practicesByStatus: practicesByStatus,
      }

      if (apiStats.pending && Array.isArray(apiStats.pending)) {
        const pendingIds = new Set(apiStats.pending.map(p => p.id))
        this.allPractices = this.allPractices.filter(p => !pendingIds.has(p.id))
        this.allPractices.push(...apiStats.pending.map(p => {
          const practice = { ...p }
          if (p.student_id && !practice.student) {
            practice.student = { id: p.student_id }
          }
          return practice
        }))
      }
    },

    openPractice(id) {
      this.selectedPracticeId = id
      this.showPracticeDialog = true
    },

    async refreshData() {
      await this.loadDashboardData()
    },

    formatDate(date) {
      if (!date) return '—'
      const d = new Date(date)
      return d.toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },

    getStudentName(practice) {
      if (practice.student?.full_name) {
        return practice.student.full_name
      }
      if (practice.student?.first_name || practice.student?.last_name) {
        return `${practice.student.first_name || ''} ${practice.student.last_name || ''}`.trim()
      }
      return 'Neznámy študent'
    },

    getStatusColor,
    getStatusText,
  },
}
</script>
