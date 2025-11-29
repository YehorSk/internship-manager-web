<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar />

        <v-container fluid class="pa-8">
          <v-row class="mb-6">
            <v-col cols="12" class="text-center">
              <h1 class="text-h4 font-weight-bold mb-1 text-grey-darken-4">{{ $t('StudentDashboard.title') }}</h1>
              <p class="text-subtitle-1 text-grey-darken-1">
                {{ $t('StudentDashboard.subtitle') }}
              </p>
            </v-col>
          </v-row>

          <v-row v-if="loadingStore.is('fetchPractices')" class="justify-center py-12">
            <v-progress-circular indeterminate color="#3A803D" size="48" />
          </v-row>

          <v-row v-else>
            <v-col
              v-for="practice in activePractices"
              :key="practice.id"
              cols="12"
              md="6"
              lg="4"
            >
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  class="pa-5 transition-all duration-300"
                  rounded="xl"
                  elevation="2"
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
                      {{ practice.practice_company?.name || practice.company?.name || $t('StudentDashboard.unknownCompany') }}
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

          <v-row v-if="!loadingStore.is('fetchPractices') && !activePractices.length">
            <v-col cols="12" class="text-center py-14">
              <v-icon size="72" color="#3A803D" class="mb-4">mdi-domain-off</v-icon>
              <h2 class="text-h5 font-weight-medium mb-2 text-grey-darken-4">{{ $t('StudentDashboard.noActiveTitle') }}</h2>
              <p class="text-body-2 text-grey-darken-1 mb-8">
                {{ $t('StudentDashboard.noActiveText') }}
              </p>
              <v-btn
                color="#3A803D"
                rounded="xl"
                elevation="0"
                size="large"
                prepend-icon="mdi-plus-circle-outline"
                @click="openCreatePractice"
              >
                {{ $t('StudentDashboard.addPractice') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-row>
    </v-container>

    <PracticeDialog
      v-model="showPracticeDialog"
      :practice-id="selectedPracticeId"
      @update="refreshPractices"
    />

    <StudentAddPraxeForm ref="formDialog" @update="refreshPractices" />
  </v-main>
</template>

<script>
import Sidebar from '@/components/SideBar.vue'
import DetailsPraxeDialog from '@/components/DetailsPraxeDialog.vue'
import StudentAddPraxeForm from '@/components/StudentAddPraxeForm.vue'
import { usePracticesStore } from '@/stores/practicesStore.js'
import { getStatusColor, getStatusText } from '@/utils/statusHelpers.js'
import { useLoadingStore } from '@/stores/loadingStore.js'

export default {
  components: { Sidebar, PracticeDialog: DetailsPraxeDialog, StudentAddPraxeForm },
  data() {
    return {
      showPracticeDialog: false,
      selectedPracticeId: null,
      store: usePracticesStore(),
      loadingStore: useLoadingStore(),
      allPractices: [],
    }
  },
  computed: {
    activePractices() {
      return this.allPractices.filter(
        p => !['canceled', 'report_confirmed_by_supervisor', 'report_confirmed_by_company'].includes(p.status)
      )
    },
  },
  async mounted() {
    await this.loadPractices()
  },
  methods: {
    async loadPractices() {
      this.store.current_page = 1
      await this.store.fetchPractices()

      const allPractices = [...this.store.list]
      const totalPages = this.store.total_pages

      for (let page = 2; page <= totalPages; page++) {
        await this.store.changePage(page)
        allPractices.push(...this.store.list)
      }

      this.allPractices = allPractices
    },
    openPractice(id) {
      this.selectedPracticeId = id
      this.showPracticeDialog = true
    },
    openCreatePractice() {
      this.$refs.formDialog.openDialog()
    },
    async refreshPractices() {
      await this.loadPractices()
    },
    formatDate(date) {
      if (!date) return '—'
      const d = new Date(date)
      return d.toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },
    getStatusColor,
    getStatusText,
  },
}
</script>
