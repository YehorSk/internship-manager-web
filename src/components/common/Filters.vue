<template>
  <v-card class="pa-6 mb-6">
    <v-row class="align-center mb-3">
      <v-icon color="grey-darken-1" start>mdi-filter-outline</v-icon>
      <span class="font-weight-medium text-grey-darken-2 text-subtitle-1">
        {{ $t('Filters.title') }}
      </span>
    </v-row>

    <v-row class="mt-2" dense>
      <v-col cols="12" md="3">
        <v-autocomplete
          :model-value="modelValue.study_program"
          @update:modelValue="(v) => updateField('study_program', v)"
          :items="studyPrograms"
          :loading="loadingStore.is('fetchPrograms')"
          :label="$t('Filters.studyProgram')"
          variant="outlined"
          density="comfortable"
          clearable
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-autocomplete
          :model-value="modelValue.year"
          @update:modelValue="(v) => updateField('year', v)"
          :items="yearSuggestions"
          :label="$t('Filters.year')"
          variant="outlined"
          density="comfortable"
          clearable
          @focus="generateYearSuggestions('')"
          @update:search="generateYearSuggestions"
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-select
          :model-value="modelValue.semester"
          @update:modelValue="(v) => updateField('semester', v)"
          :items="semesterItems"
          :label="$t('Filters.semester')"
          variant="outlined"
          density="comfortable"
          clearable
        />
      </v-col>

      <v-col v-if="showEmployer && role !== 'company'" cols="12" md="3">
        <v-autocomplete
          :model-value="modelValue.employer"
          @update:modelValue="(v) => updateField('employer', v)"
          :items="companiesStore.companies"
          item-title="name"
          item-value="id"
          :label="$t('Filters.employer')"
          variant="outlined"
          density="comfortable"
          clearable
          :loading="loadingStore.is('searchCompanies')"
          @update:search="searchCompanies"
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-select
          :model-value="modelValue.status"
          @update:modelValue="(v) => updateField('status', v)"
          :items="statusOptions()"
          item-title="label"
          item-value="value"
          :label="$t('Filters.status')"
          variant="outlined"
          density="comfortable"
          clearable
        />
      </v-col>

      <v-col v-if="showStudent" cols="12" md="3">
        <v-autocomplete
          :model-value="modelValue.student"
          @update:modelValue="(v) => updateField('student', v)"
          :items="studentsStore.students"
          item-title="full_name"
          item-value="full_name"
          :label="$t('Filters.student')"
          variant="outlined"
          density="comfortable"
          clearable
          :loading="loadingStore.is('searchStudents')"
          @update:search="searchStudents"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
import { useCompaniesStore } from '@/stores/companiesStore.js'
import { useStudentsStore } from '@/stores/studentsStore.js'
import { useLoadingStore } from '@/stores/loadingStore.js'
import { generateAcademicYearSuggestions } from '@/utils/yearHelpers.js'
import { statusOptions } from '@/utils/statusHelpers.js'
import { debounce } from 'lodash'

export default {
  props: {
    modelValue: { type: Object, required: true },
    showStudent: { type: Boolean, default: true },
    showEmployer: { type: Boolean, default: true },
  },

  emits: ['update:modelValue', 'change'],

  data() {
    return {
      authStore: useAuthStore(),
      programsStore: useStudyProgramsStore(),
      companiesStore: useCompaniesStore(),
      studentsStore: useStudentsStore(),
      loadingStore: useLoadingStore(),
      yearSuggestions: [],
      changeTimer: null,
    }
  },

  computed: {
    role() {
      return this.authStore?.user?.roles?.[0]?.name
    },

    studyPrograms() {
      return this.programsStore.list.map((p) => p.name)
    },

    semesterItems() {
      return [
        { title: this.$t('semesters.winter'), value: 'winter' },
        { title: this.$t('semesters.summer'), value: 'summer' },
      ]
    },
  },

  created() {
    this.debouncedSearchCompanies = debounce((q) => {
      if (q?.trim()) this.companiesStore.searchCompanies(q)
    }, 500)

    this.debouncedSearchStudents = debounce((q) => {
      if (q?.trim()) this.studentsStore.searchStudents(q)
    }, 500)
  },

  methods: {
    statusOptions() {
      return statusOptions.map((s) => ({
        value: s.value,
        label: this.$t(s.label),
      }))
    },

    updateField(key, val) {
      const next = { ...this.modelValue, [key]: val }
      this.$emit('update:modelValue', next)
      this.emitPayload(next)
    },

    emitPayload(filters) {
      clearTimeout(this.changeTimer)
      this.changeTimer = setTimeout(() => {
        const payload = { ...filters }

        if (payload.employer) {
          const c = this.companiesStore.companies.find((x) => x.id === payload.employer)
          if (c) payload.company_name = c.name
        }
        delete payload.employer

        if (payload.student) payload.student_name = payload.student
        delete payload.student

        this.$emit('change', payload)
      }, 0)
    },

    generateYearSuggestions(q) {
      this.yearSuggestions = generateAcademicYearSuggestions(q, this.role)
    },

    searchCompanies(q) {
      this.debouncedSearchCompanies(q)
    },

    searchStudents(q) {
      this.debouncedSearchStudents(q)
    },
  },
}
</script>
