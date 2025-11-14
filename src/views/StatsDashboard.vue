<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <SideBar />
        <v-container fluid class="pa-8">
          <!-- Page Header -->
          <v-row class="mb-6">
            <v-col cols="12" class="text-center">
              <h1 class="text-h4 font-weight-bold mb-1 text-grey-darken-4">
                {{ $t('stats.statisticsDashboard') }}
              </h1>
              <p class="text-subtitle-1 text-grey-darken-1">
                {{ $t('stats.overview') }}
              </p>
            </v-col>
          </v-row>

          <!-- Loading -->
          <v-row v-if="store.loading" class="justify-center py-12">
            <v-progress-circular indeterminate color="#3A803D" size="48" />
          </v-row>

          <!-- Dashboard Content -->
          <template v-else>
            <!-- Summary Cards -->
            <v-row class="mb-6" no-gutters>
              <v-col v-for="(stat, index) in summaryStats" :key="index">
                <v-card
                  class="pa-4 ma-2 rounded-xl"
                  elevation="2"
                  :style="{ border: '1px solid #E0E0E0' }"
                >
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <p class="text-body-2 text-grey-darken-1 mb-1">{{ stat.title }}</p>
                      <h2 class="text-h4 font-weight-bold text-grey-darken-4">{{ stat.value }}</h2>
                    </div>
                    <v-avatar size="48">
                      <v-icon :color="stat.color">{{ stat.icon }}</v-icon>
                    </v-avatar>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mb-6">
              <v-col cols="12" md="6">
                <v-card class="rounded-xl" elevation="2" :style="{ border: '1px solid #E0E0E0' }">
                  <v-card-title class="d-flex align-center pa-4">
                    <v-icon color="#3A803D" class="mr-3">mdi-clock-outline</v-icon>
                    <span class="text-h6 font-weight-medium">{{
                      $t('stats.toConfirmPractice')
                    }}</span>
                    <v-spacer />
                  </v-card-title>
                  <v-divider />

                  <v-card-text class="pa-4">
                    <v-data-table
                      :headers="pendingHeaders"
                      :items="pendingPractices"
                      hide-default-footer
                      item-key="id"
                      class="elevation-0"
                      @click:row="openDetails"
                    >
                      <template v-slot:[`item.student`]="{ item }">
                        <div class="d-flex align-center">
                          <span>{{ item.student.first_name + ' ' + item.student.last_name }}</span>
                        </div>
                      </template>
                      <template v-slot:[`item.company`]="{ item }">
                        <div class="d-flex align-center">
                          <span>{{ item.company.name }}</span>
                        </div>
                      </template>
                      <template v-slot:[`item.jobTitle`]="{ item }">
                        <div class="d-flex align-center">
                          <span>{{ item.jobTitle }}</span>
                        </div>
                      </template>

                      <template v-slot:[`item.status`]="{ item }">
                        <v-chip
                          :style="{ backgroundColor: getStatusColor(item.status) }"
                          class="text-white"
                          size="small"
                        >
                          {{ $t(getStatusText(item.status)) }}
                        </v-chip>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card class="rounded-xl" elevation="2" :style="{ border: '1px solid #E0E0E0' }">
                  <v-card-title class="d-flex align-center pa-4">
                    <v-icon color="#3A803D" class="mr-3">mdi-chart-bar</v-icon>
                    <span class="text-h6 font-weight-medium">{{
                      $t('stats.practiceByStatus')
                    }}</span>
                  </v-card-title>

                  <v-divider />

                  <v-card-text class="pa-4">
                    <div v-for="(item, index) in statusBreakdown" :key="index" class="mb-4">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <div class="d-flex align-center">
                          <v-icon small :color="getStatusColor(item.status)" class="mr-1"
                            >mdi-circle</v-icon
                          >
                          <span class="text-body-2">{{ $t(getStatusText(item.status)) }}</span>
                        </div>
                        <span class="text-body-2 font-weight-bold">{{ item.count }}</span>
                      </div>
                      <v-progress-linear
                        :model-value="item.percentage"
                        color="#3A803D"
                        height="8"
                        rounded
                        class="mb-2"
                      ></v-progress-linear>
                      <div class="text-caption">{{ item.percentage }}%</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-container>
      </v-row>
      <DetailsPraxeDialog
        v-model="detailsDialog"
        v-if="selectedPracticeId"
        :practice-id="selectedPracticeId"
        @update="updatePractice"
      />
    </v-container>
  </v-main>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import { getStatusColor, getStatusText } from '@/utils/statusHelpers.js'
import { usePracticesStore } from '@/stores/practicesStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import DetailsPraxeDialog from '@/components/DetailsPraxeDialog.vue'

export default {
  components: { DetailsPraxeDialog, SideBar },
  data() {
    return {
      store: usePracticesStore(),
      authStore: useAuthStore(),
      detailsDialog: false,
      selectedPracticeId: null,
    }
  },
  async mounted() {
    await this.store.fetchStatistics()
  },
  computed: {
    role() {
      return this.authStore?.user?.roles?.[0]?.name
    },
    isSupervisor() {
      return this.role === 'supervisor'
    },
    summaryStats() {
      return [
        {
          title: this.$t('stats.totalPractice'),
          value: this.store.statistics.total,
          icon: 'mdi-counter',
          color: 'green darken-2',
        },
        {
          title: this.$t('stats.activePractice'),
          value: this.store.statistics.active,
          icon: 'mdi-check-circle-outline',
          color: 'green darken-2',
        },
        {
          title: this.$t('stats.finishedPractice'),
          value: this.store.statistics.finished,
          icon: 'mdi-check-all',
          color: 'purple darken-2',
        },
        {
          title: this.$t('stats.students'),
          value: this.store.statistics.students,
          icon: 'mdi-account-group-outline',
          color: 'blue darken-2',
        },
        {
          title: this.$t('stats.cancelledPractice'),
          value: this.store.statistics.cancelled,
          icon: 'mdi-cancel',
          color: 'red darken-2',
        },
      ]
    },
    pendingHeaders() {
      const headers = [
        { title: this.$t('stats.student'), key: 'student' },
        { title: this.$t('stats.company'), key: 'company' },
        { title: this.$t('stats.jobTitle'), key: 'jobTitle' },
        { title: this.$t('stats.status'), key: 'status' },
      ]
      return headers.filter((h) => !(!this.isSupervisor && h.key === 'company'))
    },
    pendingPractices() {
      if (!this.store?.statistics?.pending) return []
      console.log(this.store?.statistics?.pending)
      return this.store.statistics.pending.map((p) => ({
        id: p.id,
        jobTitle: p.job_title,
        student: p.student,
        company: p.practice_company,
        status: p.status,
      }))
    },
    statusBreakdown() {
      const stats = this.store.statistics.statistics || {}
      const total = this.store.statistics.total || 0
      return Object.keys(stats).map((key) => ({
        status: key,
        count: stats[key],
        percentage: ((stats[key] / total) * 100).toFixed(2),
      }))
    },
  },
  methods: {
    openDetails(e, { item }) {
      this.selectedPracticeId = item.id
      this.detailsDialog = true
    },
    updatePractice(updated) {
      if (!updated) return
      const idx = this.store.list.findIndex(p => p.id === updated.id)
      if (idx !== -1) this.store.list[idx] = { ...this.store.list[idx], ...updated }
    },
    getStatusColor,
    getStatusText,
  },
}
</script>
