<template>
  <v-dialog v-model="open" max-width="900" scrollable>
    <template v-if="practice">
      <v-card outlined>
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-btn icon variant="text" @click="close">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <span class="ml-3 text-h6">{{ practice.practice_company?.name || practice.company?.name || '—' }}</span>
        </div>
        <v-chip  :style="{ backgroundColor: getStatusColor(practice.status) }" class="text-white" >
          {{ getStatusText(practice.status) }}
        </v-chip>
      </v-card-title>

      <v-card-subtitle>Detailné informácie o praxi</v-card-subtitle>

      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="6">
              <v-label>
                <v-icon start color="grey-darken-2">mdi-school</v-icon>
                <span class="font-weight-bold">Študijný program</span>
              </v-label>
              <v-autocomplete
                v-if="isEditing && !isLocked"
                v-model="edited.study_program_id"
                :items="programsStore.list.map(p => ({ title: p.name, value: p.id }))"
                item-title="title"
                item-value="value"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                placeholder="Vyberte študijný program"
              />
              <v-text-field
                v-else
                :value="practice.study_program?.name || '—'"
                :disabled="true"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-label>
                <v-icon start color="grey-darken-2">mdi-calendar</v-icon>
                <span class="font-weight-bold">Semester</span>
              </v-label>
              <v-select
                v-if="isEditing && !isLocked"
                v-model="edited.semester"
                :items="['Zimný', 'Letný']"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
              <v-text-field
                v-else
                :value="practice.semester === 'winter' ? 'Zimný' : 'Letný'"
                :disabled="true"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-label>
                <v-icon start color="grey-darken-2">mdi-calendar-range</v-icon>
                <span class="font-weight-bold">Akademický rok</span>
              </v-label>
              <v-select
                v-if="isEditing && !isLocked"
                v-model="edited.academic_year"
                :items="academicYears"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
              <v-text-field
                v-else
                :value="practice.academic_year"
                :disabled="true"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label>
                <v-icon start color="grey-darken-2">mdi-briefcase-outline</v-icon>
                <span class="font-weight-bold">Názov pozície</span>
              </v-label>
              <v-text-field
                v-if="isEditing && !isLocked"
                v-model="edited.job_title"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                placeholder="Napr. Junior Developer"
              />
              <v-text-field
                v-else
                :value="practice.job_title || '—'"
                :disabled="true"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label>
                <v-icon start color="grey-darken-2">mdi-account-tie</v-icon>
                <span class="font-weight-bold">Vedúci praxe v organizácii</span>
              </v-label>
              <v-text-field
                :value="practice.supervisor || practice.practice_company?.contact_name || '—'"
                :disabled="true"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
            </v-col>


            <template v-if="practice.company_id === null">
              <v-col cols="12">
                <v-divider class="my-6" />
                <div class="d-flex align-center mb-3">
                  <v-icon start color="grey-darken-2">mdi-office-building</v-icon>
                  <h3 class="text-h6 ml-2 mb-0 font-weight-medium">Údaje o spoločnosti</h3>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <v-label><span class="font-weight-bold">Názov spoločnosti</span></v-label>
                <v-text-field
                  v-if="isEditing && !isLocked"
                  v-model="edited.company_name"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  placeholder="Zadajte názov spoločnosti"
                />
                <v-text-field
                  v-else
                  :value="practice.practice_company?.name || '—'"
                  :disabled="true"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-label><span class="font-weight-bold">Adresa</span></v-label>
                <v-text-field
                  v-if="isEditing && !isLocked"
                  v-model="edited.company_address"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  placeholder="Zadajte adresu spoločnosti"
                />
                <v-text-field
                  v-else
                  :value="practice.practice_company?.address || '—'"
                  :disabled="true"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-label><span class="font-weight-bold">Firemný e-mail</span></v-label>
                <v-text-field
                  v-if="isEditing && !isLocked"
                  v-model="edited.company_email"
                  type="email"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  placeholder="napr. info@firma.sk"
                />
                <v-text-field
                  v-else
                  :value="practice.practice_company?.company_email || '—'"
                  :disabled="true"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-label><span class="font-weight-bold">Telefón</span></v-label>
                <v-text-field
                  v-if="isEditing && !isLocked"
                  v-model="edited.contact_phone"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  placeholder="+421 900 000 000"
                />
                <v-text-field
                  v-else
                  :value="practice.practice_company?.contact_phone || '—'"
                  :disabled="true"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-label><span class="font-weight-bold">Kontaktná osoba</span></v-label>
                <v-text-field
                  v-if="isEditing && !isLocked"
                  v-model="edited.contact_name"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  placeholder="Meno kontaktnej osoby"
                />
                <v-text-field
                  v-else
                  :value="practice.practice_company?.contact_name || '—'"
                  :disabled="true"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-label><span class="font-weight-bold">E-mail kontaktnej osoby</span></v-label>
                <v-text-field
                  v-if="isEditing && !isLocked"
                  v-model="edited.contact_email"
                  type="email"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  placeholder="napr. jan@firma.sk"
                />
                <v-text-field
                  v-else
                  :value="practice.practice_company?.contact_email || '—'"
                  :disabled="true"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                />
              </v-col>
            </template>

            <v-col cols="12">
              <v-label>
                <v-icon start color="grey-darken-2">mdi-text</v-icon>
                <span class="font-weight-bold">Popis činností</span>
              </v-label>
              <v-textarea
                v-if="isEditing && !isLocked"
                v-model="edited.job_description"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                rows="3"
                placeholder="Stručný popis vykonávaných činností"
              />
              <v-textarea
                v-else
                :value="practice.job_description || '—'"
                :disabled="true"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
                rows="3"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label>
                <v-icon start color="grey-darken-2">mdi-calendar-start</v-icon>
                <span class="font-weight-bold">Dátum začiatku</span>
              </v-label>
              <v-text-field
                v-if="isEditing && !isLocked"
                v-model="edited.start_date"
                type="date"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
              <v-text-field
                v-else
                :value="formatDate(practice.start_date)"
                :disabled="true"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-label>
                <v-icon start color="grey-darken-2">mdi-calendar-end</v-icon>
                <span class="font-weight-bold">Dátum konca</span>
              </v-label>
              <v-text-field
                v-if="isEditing && !isLocked"
                v-model="edited.end_date"
                type="date"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
              <v-text-field
                v-else
                :value="formatDate(practice.end_date)"
                :disabled="true"
                rounded="lg"
                density="compact"
                variant="solo-filled"
                flat
                single-line
              />
            </v-col>
          </v-row>
        </v-form>

        <v-alert
          v-if="isLocked"
          type="info"
          border="start"
          class="mt-4"
          icon="mdi-lock"
        >
          Úpravy tejto praxe už nie sú povolené.
        </v-alert>

        <div class="mt-8">
          <h3 class="text-h6 mb-4 d-flex align-center">
            <v-icon start color="#3A803D">mdi-history</v-icon>
            História stavov praxe
          </h3>
          <v-timeline side="end" align="start" density="comfortable">
            <v-timeline-item
              v-for="(item, i) in statusHistory"
              :key="i"
              :dot-color="getStatusColor(item.status)"
              :icon="getStatusIcon(item.status)"
            >
              <div class="font-weight-medium">{{ getStatusText(item.status) }}</div>
              <div class="text-grey-darken-1 text-body-2">{{ formatDateTime(item.created_at) }}</div>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-card-text>

      <v-card-actions class="d-flex justify-end pa-4">
        <template v-if="!isLocked">
          <template v-if="isEditing">
            <v-btn color="#3A803D" class="text-white" rounded="lg" @click="save" style="background-color: #3A803D;">
              <v-icon start>mdi-content-save</v-icon> Uložiť zmeny
            </v-btn>

            <v-btn variant="tonal" color="grey" rounded="lg" class="ml-2" @click="cancel">
              Zrušiť
            </v-btn>
          </template>

          <template v-else>
            <v-btn
              variant="outlined"
              rounded="lg"
              color="#3A803D"
              class="mr-auto"
              prepend-icon="mdi-file-download"
              @click="downloadAgreement"
            >
              <span class="font-weight-medium">Stiahnuť vzor dohody</span>
            </v-btn>

            <v-btn variant="outlined" color="#3A803D" rounded="lg" @click="isEditing = true">
              <v-icon start>mdi-pencil</v-icon> Upraviť
            </v-btn>
            <v-btn
              v-if="practice.status === 'created'"
              class="text-white ml-2"
              rounded="lg"
              @click="submit"
              style="background-color: #3A803D;"
            >
              <v-icon start>mdi-check</v-icon> Odoslať na schválenie
            </v-btn>
            <v-btn
              v-if="practice.status === 'created'"
              color="red"
              class="text-white ml-2"
              rounded="lg"
              @click="cancelPractice"
            >
              <v-icon start>mdi-cancel</v-icon> Zrušiť prax
            </v-btn>
          </template>
        </template>
      </v-card-actions>
    </v-card>
    </template>

    <template v-if="loadingPractice">
      <v-card class="pa-8 text-center">
        <v-progress-circular indeterminate color="#3A803D" size="48" />
        <p class="mt-4">Načítavam detaily praxe...</p>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import { useToast } from 'vue-toastification'
