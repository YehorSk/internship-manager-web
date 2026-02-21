<script>
import {useStudentsStore} from "@/stores/studentsStore.js";
import {useLoadingStore} from "@/stores/loadingStore.js";

export default {
  name: "StudentDetailsDialog",
  props: {
    modelValue: { type: Boolean, default: false},
    studentId: {
      type: [Number, null],
      default: null,
      required: true
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      store: useStudentsStore(),
      loadingStore: useLoadingStore(),
      student: null
    }
  },
  computed: {
    open: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal) this.fetchStudent()
    }
  },
  methods: {
    close() {
      this.open = false
    },
    async fetchStudent() {
      this.student = null
      this.student = await this.store.getStudent(this.studentId)
      console.log(this.student)
    }
  }
}
</script>

<template>
  <v-dialog v-model="open" max-width="700" scrollable>
    <template v-if="student">
      <v-card outlined>
        <v-card-title class="text-h5">
          <div class="d-flex align-center">
            <v-btn icon variant="text" @click="close">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <span class="ml-3 text-h6">{{ $t('StudentDetailsDialog.studentDetails') }}</span>
          </div>
        </v-card-title>
        <v-card-text  class="pt-4">
          <v-container fluid class="pa-0">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ $t('StudentDetailsDialog.firstName') }}</div>
                <div class="font-weight-medium mt-1">
                  {{ student.first_name }}
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ $t('StudentDetailsDialog.lastName') }}</div>
                <div class="font-weight-medium mt-1">
                  {{ student.last_name }}
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ $t('StudentDetailsDialog.studentEmail') }}</div>
                <div class="d-flex align-center ga-2 mt-1">
                  <v-icon size="16">mdi-email</v-icon>
                  <span class="font-weight-medium">
                  {{ student.student_email }}
                </span>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ $t('StudentDetailsDialog.primaryEmail') }}</div>
                <div class="d-flex align-center ga-2 mt-1">
                  <v-icon size="16">mdi-email</v-icon>
                  <span class="font-weight-medium">
                  {{ student.primary_email }}
                </span>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ $t('StudentDetailsDialog.phone') }}</div>
                <div class="d-flex align-center ga-2 mt-1">
                  <v-icon size="16">mdi-phone</v-icon>
                  <span class="font-weight-medium">
                  {{ student.phone }}
                </span>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">{{ $t('StudentDetailsDialog.address') }}</div>
                <div class="d-flex align-center ga-2 mt-1">
                  <v-icon size="16">mdi-map-marker</v-icon>
                  <span class="font-weight-medium">
                  {{ student.address }}
                </span>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <div class="mt-6">
            <div class="text-caption text-medium-emphasis d-flex align-center ga-2 mb-3">
              <v-icon size="16">mdi-school</v-icon>
              {{ $t('StudentDetailsDialog.studyProgram') }}
            </div>

            <div class="d-flex flex-column ga-2">
              <v-card
                v-for="(program, index) in student.study_program"
                :key="index"
                variant="outlined"
                class="pa-3"
                color="blue-lighten-5"
              >
                <div class="d-flex align-center ga-2">
                  <div class="rounded-circle bg-blue-darken-2" style="width:8px;height:8px;"></div>
                  <span class="font-weight-medium text-blue-darken-4">
                  {{ program.name }}
                </span>
                </div>
              </v-card>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </template>
    <template v-if="loadingStore.is(`getStudent_${studentId}`)">
      <v-card class="pa-8 text-center">
        <p class="mt-4">{{ $t('common.loading') }}</p>
      </v-card>
    </template>
  </v-dialog>
</template>
