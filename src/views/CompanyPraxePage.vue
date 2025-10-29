<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar/>

        <v-container fluid class="pa-4">
          <v-row class="align-center mb-4">
            <v-col cols="8">
              <h1 class="text-h5 mb-1">Praxe študentov</h1>
              <p class="text-subtitle-1">Prehľad praxí vašich študentov</p>
            </v-col>
            <v-col cols="4"></v-col>
          </v-row>

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

              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="studentPick"
                  :items="students"
                  label="Študent"
                  density="comfortable"
                  variant="outlined"
                  clearable
                  @update:modelValue="val => (filters.search = val || '')"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-autocomplete
                  v-model="filters.year"
                  :items="years"
                  label="Rok"
                  density="comfortable"
                  variant="outlined"
                  clearable
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-select
                  v-model="filters.semester"
                  :items="semesterOptions"
                  label="Semester"
                  density="comfortable"
                  variant="outlined"
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
                  density="comfortable"
                  variant="outlined"
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
            <v-divider/>

            <v-card-text class="pa-0">
              <template v-if="store.loading">
                <div class="d-flex align-center justify-center py-10">
                  <v-progress-circular indeterminate/>
                </div>
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
                    <th>Pozícia</th>
                    <th>Študijný program</th>
                    <th>Semester</th>
                    <th>Akademický rok</th>
                    <th>Obdobie</th>
                    <th>Stav</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="p in store.list" :key="p.id">
                    <td>
                      {{
                        p.student?.name ||
                        (p.student_first_name && p.student_last_name
                          ? `${p.student_first_name} ${p.student_last_name}`
                          : '—')
                      }}
                    </td>
                    <td>{{ p.job_title || '—' }}</td>
                    <td>{{ p.study_program?.name || '—' }}</td>
                    <td>{{ p.semester === 'winter' ? 'Zimný' : 'Letný' }}</td>
                    <td>{{ p.academic_year || '—' }}</td>
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
                  @update:modelValue="(page) => store.changePage(page, filters)"
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
import { useAuthStore } from '@/stores/authStore.js'
import Sidebar from '@/components/Sidebar.vue'
import { useCompaniesPracticesStore } from '@/stores/compeniesPricticesStore.js'
import { storeToRefs } from 'pinia'

export default {
  name: 'CompanyPraxePage',
  components: { Sidebar },

  data () {
    return {
      authStore: useAuthStore(),
      store: useCompaniesPracticesStore(),
      studentPick: null,
      filters: {
        search: '',
        year: null,
        semester: null,
        status: null,
      },
    }
  },

  computed: {
    years () {
      const y = [...new Set(this.store.list.map(p => p.academic_year))]
        .filter(Boolean)
        .sort()
        .reverse()
      return y
    },
    students () {
      console.log(this.store.list)
      return [...new Set(
        this.store.list
          ?.map(
            p => p.student_id
          )
          .filter(Boolean)
      )].sort()
    },
    semesterOptions () {
      return ['Zimný', 'Letný']
    },
    statusOptions () {
      return [
        { label: 'Všetky', value: null },
        { label: 'Koncept', value: 'draft' },
        { label: 'Odoslané', value: 'submitted' },
        { label: 'Schválené', value: 'approved' },
        { label: 'Zamietnuté', value: 'rejected' },
        { label: 'Ukončené', value: 'finished' },
      ]
    },
  },

  watch: {
    filters: {
      deep: true,
      handler () {
        this.store.current_page = 1
        this.store.fetchCompanies(this.filters)
      }
    }
  },

  async mounted () {
    await this.store.fetchCompanies()
  },

  methods: {
    formatDate (date) {
      if (!date) return '—'
      const d = new Date(date)
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${dd}.${mm}.${d.getFullYear()}`
    },
    getStatusText (status) {
      switch (status) {
        case 'draft': return 'Koncept'
        case 'submitted': return 'Odoslané'
        case 'approved': return 'Schválené'
        case 'rejected': return 'Zamietnuté'
        case 'finished': return 'Ukončené'
        default: return '—'
      }
    },
    getStatusColor (status) {
      switch (status) {
        case 'draft': return '#9E9E9E'
        case 'submitted': return '#1976D2'
        case 'approved': return '#43A047'
        case 'rejected': return '#E53935'
        case 'finished': return '#6D4C41'
        default: return '#BDBDBD'
      }
    },
  }
}
</script>
