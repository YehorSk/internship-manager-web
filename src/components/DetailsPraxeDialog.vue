<template>
  <v-dialog v-model="open" max-width="900" scrollable>
    <template v-if="practice">
      <v-card outlined>
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-btn icon variant="text" @click="close">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <span class="ml-3 text-h6">{{ practice.practice_company?.name || practice.company?.name || practice.student?.first_name + " " + practice.student?.first_name || '—' }}</span>
        </div>
        <div v-if="isSupervisor && practice" class="d-flex align-center ga-2">
          <v-select
            v-model="selectedStatus"
            :items="statusOptions"
            :item-title="(item) => $t(item.label)"
            item-value="value"
            :bg-color="getStatusColor(selectedStatus)"
            class="status-select-chip"
            density="compact"
            variant="solo-filled"
            rounded="lg"
            hide-details
          >
            <template #selection="{ item }">
              <span class="text-white font-weight-medium">{{ $t(item.raw.label) }}</span>
            </template>
          </v-select>
          <v-btn
            v-if="selectedStatus && selectedStatus !== practice.status"
            icon
            size="small"
            color="success"
            variant="flat"
            :loading="loadingStore.is('updatePracticeStatus')"
            @click="saveStatus"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </div>
        <StatusChip v-else-if="practice && practice.status" :backgroundColor="getStatusColor(practice.status)">
          {{  $t(getStatusText(practice.status)) }}
        </StatusChip>
      </v-card-title>

      <v-card-subtitle>{{ $t('DetailsPraxeDialog.subtitle') }}</v-card-subtitle>

        <v-card-text>
          <v-tabs v-model="tab" align-tabs="center" rounded="xl" class="mb-6">
            <v-tab value="info">{{ $t('DetailsPraxeDialog.tabs.info') }}</v-tab>
            <v-tab value="agreement">{{ $t('DetailsPraxeDialog.tabs.agreement') }}</v-tab>
            <v-tab value="report">{{ $t('DetailsPraxeDialog.tabs.report') }}</v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <v-window-item value="info">
              <v-form ref="internDetailsForm" v-model="valid">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-label>
                      <v-icon start color="grey-darken-2">mdi-school</v-icon>
                      <span class="font-weight-bold">{{ $t('DetailsPraxeDialog.fields.study_program') }}</span>
                    </v-label>
                    <v-autocomplete
                      :disabled="!isEditing || isLocked"
                      v-model="edited.study_program_id"
                      :items="programsStore.list.map(p => ({ title: p.name, value: p.id }))"
                      :loading="loadingStore.is('fetchPrograms')"
                      item-title="title"
                      item-value="value"
                      rounded="lg"
                      density="compact"
                      variant="solo-filled"
                      flat
                      single-line
                      :placeholder="$t('DetailsPraxeDialog.labels.choose_program')"
                    />
                  </v-col>
        <v-col cols="12" md="3">
          <v-label>
            <v-icon start color="grey-darken-2">mdi-calendar</v-icon>
            <span class="font-weight-bold">{{ $t('DetailsPraxeDialog.fields.semester') }}</span>
          </v-label>
          <v-select
            v-model="edited.semester"
            :disabled="!isEditing || isLocked"
            :items="[
              { title: $t('semesters.winter'), value: 'winter' },
              { title: $t('semesters.summer'), value: 'summer' }
            ]"
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
            <span class="font-weight-bold">{{ $t('DetailsPraxeDialog.fields.academic_year') }}</span>
          </v-label>
          <v-autocomplete
            v-model="edited.academic_year"
            :disabled="!isEditing || isLocked"
            :items="yearSuggestions"
            rounded="lg"
            density="compact"
            variant="solo-filled"
            flat
            single-line
            @focus="generateYearSuggestions('')"
            @update:search="generateYearSuggestions"
          />
        </v-col>
        <v-col cols="12" md="6">
          <TextField
            icon="mdi-briefcase-outline"
            :label="$t('DetailsPraxeDialog.fields.job_title')"
            :is-disabled="!isEditing || isLocked"
            v-model="edited.job_title"
            :placeholder="$t('DetailsPraxeDialog.labels.enter_job_title')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <TextField
            icon="mdi-account-tie"
            :label="$t('DetailsPraxeDialog.fields.supervisor')"
            :is-disabled="true"
            :model-value="practice.supervisor || practice.practice_company?.contact_name || '—'"
          />
        </v-col>
        <template v-if="practice.company_id === null">
          <v-col cols="12">
            <v-divider class="my-6" />
            <div class="d-flex align-center mb-3">
              <v-icon start color="grey-darken-2">mdi-office-building</v-icon>
              <h3 class="text-h6 ml-2 mb-0 font-weight-medium">{{ $t('DetailsPraxeDialog.fields.company_section') }}</h3>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <TextField
              :label="$t('common.ico')"
              :is-disabled="!isEditing || isLocked"
              :rules="[rules.required, rules.ico]"
              v-model="edited.ico"
              :placeholder="$t('common.enter_ico')"
            />
          </v-col>
        <v-col cols="12" md="6">
          <TextField
            :label="$t('DetailsPraxeDialog.fields.company_name')"
            :is-disabled="!isEditing || isLocked"
            v-model="edited.company_name"
            :placeholder="$t('DetailsPraxeDialog.labels.company_name')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <TextField
            :label="$t('DetailsPraxeDialog.fields.company_address')"
            :is-disabled="!isEditing || isLocked"
            v-model="edited.company_address"
            :placeholder="$t('DetailsPraxeDialog.labels.enter_address')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <TextField
            :label="$t('DetailsPraxeDialog.fields.company_email')"
            :is-disabled="!isEditing || isLocked"
            v-model="edited.company_email"
            type="email"
            :rules="[rules.required, rules.email]"
            :placeholder="$t('DetailsPraxeDialog.labels.enter_email')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <TextField
            :label="$t('DetailsPraxeDialog.fields.contact_phone')"
            :is-disabled="!isEditing || isLocked"
            v-model="edited.contact_phone"
            :placeholder="$t('DetailsPraxeDialog.labels.enter_phone')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <TextField
            :label="$t('DetailsPraxeDialog.fields.contact_name')"
            :is-disabled="!isEditing || isLocked"
            v-model="edited.contact_name"
            :placeholder="$t('DetailsPraxeDialog.labels.enter_contact_name')"
          />
        </v-col>
          <v-col cols="12" md="6">
            <TextField
              :label="$t('DetailsPraxeDialog.fields.contact_position')"
              :is-disabled="!isEditing || isLocked"
              v-model="edited.contact_position"
              :placeholder="$t('DetailsPraxeDialog.labels.enter_contact_position')"
            />
          </v-col>
        <v-col cols="12" md="6">
          <TextField
            :label="$t('DetailsPraxeDialog.fields.contact_email')"
            :is-disabled="!isEditing || isLocked"
            v-model="edited.contact_email"
            type="email"
            :rules="[rules.required, rules.email]"
            :placeholder="$t('DetailsPraxeDialog.labels.enter_contact_email')"
          />
        </v-col>
    </template>
        <v-col cols="12" md="6">
          <v-label>
            <v-icon start color="grey-darken-2">mdi-text</v-icon>
            <span class="font-weight-bold">{{ $t('DetailsPraxeDialog.fields.job_description') }}</span>
          </v-label>
          <v-textarea
            :disabled="!isEditing || isLocked"
            v-model="edited.job_description"
            rounded="lg"
            density="compact"
            variant="solo-filled"
            flat
            single-line
            rows="3"
            :placeholder="$t('DetailsPraxeDialog.labels.enter_description')"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-label><span class="font-weight-bold">{{ $t('StudentAddPraxeForm.form.is_paid_type_upper') }}</span></v-label>
          <v-checkbox
            :disabled="!isEditing || isLocked"
            :label="$t('StudentAddPraxeForm.form.is_paid_label')"
            v-model="edited.is_paid"
          />
        </v-col>
        <v-col cols="12" md="6">
          <TextField
            icon="mdi-calendar-start"
            :label="$t('DetailsPraxeDialog.fields.start_date')"
            :is-disabled="!isEditing || isLocked"
            v-model="edited.start_date"
            type="date"
          />
        </v-col>
        <v-col cols="12" md="6">
          <TextField
            icon="mdi-calendar-end"
            :label="$t('DetailsPraxeDialog.fields.end_date')"
            :is-disabled="!isEditing || isLocked"
            v-model="edited.end_date"
            type="date"
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
          {{ $t('DetailsPraxeDialog.alerts.locked') }}
        </v-alert>
        <div class="mt-8">
          <h3 class="text-h6 mb-4 d-flex align-center">
            <v-icon start color="#3A803D">mdi-history</v-icon>
            {{ $t('DetailsPraxeDialog.history.title') }}
          </h3>
          <v-timeline side="end" align="start" density="comfortable">
            <v-timeline-item
              v-for="(item, i) in statusHistory"
              :key="i"
              :dot-color="getStatusColor(item.status)"
              :icon="getStatusIcon(item.status)"
            >
              <div class="font-weight-medium">{{  $t(getStatusText(item.status)) }}</div>
              <div class="font-weight">{{ item.comment }}</div>
              <div class="text-grey-darken-1 text-body-2">{{ formatDateTime(item.created_at) }}</div>
            </v-timeline-item>
          </v-timeline>
        </div>
        </v-window-item>

        <v-window-item value="agreement" v-if="isStudent">
          <div class="pa-6">
            <div class="text-center mb-6">
              <v-icon size="36" color="#3A803D" class="mb-2">mdi-file-document-outline</v-icon>
              <h3 class="text-h6 font-weight-medium">{{ $t('DetailsPraxeDialog.agreement.title') }}</h3>
              <p class="text-body-2 text-grey-darken-1">
                {{ $t('DetailsPraxeDialog.agreement.desc') }}
              </p>
            </div>

            <v-card
              class="pa-4 mb-6"
              variant="tonal"
              color="grey-lighten-4"
              rounded="lg"
              elevation="0"
            >
              <div class="d-flex flex-column flex-md-row align-center justify-space-between ga-4">
                <div class="d-flex align-center ga-2">
                  <v-icon color="#3A803D" size="28">mdi-file-download-outline</v-icon>
                  <div>
                    <div class="font-weight-medium text-black">{{ $t('DetailsPraxeDialog.agreement.download_step') }}</div>
                    <div class="text-body-2 text-grey-darken-1">
                      {{ $t('DetailsPraxeDialog.agreement.download_desc') }}
                    </div>
                  </div>
                </div>

                <PrimaryButton
                  icon="mdi-download"
                  elevation="0"
                  @click="downloadAgreementTemplate"
                >
                  {{ $t('DetailsPraxeDialog.agreement.download_btn') }}
                </PrimaryButton>
              </div>
            </v-card>

            <v-card
              class="pa-4"
              variant="flat"
              style="background-color: #f9fafb;"
              rounded="lg"
              elevation="0"
            >
              <div class="d-flex flex-column flex-md-row align-center justify-space-between ga-4 mb-4">
                <div class="d-flex align-center ga-2">
                  <v-icon color="#3A803D" size="28">mdi-file-upload-outline</v-icon>
                  <div>
                    <div class="font-weight-medium">{{ $t('DetailsPraxeDialog.agreement.upload_step') }}</div>
                    <div class="text-body-2 text-grey-darken-1">
                      {{ $t('DetailsPraxeDialog.agreement.upload_desc') }}
                    </div>
                  </div>
                </div>
              </div>

              <v-form>
                <v-file-input
                  v-model="agreement.file"
                  :model-value="agreement.file || (hasUploadedAgreement ? { name: getFileName(uploadedAgreement.file_path) } : null)"
                  accept="application/pdf"
                  :label="$t('DetailsPraxeDialog.agreement.upload_label')"
                  prepend-icon="mdi-file-pdf-box"
                  rounded="lg"
                  variant="solo-filled"
                  flat
                  color="#3A803D"
                  :disabled="isAgreementLocked"
                  class="mb-6"
                />

                <div class="d-flex justify-end flex-wrap ga-2">
                  <PrimaryButton
                    v-if="canDeleteAgreementOrUploadAgreement"
                    icon="mdi-upload"
                    elevation="0"
                    :loading="loadingStore.is('uploadAgreement')"
                    @click="submitAgreement"
                  >
                    {{ $t('DetailsPraxeDialog.agreement.upload_btn') }}
                  </PrimaryButton>

                  <v-btn
                    v-if="hasUploadedAgreement"
                    variant="outlined"
                    color="#3A803D"
                    rounded="lg"
                    elevation="0"
                    @click="downloadUploadedAgreement"
                  >
                    <v-icon start>mdi-file-pdf-box</v-icon> {{ $t('DetailsPraxeDialog.agreement.uploaded_btn') }}
                  </v-btn>

                  <v-btn
                    v-if="canDeleteAgreementOrUploadAgreement && hasUploadedAgreement"
                    color="red"
                    class="text-white"
                    rounded="lg"
                    elevation="0"
                    @click="deleteAgreement"
                  >
                    <v-icon start>mdi-delete</v-icon> {{ $t('DetailsPraxeDialog.agreement.delete_btn') }}
                  </v-btn>
                </div>
              </v-form>

              <v-alert
                v-if="isAgreementLocked"
                type="info"
                border="start"
                icon="mdi-lock"
                class="mt-6"
                rounded="lg"
                elevation="1"
              >
                {{ $t('DetailsPraxeDialog.alerts.agreement_locked') }}
              </v-alert>
              <v-alert
                v-if="isStudent && lastRejectionComment('agreement')"
                type="error"
                border="start"
                icon="mdi-alert"
                class="mt-2"
                rounded="lg"
              >
                {{ lastRejectionComment('agreement') }}
              </v-alert>
            </v-card>
          </div>
        </v-window-item>

        <v-window-item value="agreement" v-if="isSupervisor || isCompany">
          <div class="pa-6">
            <div class="text-center mb-6">
              <v-icon size="36" color="#3A803D" class="mb-2">mdi-file-document-outline</v-icon>
              <h3 class="text-h6 font-weight-medium">{{ $t('DetailsPraxeDialog.agreement.title') }}</h3>
            </div>

            <v-card class="pa-4 mb-6" variant="tonal" color="grey-lighten-4" rounded="lg" elevation="0">
              <div class="d-flex flex-column flex-md-row align-center justify-space-between ga-4">
                <div class="d-flex align-center ga-2">
                  <v-icon color="#3A803D" size="28">mdi-file-pdf-box</v-icon>
                  <div>
                    <div class="font-weight-medium text-black">
                      {{ hasUploadedAgreement ? getFileName(uploadedAgreement.file_path) : $t('DetailsPraxeDialog.agreement.not_uploaded')  }}
                    </div>
                  </div>

                </div>
                <PrimaryButton
                  v-if="hasUploadedAgreement"
                  icon="mdi-download"
                  elevation="0"
                  @click="downloadUploadedAgreement"
                >
                  Stiahnuť
                </PrimaryButton>
              </div>
              <div class="mt-4 mb-6">
                <v-textarea
                  v-model="commentText"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  :placeholder="$t('DetailsPraxeDialog.agreement.comment_placeholder')"
                  rows="3"
                />
              </div>
            </v-card>
          </div>
        </v-window-item>

        <v-window-item value="report" v-if="isStudent">
          <div class="pa-6">
            <div class="text-center mb-6">
              <v-icon size="36" color="#3A803D" class="mb-2">mdi-file-document</v-icon>
              <h3 class="text-h6 font-weight-medium">{{ $t('DetailsPraxeDialog.report.title') }}</h3>
              <p class="text-body-2 text-grey-darken-1">
                {{ $t('DetailsPraxeDialog.report.desc') }}
              </p>
            </div>

            <v-card
              class="pa-4 mb-6"
              variant="tonal"
              color="grey-lighten-4"
              rounded="lg"
              elevation="0"
            >
              <div class="d-flex flex-column flex-md-row align-center justify-space-between ga-4">
                <div class="d-flex align-center ga-2">
                  <v-icon color="#3A803D" size="28">mdi-file-download-outline</v-icon>
                  <div>
                    <div class="font-weight-medium text-black" >{{ $t('DetailsPraxeDialog.report.download_step') }}</div>
                    <div class="text-body-2 text-grey-darken-1">
                      {{ $t('DetailsPraxeDialog.report.download_desc') }}
                    </div>
                  </div>
                </div>

                <PrimaryButton
                  icon="mdi-download"
                  elevation="0"
                  @click="downloadReportTemplate"
                >
                  {{ $t('DetailsPraxeDialog.report.download_btn') }}
                </PrimaryButton>
              </div>
            </v-card>

            <v-card
              class="pa-4"
              variant="flat"
              style="background-color: #f9fafb;"
              rounded="lg"
              elevation="0"
            >
              <div class="d-flex flex-column flex-md-row align-center justify-space-between ga-4 mb-4">
                <div class="d-flex align-center ga-2">
                  <v-icon color="#3A803D" size="28">mdi-file-upload-outline</v-icon>
                  <div>
                    <div class="font-weight-medium">{{ $t('DetailsPraxeDialog.report.upload_step') }}</div>
                    <div class="text-body-2 text-grey-darken-1">
                      {{ $t('DetailsPraxeDialog.report.upload_desc') }}
                    </div>
                  </div>
                </div>
              </div>

              <v-form>
                <v-file-input
                  v-model="report.file"
                  :model-value="report.file || (uploadedReport ? { name: getFileName(uploadedReport.file_path) } : null)"
                  accept="application/pdf"
                  :label="$t('DetailsPraxeDialog.report.upload_label')"
                  prepend-icon="mdi-file-pdf-box"
                  rounded="lg"
                  variant="solo-filled"
                  flat
                  color="#3A803D"
                  class="mb-6"
                  :disabled="isReportLocked"
                />

                <div class="d-flex justify-end flex-wrap ga-2">
                  <PrimaryButton
                    v-if="canDeleteReportOrUploadReport"
                    icon="mdi-upload"
                    elevation="0"
                    :loading="loadingStore.is('uploadReport')"
                    @click="submitReport"
                  >
                    {{ $t('DetailsPraxeDialog.report.upload_btn') }}
                  </PrimaryButton>

                  <v-btn
                    v-if="uploadedReport"
                    variant="outlined"
                    color="#3A803D"
                    rounded="lg"
                    elevation="0"
                    @click="downloadUploadedReport"
                  >
                    <v-icon start>mdi-file-pdf-box</v-icon> {{ $t('DetailsPraxeDialog.report.uploaded_btn') }}
                  </v-btn>

                  <v-btn
                    v-if="uploadedReport && canDeleteReportOrUploadReport"
                    color="red"
                    class="text-white"
                    rounded="lg"
                    elevation="0"
                    @click="deleteReport"
                  >
                    <v-icon start>mdi-delete</v-icon> {{ $t('DetailsPraxeDialog.report.delete_btn') }}
                  </v-btn>
                </div>
              </v-form>

              <v-alert
                v-if="isReportLocked"
                type="info"
                border="start"
                icon="mdi-lock"
                class="mt-6"
                rounded="lg"
                elevation="1"
              >
                {{ $t('DetailsPraxeDialog.alerts.report_locked') }}
              </v-alert>
              <v-alert
                v-if="isStudent && lastRejectionComment('report')"
                type="error"
                border="start"
                icon="mdi-alert"
                class="mt-2"
                rounded="lg"
              >
                {{ lastRejectionComment('report') }}
              </v-alert>
            </v-card>
          </div>
        </v-window-item>

        <v-window-item value="report" v-if="isSupervisor || isCompany">
          <div class="pa-6">
            <div class="text-center mb-6">
              <v-icon size="36" color="#3A803D" class="mb-2">mdi-file-document</v-icon>
              <h3 class="text-h6 font-weight-medium">{{ $t('DetailsPraxeDialog.report.title') }}</h3>
            </div>

            <v-card class="pa-4 mb-6" variant="tonal" color="grey-lighten-4" rounded="lg" elevation="0">
              <div class="d-flex flex-column flex-md-row align-center justify-space-between ga-4">
                <div class="d-flex align-center ga-2">
                  <v-icon color="#3A803D" size="28">mdi-file-pdf-box</v-icon>
                  <div>
                    <div class="font-weight-medium text-black">
                      {{ uploadedReport ? getFileName(uploadedReport.file_path) : $t('DetailsPraxeDialog.report.not_uploaded') }}
                    </div>
                  </div>
                </div>
                <v-btn
                  v-if="uploadedReport"
                  color="#3A803D"
                  class="text-white"
                  rounded="lg"
                  elevation="0"
                  prepend-icon="mdi-download"
                  @click="downloadUploadedReport"
                >
                  {{ $t('DetailsPraxeDialog.buttons.download') }}
                </v-btn>
              </div>
              <div class="mt-4 mb-6" >
                <v-textarea
                  v-model="commentText"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  :placeholder="$t('DetailsPraxeDialog.agreement.comment_placeholder')"
                  rows="3"
                />
              </div>
            </v-card>
          </div>
        </v-window-item>
        </v-window>
        </v-card-text>

        <v-card-actions class="d-flex justify-end pa-4">
          <template v-if="isEditing">
            <PrimaryButton :disabled="!valid" @click="save" :loading="loadingStore.is('updatePractice')" icon="mdi-content-save">
              {{ $t('common.saveChanges') }}
            </PrimaryButton>

            <SecondaryButton @click="cancel">
              {{ $t('common.cancel') }}
            </SecondaryButton>
          </template>

          <template v-else>
            <v-btn
              v-if="(isStudent && tab === 'info' && ['created'].includes(practice.status)) || (isSupervisor && tab === 'info')"
              variant="outlined"
              color="#3A803D"
              rounded="lg"
              @click="isEditing = true"
            >
              <v-icon start>mdi-pencil</v-icon> {{ $t('DetailsPraxeDialog.buttons.edit') }}
            </v-btn>

            <v-btn
              v-if="(tab === 'agreement' && canManageAgreement) || (tab ==='report' && canManageReport)"
              color="green"
              class="text-white"
              rounded="lg" elevation="0"
              @click="approveDocument(tab)">
              <v-icon start>mdi-check</v-icon> {{ $t('DetailsPraxeDialog.buttons.approve') }}
            </v-btn>

            <v-btn
              v-if="(tab === 'agreement' && canManageAgreement) || (tab ==='report' && canManageReport)"
              color="red"
              class="text-white"
              rounded="lg"
              elevation="0"
              @click="rejectDocument(tab)">
              <v-icon start>mdi-close</v-icon> {{ $t('DetailsPraxeDialog.buttons.reject') }}
            </v-btn>

            <v-btn
              v-if="isStudent && tab === 'agreement' && ['created', 'agreement_rejected_by_company', 'agreement_rejected_by_supervisor'].includes(practice.status)"
              class="text-white ml-2"
              rounded="lg"
              @click="submit"
              style="background-color: #3A803D;"
            >
              <v-icon start>mdi-check</v-icon> {{ $t('DetailsPraxeDialog.buttons.submit_agreement') }}
            </v-btn>

            <v-btn
              v-if="isStudent && tab === 'report' && ['agreement_confirmed_by_company', 'agreement_confirmed_by_supervisor', 'report_rejected_by_company', 'report_rejected_by_supervisor'].includes(practice.status)"
              class="text-white ml-2"
              rounded="lg"
              @click="submitR"
              style="background-color: #3A803D;"
            >
              <v-icon start>mdi-check</v-icon> {{ $t('DetailsPraxeDialog.buttons.submit_report') }}
            </v-btn>

            <v-btn
              v-if="
                  practice.status !== 'canceled' &&
                  ((practice.status === 'created' && isStudent))
                "
              color="red"
              class="text-white ml-2"
              rounded="lg"
              :loading="loadingStore.is('deletePractice')"
              @click="cancelPractice"
            >
              <v-icon start>mdi-cancel</v-icon> {{ $t('DetailsPraxeDialog.buttons.cancel_practice') }}
            </v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </template>

    <template v-if="loadingStore.is(`getPractice_${practiceId}`)">
      <v-card class="pa-8 text-center">
        <p class="mt-4">{{ $t('common.loading') }}</p>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import { useToast } from 'vue-toastification'

