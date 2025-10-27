<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar/>

        <v-container fluid class="pa-4">
          <v-row class="align-center mb-4">
            <v-col cols="8">
              <h1 class="text-h5 mb-1">Moje praxe</h1>
              <p class="text-subtitle-1">Prehľad všetkých vašich praxí</p>
            </v-col>
            <v-col cols="4" class="d-flex justify-end">
              <v-btn
                color="#3A803D"
                class="text-white"
                @click="openForm"
              >
                <v-icon start>mdi-plus</v-icon>
                <span v-if="!$vuetify.display.smAndDown">Pridať prax</span>
              </v-btn>
            </v-col>
          </v-row>

          <v-card class="pa-6 mb-6">
            <v-row class="align-center mb-3">
              <v-icon color="grey-darken-1" start>mdi-filter-outline</v-icon>
              <span class="font-weight-medium text-grey-darken-2 text-subtitle-1">Filtre</span>
            </v-row>

            <v-row class="mt-2" dense>
              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="filters.study_program"
                  :items="studyPrograms"
                  label="Študijný program"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-autocomplete
                  v-model="filters.year"
                  :items="years"
                  label="Rok"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-select
                  v-model="filters.semester"
                  :items="['Zimný', 'Letný']"
                  item-title="label"
                  item-value="value"
                  label="Semester"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="filters.employer"
                  :items="employers"
                  label="Zamestnávateľ"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-select
                  v-model="filters.status"
                  :items="statusOptions()"
                  item-title="label"
                  item-value="value"
                  label="Stav"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>
            </v-row>
          </v-card>

          <v-card class="mb-6">
            <v-card-title class="text-h6 d-flex justify-space-between">
              <div>Zoznam mojich praxí</div>
              <span class="text-body-2 text-grey-darken-1">
                 Celkovo {{ store.total_items }} praxí
              </span>
            </v-card-title>

            <v-divider />

            <v-card-text>
              <template v-if="store.loading">
                <div class="text-center py-10">Načítavam...</div>
              </template>

              <template v-else-if="!store.list.length">
                <div class="text-center py-12 text-grey-darken-1">
                  <v-icon size="64" color="#3A803D" class="mb-3">mdi-check-circle-outline</v-icon>
                  <p>Žiadne praxe</p>
                </div>
              </template>

              <template v-else>
                <v-table>
                  <thead>
                  <tr>
                    <th>Zamestnávateľ</th>
                    <th>Pozícia</th>
                    <th>Študijný program</th>
                    <th>Semester</th>
                    <th>Akademický rok</th>
                    <th>Obdobie</th>
                    <th>Stav</th>
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
                    <td>{{ p.semester === 'winter' ? 'Zimný' : 'Letný' }}</td>
                    <td>{{ p.academic_year }}</td>
                    <td>{{ formatDate(p.start_date) }} – {{ formatDate(p.end_date) }}</td>
                    <td>
                      <v-chip :style="{ backgroundColor: getStatusColor(p.status) }" class="text-white" size="small">
                        {{ getStatusText(p.status) }}
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
import StudentDetailsPraxeDialog from '@/components/StudentDetailsPraxeDialog.vue'
import { usePracticesStore } from '@/stores/practicesStore.js'
import { getStatusColor, getStatusText, statusOptions } from '@/utils/statusHelpers.js'

export default {
  components: { Sidebar, StudentAddPraxeForm, StudentDetailsPraxeDialog },

  data() {
    return {
      detailsDialog: false,
      selectedPracticeId: null,
      store: usePracticesStore(),
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
    years() {
      return [...new Set(this.store.list.map(p => p.academic_year))].filter(Boolean).sort().reverse()
    },
    employers() {
      return [...new Set(
        this.store.list
          .map(p => p.practice_company?.name || p.company?.name)
          .filter(Boolean)
      )].sort()
    },
    studyPrograms() {
      return [...new Set(
        this.store.list
          .map(p => p.study_program?.name)
          .filter(Boolean)
      )].sort()
    }
  },

  watch: {
    filters: {
      deep: true,
      handler() {
        const filters = { ...this.filters }
        if (filters.employer) {
          filters.company_name = filters.employer
        }
        delete filters.employer
        this.store.current_page = 1
        this.store.fetchPractices(filters)
      }
    }
  },

  async mounted() {
    await this.store.fetchPractices()
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
    }

  }
}
</script>
