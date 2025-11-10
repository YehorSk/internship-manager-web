<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar />

        <v-container fluid class="pa-4">
          <v-row class="align-center mb-4">
            <v-col cols="12">
              <h1 class="text-h5 mb-1">{{ $t('SupervisorStudentsPage.title') }}</h1>
              <p class="text-subtitle-1">{{ $t('SupervisorStudentsPage.subtitle') }}</p>
            </v-col>
          </v-row>

          <v-card class="pa-6 mb-6">
            <v-row class="align-center mb-3">
              <v-icon color="grey-darken-1" start>mdi-filter-outline</v-icon>
              <span class="font-weight-medium text-grey-darken-2 text-subtitle-1">{{ $t('SupervisorStudentsPage.filters') }}</span>
            </v-row>

            <v-row class="mt-2" dense>
              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="filters.study_program"
                  :items="studyPrograms"
                  :label="$t('SupervisorStudentsPage.studyProgram')"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="filters.student"
                  :items="store.students"
                  item-title="full_name"
                  item-value="full_name"
                  :label="$t('SupervisorStudentsPage.student')"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  :loading="store.loading"
                  @update:search="searchStudents"
                />
              </v-col>
            </v-row>
          </v-card>

          <v-card class="mb-6">
            <v-card-title class="text-h6 d-flex justify-space-between">
              <div>{{ $t('SupervisorStudentsPage.listTitle') }}</div>
              <span class="text-body-2 text-grey-darken-1">
                {{ $t('SupervisorStudentsPage.total') }} {{ store.total_items }} {{ $t('SupervisorStudentsPage.students') }}
              </span>
            </v-card-title>

            <v-divider />

            <v-card-text>
              <template v-if="store.loading">
                <div class="text-center py-10">{{ $t('common.loading') }}</div>
              </template>

              <template v-else-if="!store.students.length">
                <div class="text-center py-12 text-grey-darken-1">
                  <v-icon size="64" color="#3A803D" class="mb-3">mdi-account-off-outline</v-icon>
                  <p>{{ $t('SupervisorStudentsPage.noStudents') }}</p>
                </div>
              </template>

              <template v-else>
                <v-table>
                  <thead>
                  <tr>
                    <th>{{ $t('SupervisorStudentsPage.columns.firstName') }}</th>
                    <th>{{ $t('SupervisorStudentsPage.columns.lastName') }}</th>
                    <th>{{ $t('SupervisorStudentsPage.columns.email') }}</th>
                    <th>{{ $t('SupervisorStudentsPage.columns.studyProgram') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="s in store.students" :key="s.id" class="hover:bg-grey-lighten-5">
                    <td>{{ s.first_name }}</td>
                    <td>{{ s.last_name }}</td>
                    <td>{{ s.student_email }}</td>
                    <td>
                        <span v-if="s.study_program?.length">
                          {{ s.study_program.map(sp => studyProgramsMap[sp.id] || '—').join(', ') }}
                        </span>
                      <span v-else>—</span>
                    </td>
                  </tr>
                  </tbody>
                </v-table>

                <v-pagination
                  v-if="store.total_pages > 1"
                  v-model="store.current_page"
                  :length="store.total_pages"
                  rounded="circle"
                  @update:modelValue="(page) => loadStudents(page)"
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
import { useStudentsStore } from '@/stores/studentsStore.js'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'

export default {
  components: { Sidebar },

  data() {
    return {
      store: useStudentsStore(),
      programsStore: useStudyProgramsStore(),

      filters: {
        study_program: null,
        student: null,
      },
    }
  },

  computed: {
    studyPrograms() {
      return this.programsStore.list.map(p => p.name)
    },
    studyProgramsMap() {
      return this.programsStore.list.reduce((acc, program) => {
        acc[program.id] = program.name
        return acc
      }, {})
    },
  },

  watch: {
    filters: {
      deep: true,
      handler() {
        const payload = { ...this.filters }
        if (payload.student) payload.student_name = payload.student
        if (payload.study_program) payload.study_program_name = payload.study_program
        delete payload.student
        delete payload.study_program

        this.store.current_page = 1
        this.store.fetchStudents(payload)
      },
    },
  },

  async mounted() {
    await this.programsStore.fetchPrograms()
    await this.loadStudents()
    await this.searchStudents('')
  },

  methods: {
    async loadStudents(page = 1) {
      const payload = { ...this.filters }
      if (payload.student) payload.student_name = payload.student
      if (payload.study_program) payload.study_program_name = payload.study_program
      delete payload.student
      delete payload.study_program

      this.store.current_page = page
      await this.store.fetchStudents(payload)
    },

    async searchStudents(query) {
      if (query?.trim().length >= 1) {
        await this.store.searchStudents(query.trim())
      }
    },
  },
}
</script>