import { useStudyProgramsStore } from '@/stores/studyProgramsStore.js'
import { usePracticesStore } from '@/stores/practicesStore.js'
import { getStatusColor, getStatusIcon, getStatusText, statusOptions } from '@/utils/statusHelpers.js'
import { useAuthStore } from '@/stores/authStore.js'
import { generateAcademicYearSuggestions } from '@/utils/yearHelpers.js'
import { useLoadingStore } from '@/stores/loadingStore.js'
import TextField from '@/components/common/TextField.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import SecondaryButton from '@/components/common/SecondaryButton.vue'
import StatusChip from '@/components/common/StatusChip.vue'


export default {
  components: { TextField, PrimaryButton, SecondaryButton, StatusChip },
  props: {
    modelValue: { type: Boolean, default: false },
    practiceId: {
      type: [Number, null],
      default: null,
      required: false,
    },
  },
  emits: ['update:modelValue', 'update'],
  data() {
    return {
      open: this.modelValue,
      practice: null,
      edited: {},
      isEditing: false,
      tab: 'info',
      authStore: useAuthStore(),
      programsStore: useStudyProgramsStore(),
      practicesStore: usePracticesStore(),
      loadingStore: useLoadingStore(),
      toast: useToast(),
      statusHistory: [],
      yearSuggestions: [],
      report: { file: null},
      reportStatus: '',
      isEditingReport: false,
      agreement: { file: null },
      isEditingAgreement: false,
      commentText: '',
      valid: false,
      rules: {
        required: v => !!v || this.$t('common.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('common.email'),
        ico: v => /^\d{8}$/.test(v) || this.$t('CompanyProfileSettings.form.invalidIco'),
        phone: v => /^\+?\d{7,15}$/.test(v) || this.$t('StudentAddPraxeForm.form.invalidPhone')
      },
      selectedStatus: null,
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
        if (this.practice) {
          this.selectedStatus = this.practice.status
        }
      } else {
        this.tab = 'info'
      }
    }
  },
  computed: {
    role() {
      return this.authStore?.user?.roles?.[0]?.name
    },
    isStudent() {
      return this.role === 'student'
    },
    isSupervisor() {
      return this.role === 'supervisor'
    },
    isCompany() {
      return this.role === 'company'
    },
    isLocked() {
      if (!this.practice) return false
      if (this.role === 'supervisor' || this.role === 'company') return false
      const allowedStatuses = ['created', 'agreement_rejected_by_company', 'agreement_rejected_by_supervisor', 'agreement_confirmed_by_company', 'agreement_confirmed_by_supervisor', 'report_rejected_by_company', 'report_rejected_by_supervisor']
      return !allowedStatuses.includes(this.practice.status)
    },
    isReportLocked() {
      if (!this.practice) return true
      return !['agreement_confirmed_by_supervisor', 'agreement_confirmed_by_company', 'report_rejected_by_supervisor', 'report_rejected_by_company'].includes(this.practice.status)
    },
    canDeleteReportOrUploadReport() {
      return ['agreement_confirmed_by_supervisor', 'agreement_confirmed_by_company', 'report_rejected_by_supervisor', 'report_rejected_by_company'].includes(this.practice.status)
    },
    isAgreementLocked() {
      if (!this.practice) return false
      return ['canceled', 'agreement_confirmed_by_supervisor', 'agreement_confirmed_by_company', 'agreement_confirm_requested'].includes(this.practice.status)
    },
    canDeleteAgreementOrUploadAgreement() {
      return ['created', 'agreement_rejected_by_company', 'agreement_rejected_by_supervisor'].includes(this.practice.status)
    },
    hasUploadedAgreement() {
      return this.practice?.documents?.some(d => d.type === 'agreement')
    },
    canManageAgreement(){
      return (this.isSupervisor || this.isCompany) && ['agreement_confirm_requested'].includes(this.practice.status)
    },
    canManageReport(){
      return (this.isSupervisor || this.isCompany) && ['report_confirm_requested'].includes(this.practice.status)
    },
    uploadedAgreement() {
      return this.practice?.documents?.find(d => d.type === 'agreement') || null
    },
    uploadedReport() {
      return this.practice?.documents?.find(d => d.type === 'report') || null
    },
    statusOptions() {
      return statusOptions
    },
  },
  mounted() {
    if (!this.programsStore.list.length) this.programsStore.fetchPrograms()
    if (this.open) this.fetchPractice()
  },
  methods: {
    getStatusColor,
    getStatusIcon,
    getStatusText,
    async fetchPractice() {
      this.practice = null
      const data = await this.practicesStore.getPractice(this.practiceId)

      this.practice = data
      this.selectedStatus = data.status

      this.edited = {
        academic_year: data.academic_year,
        study_program_id: data.study_program?.id || null,
        semester: data.semester,
        start_date: this.formatDate(data.start_date),
        end_date: this.formatDate(data.end_date),
        company_id: this.practice.company_id,
        job_title: data.job_title,
        job_description: data.job_description,
        is_paid: data.is_paid === 1,
      }

      if (data.company_id === null && data.practice_company) {
        Object.assign(this.edited, {
          company_name: data.practice_company.name,
          company_address: data.practice_company.address,
          company_email: data.practice_company.company_email,
          contact_phone: data.practice_company.contact_phone,
          contact_email: data.practice_company.contact_email,
          contact_name: data.practice_company.contact_name,
          contact_position: data.practice_company.contact_position,
          ico: data.practice_company.ico,
        })
      }
      this.statusHistory = data.practice_status_history || []
    },

    close() {
      this.open = false
    },

    cancel() {
      this.edited = {
        academic_year: this.practice.academic_year,
        study_program_id: this.practice.study_program?.id || null,
        semester: this.practice.semester,
        start_date: this.formatDate(this.practice.start_date),
        end_date: this.formatDate(this.practice.end_date),
        job_title: this.practice.job_title,
        company_id: this.practice.company_id,
        job_description: this.practice.job_description,
        is_paid: this.practice.is_paid === 1,
        supervisor: this.practice.supervisor || this.practice.practice_company?.contact_name || '',
      }
      if (this.practice.company_id === null && this.practice.practice_company) {
        Object.assign(this.edited, {
          company_name: this.practice.practice_company.name,
          company_address: this.practice.practice_company.address,
          company_email: this.practice.practice_company.company_email,
          contact_phone: this.practice.practice_company.contact_phone,
          contact_email: this.practice.practice_company.contact_email,
          contact_name: this.practice.practice_company.contact_name,
          contact_position: this.practice.practice_company.contact_position,
          ico: this.practice.practice_company.ico,
        })
      }
      this.isEditing = false
    },
    async save() {
        const valid = await this.$refs.internDetailsForm.validate()
        if (!valid) return

        const updatedPractice = await this.practicesStore.updatePractice(this.practice.id, this.edited)

        if (updatedPractice) {
          this.practice = updatedPractice
          this.selectedStatus = updatedPractice.status
          this.statusHistory = updatedPractice.practice_status_history || []
        } else {
          const newProgram = this.programsStore.list.find(
            p => p.id === this.edited.study_program_id
          )

          this.practice = {
            ...this.practice,
            ...this.edited,
            semester: this.edited.semester,
            study_program: newProgram || this.practice.study_program,
            status: this.selectedStatus || this.practice.status,
          }
          this.selectedStatus = this.practice.status
          if (this.practice.company_id === null) {
            this.practice.practice_company = {
              ...this.practice.practice_company,
              name: this.edited.company_name,
              address: this.edited.company_address,
              company_email: this.edited.company_email,
              contact_phone: this.edited.contact_phone,
              contact_email: this.edited.contact_email,
              contact_name: this.edited.contact_name,
              contact_position: this.edited.contact_position,
              ico: this.edited.ico,
              is_paid: this.edited.is_paid ? 1 : 0,
            }
          }
        }

        this.$emit('update', this.practice)
      this.isEditing = false
    },

    formatDate(date) {
      if (!date) return null
      const d = new Date(date)
      if (isNaN(d)) return null
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
    async cancelPractice() {
      if (!confirm(this.$t('DetailsPraxeDialog.confirm.cancel_practice'))) return
        await this.practicesStore.deletePractice(this.practice.id)

        this.$emit('update', { id: this.practice.id, status: 'canceled' })
        if (this.practice) {
          this.practice.status = 'canceled'
        }

      this.open = false
    },
    async submitReport() {
      if (!this.report.file) {
        this.toast.error(this.$t('DetailsPraxeDialog.delete_report.missing_file'))
        return
      }
      await this.practicesStore.uploadReport(this.practice.id, this.report.file)
      await this.fetchPractice()
      this.report.file = null
    },
    async downloadReportTemplate() {
      await this.practicesStore.downloadReportTemplate(this.practice.id)
    },
    async downloadAgreementTemplate() {
      await this.practicesStore.downloadAgreementTemplate(this.practice.id)
    },
    async submitAgreement() {
      if (!this.agreement.file) {
        this.toast.error(this.$t('DetailsPraxeDialog.delete_report.missing_file'))
        return
      }
      await this.practicesStore.uploadAgreement(this.practice.id, this.agreement.file)
      await this.fetchPractice()
      this.agreement.file = null
    },

    async submit() {
      if (this.practice.status === 'created') {
        await this.practicesStore.requestAgreementApproval(this.practice.id)
        await this.fetchPractice()
        this.$emit('update', this.practice)
      }
    },
    async downloadUploadedAgreement() {
      if (!this.uploadedAgreement) return
        const { url } = await this.practicesStore.downloadUploadedDocument(
          this.practice.id,
          this.uploadedAgreement.file_path
        )
        window.open(url, '_blank')
    },
    async downloadUploadedReport() {
      if (!this.uploadedReport) return
        const { url } = await this.practicesStore.downloadUploadedDocument(
          this.practice.id,
          this.uploadedReport.file_path
        )
      window.open(url, '_blank')
    },

    getFileName(path) {
      if (!path) return ''
      return path.split('/').pop()
    },

    async submitR() {
        await this.practicesStore.requestReportApproval(this.practice.id)
      await this.fetchPractice()
      this.$emit('update', this.practice)
    },
    async deleteAgreement() {
      if (!this.uploadedAgreement) return
      if (!confirm(this.$t('DetailsPraxeDialog.confirm.delete_agreement'))) return
      await this.practicesStore.deleteUploadedDocument(this.practice.id, this.uploadedAgreement.file_path)
      await this.fetchPractice()
    },

    async deleteReport() {
      if (!this.uploadedReport) return
      if (!confirm(this.$t('DetailsPraxeDialog.confirm.delete_report'))) return
        await this.practicesStore.deleteUploadedDocument(this.practice.id, this.uploadedReport.file_path)
      await this.fetchPractice()
    },
    async approveDocument(documentType) {
      const comment = this.commentText
      await this.practicesStore.updateDocumentStatus(this.practice.id, documentType, 'agree', comment)
      await this.fetchPractice()
      this.commentText = ''
    },

    async rejectDocument(documentType) {
      const comment = this.commentText;
      await this.practicesStore.updateDocumentStatus(this.practice.id, documentType, 'reject', comment);
      await this.fetchPractice();
      this.commentText = '';
    },

    lastRejectionComment(type) {
      if (!this.practice || !this.practice.practice_status_history) return null
      const relevantStatuses = type === 'agreement'
        ? ['agreement_rejected_by_supervisor', 'agreement_rejected_by_company']
        : ['report_rejected_by_supervisor', 'report_rejected_by_company']

      const last = [...this.practice.practice_status_history].reverse()
        .find(s => relevantStatuses.includes(s.status) && s.comment)

      return last ? last.comment : null
    },
    generateYearSuggestions(query) {
      this.yearSuggestions = generateAcademicYearSuggestions(query, this.role)
    },
    async saveStatus() {
      if (!this.selectedStatus || !this.practice) return
      const updatedPractice = await this.practicesStore.updatePracticeStatus(this.practice.id, this.selectedStatus)
      if (updatedPractice) {
        this.practice = updatedPractice
        this.selectedStatus = updatedPractice.status
        this.statusHistory = updatedPractice.practice_status_history || []
        this.$emit('update', this.practice)
      }
    },
  }
}
</script>

<style scoped>
.status-select-chip {
  max-width: fit-content;
  width: auto;
}

.status-select-chip :deep(.v-field) {
  min-height: 28px !important;
  height: 28px !important;
  padding: 0 8px !important;
  display: flex !important;
  align-items: center !important;
}

.status-select-chip :deep(.v-field__input) {
  color: white !important;
  padding: 0 !important;
  min-height: auto !important;
  display: flex !important;
  align-items: center !important;
}

.status-select-chip :deep(.v-select__selection) {
  color: white !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
}

.status-select-chip :deep(.v-field__append-inner) {
  color: white !important;
  padding: 0 0 0 4px !important;
  width: 20px !important;
}

.status-select-chip :deep(.v-field__append-inner .v-icon) {
  font-size: 16px !important;
}
</style>

