<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar/>
        <v-container fluid class="pa-4">
          <v-row class="align-center justify-space-between mb-4">
            <v-col cols="auto">
              <h1 class="text-h5">{{ $t('ReportsHistoryPage.title') }}</h1>
              <p class="text-subtitle-1">{{ $t('ReportsHistoryPage.subtitle') }}</p>
            </v-col>
            <v-col cols="auto">
              <v-btn color="#3A803D" prepend-icon="mdi-file-export" @click="dialog = true">
                {{ $t('SupervisorDashboard.exportButton') }}
              </v-btn>
            </v-col>
          </v-row>

          <v-card class="mb-6">
            <v-card-title class="text-h6 d-flex justify-space-between">
              <div>{{ $t('ReportsHistoryPage.listTitle') }}</div>
              <span class="text-body-2 text-grey-darken-1">
                {{ $t('ReportsHistoryPage.total') }} {{ store.total_items }}
              </span>
            </v-card-title>
            <v-divider />

            <v-card-text>
              <template v-if="loadingStore.is('fetchReports')">
                <div class="text-center py-10">{{ $t('common.loading') }}</div>
              </template>

              <template v-else-if="!store.reports.length">
                <div class="text-center py-12 text-grey-darken-1">
                  <v-icon size="64" color="#3A803D" class="mb-3">mdi-file-document-outline</v-icon>
                  <p>{{ $t('ReportsHistoryPage.empty') }}</p>
                </div>
              </template>

              <template v-else>
                <v-table>
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>{{ $t('ReportsHistoryPage.type') }}</th>
                    <th>{{ $t('ReportsHistoryPage.status') }}</th>
                    <th>{{ $t('ReportsHistoryPage.message') }}</th>
                    <th>{{ $t('ReportsHistoryPage.started') }}</th>
                    <th>{{ $t('ReportsHistoryPage.ended') }}</th>
                    <th class="text-right">{{ $t('ReportsHistoryPage.actions') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="r in store.reports" :key="r.id">
                    <td>{{ r.id }}</td>
                    <td>{{ $t(`ExportDialog.reportTypes.${r.report_type}`) }}</td>
                    <td>
                      <v-chip
                        :style="{ backgroundColor: getReportStatusColor(r.status) }"
                        class="text-white"
                        size="small"
                      >
                        {{ $t(REPORT_STATUS_MAP[r.status]?.text || 'ReportStatus.unknown') }}
                      </v-chip>
                    </td>
                    <td class="truncate" style="max-width: 250px;">
                      {{ r.message || '-' }}
                    </td>
                    <td>{{ r.started_at || '-' }}</td>
                    <td>{{ r.ended_at || '-' }}</td>
                    <td class="text-right">
                      <v-btn
                        size="small"
                        color="#3A803D"
                        class="text-white"
                        prepend-icon="mdi-download"
                        :disabled="r.status !== 'success'"
                        @click="downloadReport(r.id)"
                      >
                        {{ $t('ReportsHistoryPage.download') }}
                      </v-btn>
                    </td>
                  </tr>
                  </tbody>
                </v-table>

                <v-pagination
                  v-model="currentPage"
                  :length="Math.ceil(store.total_items / 10)"
                  rounded="circle"
                  @update:modelValue="fetchPage"
                />
              </template>
            </v-card-text>
          </v-card>
          <ExportDialog :dialog="dialog" @close="dialog = false"/>

        </v-container>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import Sidebar from '@/components/SideBar.vue'
import { useReportsStore } from '@/stores/reportsStore.js'
import { REPORT_STATUS_MAP, getReportStatusColor } from '@/utils/statusHelpers.js'
import ExportDialog from '@/components/ExportDialog.vue'
import { useLoadingStore } from '@/stores/loadingStore.js'


export default {
  components: { Sidebar, ExportDialog },
  data() {
    return {
      store: useReportsStore(),
      loadingStore: useLoadingStore(),
      currentPage: 1,
      REPORT_STATUS_MAP,
      dialog: false,
    }
  },

  methods: {
    getReportStatusColor,
    async fetchPage() {
      await this.store.fetchReports({ page: this.currentPage })
    },

    async downloadReport(id) {
      await this.store.downloadReport(id)
    }
  },

  mounted() {
    this.fetchPage()
  },
}
</script>


