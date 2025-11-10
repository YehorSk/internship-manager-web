<template>
  <v-card outlined>
    <v-card-title>{{ $t('StudentProfileSettings.title') }}</v-card-title>
    <v-card-subtitle>{{ $t('StudentProfileSettings.subtitle') }}</v-card-subtitle>
    <v-card-text>
      <v-form ref="profileForm" v-model="valid" lazy-validation class="form-fix">
        <v-row>

          <template v-if="role === 'student'">
            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">{{ $t('StudentProfileSettings.form.firstName') }}</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.first_name"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-account"
                :rules="[rules.required]"
                :placeholder="$t('StudentProfileSettings.form.placeholders.firstName')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">{{ $t('StudentProfileSettings.form.lastName') }}</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.last_name"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-account"
                :rules="[rules.required]"
                :placeholder="$t('StudentProfileSettings.form.placeholders.lastName')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">{{ $t('StudentProfileSettings.form.address') }}</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.address"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-map-marker"
                :rules="[rules.required]"
                :placeholder="$t('StudentProfileSettings.form.placeholders.address')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">{{ $t('StudentProfileSettings.form.studentEmail') }}</span></v-label>
              <v-text-field
                v-model="form.student_email"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-email"
                readonly
                disabled
                color="grey"
                hide-details
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">{{ $t('StudentProfileSettings.form.primaryEmail') }}</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.primary_email"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-email"
                :rules="[rules.required, rules.email]"
                :placeholder="$t('StudentProfileSettings.form.placeholders.primaryEmail')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">{{ $t('StudentProfileSettings.form.phone') }}</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-text-field
                v-model="form.phone"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-phone"
                :rules="[rules.required, rules.phone]"
                :placeholder="$t('StudentProfileSettings.form.placeholders.phone')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="opacity-100"><span class="font-weight-bold">{{ $t('StudentProfileSettings.form.studyProgram') }}</span><span class="font-weight-bold text-red ml-2">*</span></v-label>
              <v-autocomplete
                v-model="form.study_program_id"
                :items="programsStore.list.map(p => ({ title: p.name, value: p.id }))"
                item-title="title"
                item-value="value"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                prepend-inner-icon="mdi-school"
                :loading="programsStore.loading"
                :rules="[rules.required]"
                :placeholder="$t('StudentProfileSettings.form.placeholders.studyProgram')"
              />
            </v-col>
          </template>

          <v-col cols="12" class="text-right">
            <v-btn
              rounded="lg"
              :disabled="!valid || !isChanged || profileStore.loading"
              :loading="profileStore.loading"
              prepend-icon="mdi-content-save"
              class="confirm-btn text-none"
              @click="saveProfile"
            >
              {{ $t('StudentProfileSettings.buttons.saveChanges') }}
            </v-btn>
          </v-col>

        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
import { useProfileStore } from '@/stores/profileStore.js'

export default {
  data() {
    return {
      authStore: useAuthStore(),
      programsStore: useStudyProgramsStore(),
      profileStore: useProfileStore(),
      valid: false,
      form: {},
      role: '',
      rules: {
        required: v => !!v || this.$t('StudentProfileSettings.form.requiredField'),
        email: v =>
          /^(?!.*\.\.)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v) ||
          this.$t('StudentProfileSettings.form.invalidEmail'),
        phone: v =>
          /^\+?\d{7,15}$/.test(v) ||
          this.$t('StudentProfileSettings.form.invalidPhone')
      }
    }
  },

  async created() {
    const user = this.authStore.user || {}
    this.role = user.roles?.[0]?.name || 'student'

    if (this.role === 'student') {
      const formData = {
        first_name: user.student?.first_name || '',
        last_name: user.student?.last_name || '',
        address: user.student?.address || '',
        primary_email: user.student?.primary_email || '',
        phone: user.student?.phone || '',
        student_email: user.student?.student_email || '',
        study_program_id: user.student?.study_program?.at(-1)?.id || null,
      }
      this.form = { ...formData }
      this.initialForm = { ...formData }
      await this.programsStore.fetchPrograms()
    }
  },
  computed: {
    isChanged() {
      return JSON.stringify(this.form) !== JSON.stringify(this.initialForm)
    },
  },

  methods: {
    async saveProfile() {
      const isValid = await this.$refs.profileForm.validate()
      if (!isValid) return
      const data = { ...this.form, study_program: this.form.study_program_id }
      await this.profileStore.updateProfile(data)
      this.initialForm = { ...this.form }
    }
  },
}
</script>

<style scoped>
.confirm-btn {
  background-color: #3A803D;
  color: white;
}
.confirm-btn:hover {
  background-color: #3A803D !important;
}
</style>


