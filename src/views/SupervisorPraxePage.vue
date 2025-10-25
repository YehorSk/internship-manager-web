<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar />

        <v-container fluid class="pa-4">
          <v-row class="align-center mb-4">
            <v-col cols="12">
              <h1 class="text-h5 mb-1">Prax študentov</h1>
              <p class="text-subtitle-1">Prehľad všetkých praxí študentov</p>
            </v-col>
          </v-row>

          <!-- Filters -->
          <v-card class="pa-6 mb-6">
            <v-row class="align-center mb-3">
              <v-icon color="grey-darken-1" start>mdi-filter-outline</v-icon>
              <span class="font-weight-medium text-grey-darken-2 text-subtitle-1">Filtre</span>
            </v-row>

            <v-row class="mt-2" dense>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.search"
                  placeholder="Hľadať..."
                  prepend-inner-icon="mdi-magnify"
                  density="comfortable"
                  variant="outlined"
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
                  :items="statusOptions"
                  item-title="label"
                  item-value="value"
                  label="Stav"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="filters.student"
                  :items="students"
                  label="Študent"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>
            </v-row>
          </v-card>

          <v-card class="mb-6">
            <v-card-title class="text-h6 d-flex justify-space-between">
              <div>Zoznam praxí</div>
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
                    <th>Študent</th>
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
                  >
                    <td>{{ p.student?.full_name || '—' }}</td>
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
                  @update:modelValue="page => fetchPractices(page)"
                />
              </template>
            </v-card-text>
          </v-card>
        </v-container>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import { usePracticesStore } from '@/stores/practicesStore.js'

export default {
  components: { Sidebar },

  data() {
    return {
      store: usePracticesStore(),
      filters: {
        search: '',
        year: null,
        semester: null,
        status: null,
        employer: null,
        student: null,
      },
    }
  },

  computed: {
    statusOptions() {
      const statuses = [
        'created',
        'agreement_confirm_requested',
        'agreement_confirmed_by_company',
        'agreement_confirmed_by_supervisor',
        'agreement_rejected_by_company',
        'agreement_rejected_by_supervisor',
        'report_confirm_requested',
        'report_confirmed_by_company',
        'report_confirmed_by_supervisor',
        'report_rejected_by_company',
        'report_rejected_by_supervisor',
        'canceled'
      ]
      return statuses.map(s => ({ value: s, label: this.getStatusText(s) }))
    },
    years() {
      return [...new Set(this.store.list.map(p => p.academic_year))].filter(Boolean).sort().reverse()
    },
    employers() {
      return [...new Set(
        this.store.list.map(p => p.practice_company?.name || p.company?.name).filter(Boolean)
      )].sort()
    },
    students() {
      return [...new Set(
        this.store.list.map(p => p.student?.full_name).filter(Boolean)
      )].sort()
    }

  },

  watch: {
    filters: {
      deep: true,
      handler() {
        this.store.current_page = 1
        this.fetchPractices()
      }
    }
  },

  async mounted() {
    await this.fetchPractices()
  },

  methods: {
    fetchPractices(page = 1) {
      const payload = { ...this.filters }
      if (!payload.student || payload.student.trim() === '') {
        delete payload.student
      } else {
        payload.student_name = payload.student
        delete payload.student
      }
      this.store.current_page = page
      this.store.fetchAllPractices(payload)
    },
    formatDate(date) {
      if (!date) return '—'
      const d = new Date(date)
      return d.toISOString().split('T')[0]
    },
    getStatusColor(status) {
      const map = {
        created: '#1976D2',
        agreement_confirm_requested: '#757575',
        agreement_confirmed_by_company: '#2E7D32',
        agreement_confirmed_by_supervisor: '#2E7D32',
        agreement_rejected_by_company: '#C62828',
        agreement_rejected_by_supervisor: '#C62828',
        report_confirm_requested: '#616161',
        report_confirmed_by_company: '#2E7D32',
        report_confirmed_by_supervisor: '#2E7D32',
        report_rejected_by_company: '#C62828',
        report_rejected_by_supervisor: '#C62828',
        canceled: '#000000',
      }
      return map[status] || '#1976D2'
    },
    getStatusText(status) {
      const map = {
        created: 'Vytvorená',
        agreement_confirm_requested: 'Žiadosť o potvrdenie dohody',
        agreement_confirmed_by_company: 'Dohoda potvrdená firmou',
        agreement_confirmed_by_supervisor: 'Dohoda potvrdená garantom',
        agreement_rejected_by_company: 'Dohoda zamietnutá firmou',
        agreement_rejected_by_supervisor: 'Dohoda zamietnutá garantom',
        report_confirm_requested: 'Žiadosť o potvrdenie správy',
        report_confirmed_by_company: 'Správa potvrdená firmou',
        report_confirmed_by_supervisor: 'Správa potvrdená garantom',
        report_rejected_by_company: 'Správa zamietnutá firmou',
        report_rejected_by_supervisor: 'Správa zamietnutá garantom',
        canceled: 'Zrušená'
      }
      return map[status] || 'Neznámy'
    },
  },
}
</script>