import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
import { usePracticesStore } from '@/stores/practicesStore.js'

export default {
  props: {
    modelValue: { type: Boolean, default: false },
    practiceId: { type: Number, required: true },
  },
  emits: ['update:modelValue', 'update'],
  data() {
    return {
      open: this.modelValue,
      practice: null,
      edited: {},
      isEditing: false,
      programsStore: useStudyProgramsStore(),
      practicesStore: usePracticesStore(),
      toast: useToast(),
      statusHistory: [],
      loadingPractice: false,
    }
  },
  watch: {
    modelValue(v) {
      this.open = v
      if (v) this.fetchPractice()
    },
    open(v) {
      this.$emit('update:modelValue', v)
      if (!v) {
        this.isEditing = false
        this.edited = { ...this.practice }
      }
    }
  },
  computed: {
    isLocked() {
      if (!this.practice) return false
      return this.practice.status !== 'created'
    },
    academicYears() {
      const year = new Date().getFullYear()
      return Array.from({ length: 5 }, (_, i) => `${year + i}/${year + i + 1}`)
    },
  },
  mounted() {
    if (!this.programsStore.list.length) this.programsStore.fetchPrograms()
    if (this.open) this.fetchPractice()
  },
  methods: {
    async fetchPractice() {
      this.loadingPractice = true
      this.practice = null
      try {
        const data = await this.practicesStore.getPractice(this.practiceId)
        this.practice = data

        this.edited = {
          academic_year: data.academic_year,
          study_program_id: data.study_program?.id || null,
          semester: data.semester === 'winter' ? 'Zimný' : 'Letný',
          start_date: this.formatDate(data.start_date),
          end_date: this.formatDate(data.end_date),
          job_title: data.job_title,
          job_description: data.job_description,
        }

        if (data.company_id === null && data.practice_company) {
          Object.assign(this.edited, {
            company_name: data.practice_company.name,
            company_address: data.practice_company.address,
            company_email: data.practice_company.company_email,
            contact_phone: data.practice_company.contact_phone,
            contact_email: data.practice_company.contact_email,
            contact_name: data.practice_company.contact_name,
          })
        }

        this.statusHistory = data.practice_status_history || []
      } catch (e) {
        console.error(e)
        this.toast.error('Nepodarilo sa načítať detaily praxe.')
      } finally {
        this.loadingPractice = false
      }
    },

    close() { this.open = false },
    cancel() {
      this.edited = {
        academic_year: this.practice.academic_year,
        study_program_id: this.practice.study_program?.id || null,
        semester: this.practice.semester === 'winter' ? 'Zimný' : 'Letný',
        start_date: this.formatDate(this.practice.start_date),
        end_date: this.formatDate(this.practice.end_date),
        job_title: this.practice.job_title,
        job_description: this.practice.job_description,
        supervisor: this.practice.supervisor || this.practice.practice_company?.contact_name || '',
      }
      this.isEditing = false
    },

    async save() {
      try {
        const updated = {
          academic_year: this.edited.academic_year,
          semester:
            this.edited.semester === 'Zimný'
              ? 'winter'
              : this.edited.semester === 'Letný'
                ? 'summer'
                : this.edited.semester,
          study_program_id: this.edited.study_program_id || this.practice.study_program?.id,
          start_date: this.edited.start_date,
          end_date: this.edited.end_date,
          company_id: this.practice.company_id,
          job_title: this.edited.job_title,
          job_description: this.edited.job_description,
        }
        if (this.practice.company_id === null) {
          Object.assign(updated, {
            company_name: this.edited.company_name,
            company_address: this.edited.company_address,
            company_email: this.edited.company_email,
            contact_phone: this.edited.contact_phone,
            contact_email: this.edited.contact_email,
            contact_name: this.edited.contact_name,
          })
        }

        await this.practicesStore.updatePractice(this.practice.id, updated)

        const newProgram = this.programsStore.list.find(
          p => p.id === updated.study_program_id
        )

        this.practice = {
          ...this.practice,
          ...updated,
          semester: updated.semester,
          study_program: newProgram || this.practice.study_program,
        }
        if (this.practice.company_id === null) {
          this.practice.practice_company = {
            ...this.practice.practice_company,
            name: updated.company_name,
            address: updated.company_address,
            company_email: updated.company_email,
            contact_phone: updated.contact_phone,
            contact_email: updated.contact_email,
            contact_name: updated.contact_name,
          }
        }

        this.$emit('update', this.practice)
        this.isEditing = false
        this.toast.success('Prax bola úspešne aktualizovaná!')
      } catch (e) {
        console.error(e.response?.data || e)
        this.toast.error('Nepodarilo sa aktualizovať prax.')
      }
    },

    async submit() {
      // доробити
    },

    formatDate(date) {
      if (!date) return '—'
      const d = new Date(date)
      return d.toISOString().split('T')[0]
    },
    formatDateTime(date) {
      const d = new Date(date)
      return d.toLocaleString('sk-SK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
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
    getStatusIcon(status) {
      const icons = {
        created: 'mdi-file-plus',
        agreement_confirm_requested: 'mdi-send',
        agreement_confirmed_by_company: 'mdi-domain',
        agreement_confirmed_by_supervisor: 'mdi-school',
        agreement_rejected_by_company: 'mdi-close-circle',
        agreement_rejected_by_supervisor: 'mdi-close-circle',
        report_confirm_requested: 'mdi-file-send',
        report_confirmed_by_company: 'mdi-domain',
        report_confirmed_by_supervisor: 'mdi-school',
        report_rejected_by_company: 'mdi-close-circle',
        report_rejected_by_supervisor: 'mdi-close-circle',
        canceled: 'mdi-cancel',
      }
      return icons[status] || 'mdi-file'
    },
    getStatusText(status) {
      const map = {
        created: 'Vytvorená',
        agreement_confirm_requested: 'Žiadosť o potvrdenie dohody',
        agreement_confirmed_by_company: 'Dohoda potvrdená firmou',
        agreement_confirmed_by_supervisor: 'Dohoda potvrdená garantom',
        agreement_rejected_by_company: 'Dohoda zamietnutá firmou',
        agreement_rejected_by_supervisor: 'Dohoda zamietnutá garantом',
        report_confirm_requested: 'Žiadosť o potvrdenie správy',
        report_confirmed_by_company: 'Správa potvrdená firmou',
        report_confirmed_by_supervisor: 'Správa potvrденá garantом',
        report_rejected_by_company: 'Správa zamietnutá firmou',
        report_rejected_by_supervisor: 'Správa zamietnutá garantом',
        canceled: 'Zrušená',
      }
      return map[status] || 'Neznámy'
    },
    async downloadAgreement() {
      // доробити логіку
    },
    async cancelPractice() {
      if (!confirm('Naozaj chceš zrušiť túto prax?')) return
      try {
        await this.practicesStore.deletePractice(this.practice.id)
        this.toast.success('Prax bola úspešne zrušená.')

        this.$emit('update', { id: this.practice.id, status: 'canceled' })
        if (this.practice) this.practice.status = 'canceled'

        this.open = false
      } catch (e) {
        console.error(e)
        this.toast.error('Nepodarilo sa zrušiť prax.')
      }
    },

  },

}
</script>

