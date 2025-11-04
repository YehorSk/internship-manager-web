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
        <v-chip  :style="{ backgroundColor: getStatusColor(practice.status) }" class="text-white" >
          {{ getStatusText(practice.status) }}
        </v-chip>
      </v-card-title>

      <v-card-subtitle>Detailné informácie o praxi</v-card-subtitle>

        <v-card-text>
          <v-tabs v-model="tab" align-tabs="center" rounded="xl" class="mb-6">
            <v-tab value="info">Základné údaje</v-tab>
            <v-tab value="agreement">Dohoda</v-tab>
            <v-tab value="report">Správa</v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <v-window-item value="info">
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
              <h3 class="text-h6 font-weight-medium">Dohoda o vykonaní praxe</h3>
              <p class="text-body-2 text-grey-darken-1">
                Stiahni vzor dohody, vyplň ho a následne nahraj podpísaný dokument
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
                    <div class="font-weight-medium text-black">Krok 1 – Stiahni vzor dohody</div>
                    <div class="text-body-2 text-grey-darken-1">
                      Stiahni si prázdny PDF dokument dohody, ktorý treba podpísať.
                    </div>
                  </div>
                </div>

                <v-btn
                  color="#3A803D"
                  class="text-white"
                  rounded="lg"
                  elevation="0"
                  prepend-icon="mdi-download"
                  @click="downloadAgreementTemplate"
                >
                  Stiahnuť vzor
                </v-btn>
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
                    <div class="font-weight-medium">Krok 2 – Nahraj podpísanú dohodu</div>
                    <div class="text-body-2 text-grey-darken-1">
                      Vyber podpísaný PDF dokument a odošli ho na schválenie.
                    </div>
                  </div>
                </div>
              </div>

              <v-form>
                <v-file-input
                  v-model="agreement.file"
                  :model-value="agreement.file || (hasUploadedAgreement ? { name: getFileName(uploadedAgreement.file_path) } : null)"
                  accept="application/pdf"
                  label="Vyber podpísaný PDF dokument"
                  prepend-icon="mdi-file-pdf-box"
                  rounded="lg"
                  variant="solo-filled"
                  flat
                  color="#3A803D"
                  :disabled="isAgreementLocked"
                  class="mb-6"
                />

                <div class="d-flex justify-end flex-wrap ga-2">
                  <v-btn
                    v-if="canDeleteAgreementOrUploadAgreement"
                    color="#3A803D"
                    class="text-white"
                    rounded="lg"
                    elevation="0"
                    @click="submitAgreement"
                  >
                    <v-icon start>mdi-upload</v-icon> Nahrať dohodu
                  </v-btn>

                  <v-btn
                    v-if="hasUploadedAgreement"
                    variant="outlined"
                    color="#3A803D"
                    rounded="lg"
                    elevation="0"
                    @click="downloadUploadedAgreement"
                  >
                    <v-icon start>mdi-file-pdf-box</v-icon> Stiahnuť nahratú dohodu
                  </v-btn>

                  <v-btn
                    v-if="canDeleteAgreementOrUploadAgreement && hasUploadedAgreement"
                    color="red"
                    class="text-white"
                    rounded="lg"
                    elevation="0"
                    @click="deleteAgreement"
                  >
                    <v-icon start>mdi-delete</v-icon> Odstrániť
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
                Úpravy alebo nahrávanie dohody už nie sú povolené
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
              <h3 class="text-h6 font-weight-medium">Dohoda o vykonaní praxe</h3>
            </div>

            <v-card class="pa-4 mb-6" variant="tonal" color="grey-lighten-4" rounded="lg" elevation="0">
              <div class="d-flex flex-column flex-md-row align-center justify-space-between ga-4">
                <div class="d-flex align-center ga-2">
                  <v-icon color="#3A803D" size="28">mdi-file-pdf-box</v-icon>
                  <div>
                    <div class="font-weight-medium text-black">
                      {{ hasUploadedAgreement ? getFileName(uploadedAgreement.file_path) : 'Dohoda nebola zatial nahratá' }}
                    </div>
                  </div>

                </div>
                <v-btn
                  v-if="hasUploadedAgreement"
                  color="#3A803D"
                  class="text-white"
                  rounded="lg"
                  elevation="0"
                  prepend-icon="mdi-download"
                  @click="downloadUploadedAgreement"
                >
                  Stiahnuť
                </v-btn>
              </div>
              <div class="mt-4 mb-6">
                <v-textarea
                  v-model="commentText"
                  rounded="lg"
                  density="compact"
                  variant="solo-filled"
                  flat
                  single-line
                  placeholder="Pridajte komentár"
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
              <h3 class="text-h6 font-weight-medium">Správa z praxe</h3>
              <p class="text-body-2 text-grey-darken-1">
                Stiahni si vzor, vyplň ho a následne ho nahraj naspäť do systému
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
                    <div class="font-weight-medium text-black" >Krok 3 – Stiahni vzor správy</div>
                    <div class="text-body-2 text-grey-darken-1">
                      Stiahni prázdny PDF dokument, ktorý treba vyplniť.
                    </div>
                  </div>
                </div>

                <v-btn
                  color="#3A803D"
                  class="text-white"
                  rounded="lg"
                  elevation="0"
                  prepend-icon="mdi-download"
                  @click="downloadReportTemplate"
                >
                  Stiahnuť vzor
                </v-btn>
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
                    <div class="font-weight-medium">Krok 4 – Nahraj vyplnenú správu</div>
                    <div class="text-body-2 text-grey-darken-1">
                      Vyber svoj vyplnený PDF súbor a odošli ho na schválenie.
                    </div>
                  </div>
                </div>
              </div>

              <v-form>
                <v-file-input
                  v-model="report.file"
                  :model-value="report.file || (uploadedReport ? { name: getFileName(uploadedReport.file_path) } : null)"
                  accept="application/pdf"
                  label="Vyber PDF súbor správy"
                  prepend-icon="mdi-file-pdf-box"
                  rounded="lg"
                  variant="solo-filled"
                  flat
                  color="#3A803D"
                  class="mb-6"
                  :disabled="isReportLocked"
                />

                <div class="d-flex justify-end flex-wrap ga-2">
                  <v-btn
                    v-if="canDeleteReportOrUploadReport"
                    color="#3A803D"
                    class="text-white"
                    rounded="lg"
                    elevation="0"
                    @click="submitReport"
                  >
                    <v-icon start>mdi-upload</v-icon> Nahrať správu
                  </v-btn>

                  <v-btn
                    v-if="uploadedReport"
                    variant="outlined"
                    color="#3A803D"
                    rounded="lg"
                    elevation="0"
                    @click="downloadUploadedReport"
                  >
                    <v-icon start>mdi-file-pdf-box</v-icon> Stiahnuť nahratú správu
                  </v-btn>

                  <v-btn
                    v-if="uploadedReport && canDeleteReportOrUploadReport"
                    color="red"
                    class="text-white"
                    rounded="lg"
                    elevation="0"
                    @click="deleteReport"
                  >
                    <v-icon start>mdi-delete</v-icon> Odstrániť
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
                Úpravy alebo nahrávanie správy už nie sú povolené
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
              <h3 class="text-h6 font-weight-medium">Správa z praxe</h3>
            </div>

            <v-card class="pa-4 mb-6" variant="tonal" color="grey-lighten-4" rounded="lg" elevation="0">
              <div class="d-flex flex-column flex-md-row align-center justify-space-between ga-4">
                <div class="d-flex align-center ga-2">
                  <v-icon color="#3A803D" size="28">mdi-file-pdf-box</v-icon>
                  <div>
                    <div class="font-weight-medium text-black">
                      {{ uploadedReport ? getFileName(uploadedReport.file_path) : 'Správa nebola zatial nahratá' }}
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
                  Stiahnuť
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
                  placeholder="Pridajte komentár"
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
            <v-btn color="#3A803D" class="text-white" rounded="lg" @click="save" style="background-color: #3A803D;">
              <v-icon start>mdi-content-save</v-icon> Uložiť zmeny
            </v-btn>

            <v-btn variant="tonal" color="grey" rounded="lg" class="ml-2" @click="cancel">
              Zrušiť
            </v-btn>
          </template>

          <template v-else>
            <v-btn
              v-if="(isStudent && tab === 'info' && ['created', 'agreement_rejected_by_company', 'agreement_rejected_by_supervisor'].includes(practice.status)) || (isSupervisor && tab === 'info')"
              variant="outlined"
              color="#3A803D"
              rounded="lg"
              @click="isEditing = true"
            >
              <v-icon start>mdi-pencil</v-icon> Upraviť
            </v-btn>

            <v-btn
              v-if="(tab === 'agreement' && canManageAgreement) || (tab ==='report' && canManageReport)"
              color="green"
              class="text-white"
              rounded="lg" elevation="0"
              @click="approveDocument(tab)">
              <v-icon start>mdi-check</v-icon> Schváliť
            </v-btn>

            <v-btn
              v-if="(tab === 'agreement' && canManageAgreement) || (tab ==='report' && canManageReport)"
              color="red"
              class="text-white"
              rounded="lg"
              elevation="0"
              @click="rejectDocument(tab)">
              <v-icon start>mdi-close</v-icon> Odmietnuť
            </v-btn>

            <v-btn
              v-if="isStudent && tab === 'agreement' && ['created', 'agreement_rejected_by_company', 'agreement_rejected_by_supervisor'].includes(practice.status)"
              class="text-white ml-2"
              rounded="lg"
              @click="submit"
              style="background-color: #3A803D;"
            >
              <v-icon start>mdi-check</v-icon> Odoslať na schválenie dohody
            </v-btn>

            <v-btn
              v-if="isStudent && tab === 'report' && ['agreement_confirmed_by_company', 'agreement_confirmed_by_supervisor', 'report_rejected_by_company', 'report_rejected_by_supervisor'].includes(practice.status)"
              class="text-white ml-2"
              rounded="lg"
              @click="submitR"
              style="background-color: #3A803D;"
            >
              <v-icon start>mdi-check</v-icon> Odoslať správu na schválenie
            </v-btn>

            <v-btn
              v-if="
                  practice.status !== 'canceled' &&
                  ((practice.status === 'created' && isStudent))
                "
              color="red"
              class="text-white ml-2"
              rounded="lg"
              @click="cancelPractice"
            >
              <v-icon start>mdi-cancel</v-icon> Zrušiť prax
            </v-btn>
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
import { getStatusColor, getStatusIcon, getStatusText } from '@/utils/statusHelpers.js'
import { useAuthStore } from '@/stores/authStore.js'


export default {
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
      toast: useToast(),
      statusHistory: [],
      loadingPractice: false,
      report: { file: null},
      reportStatus: '',
      isEditingReport: false,
      agreement: { file: null },
      isEditingAgreement: false,
      commentText: '',
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
    academicYears() {
      const year = new Date().getFullYear()
      return Array.from({ length: 5 }, (_, i) => `${year + i}/${year + i + 1}`)
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
      this.loadingPractice = true
      this.practice = null
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
      this.loadingPractice = false
      if (this.practicesStore.error) {
        this.toast.error('Nepodarilo sa načítať detaily praxe.')
        return
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
      if (this.practicesStore.error) {
        this.toast.error(this.practicesStore.error || 'Nepodarilo sa aktualizovať prax.')
        return
      }
      this.toast.success(this.practicesStore.success)
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
      if (!confirm('Naozaj chceš zrušiť túto prax?')) return
        await this.practicesStore.deletePractice(this.practice.id)

        this.$emit('update', { id: this.practice.id, status: 'canceled' })
        if (this.practice) this.practice.status = 'canceled'

      if (this.practicesStore.error) {
        this.toast.error(this.practicesStore.error)
        return
      }
      this.toast.success(this.practicesStore.success)
      this.open = false
    },
    async submitReport() {
      if (!this.report.file) {
        this.toast.error('Vyber PDF súbor pred odoslaním!')
        return
      }
        await this.practicesStore.uploadReport(this.practice.id, this.report.file)
      if (this.practicesStore.error) {
        this.toast.error(this.practicesStore.error || 'Chyba pri nahrávaní správy.')
        return
      }
      this.toast.success(this.practicesStore.success)
      await this.fetchPractice()
      this.report.file = null
    },
    async downloadReportTemplate() {
        await this.practicesStore.downloadReportTemplate(this.practice.id)
      if (this.practicesStore.error) {
        this.toast.error(this.practicesStore.error || 'Nepodarilo sa stiahnuť vzor správy.')
      }
    },
    async downloadAgreementTemplate() {
      await this.practicesStore.downloadAgreementTemplate(this.practice.id)
      if (this.practicesStore.error) {
        this.toast.error(this.practicesStore.error || 'Nepodarilo sa stiahnuť dohodu.')
      }
    },
    async submitAgreement() {
      if (!this.agreement.file) {
        this.toast.error('Vyber PDF súbor pred odoslaním!')
        return
      }
        await this.practicesStore.uploadAgreement(this.practice.id, this.agreement.file)
        if (this.practicesStore.error) {
          this.toast.error(this.practicesStore.error || 'Chyba pri nahrávaní dohody.')
          return
        }
      this.toast.success(this.practicesStore.success)
      await this.fetchPractice()
      this.agreement.file = null
    },

    async submit() {
      if (this.practice.status === 'created') {
          await this.practicesStore.requestAgreementApproval(this.practice.id)
        if (this.practicesStore.error) {
          this.toast.error(this.practicesStore.error || 'Chyba pri odoslaní na schválenie.')
          return
        }
        this.toast.success(this.practicesStore.success)
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
      if (this.practicesStore.error) {
        this.toast.error(this.practicesStore.error || 'Nepodarilo sa stiahnuť nahratú dohodu.')
      }
    },
    async downloadUploadedReport() {
      if (!this.uploadedReport) return
        const { url } = await this.practicesStore.downloadUploadedDocument(
          this.practice.id,
          this.uploadedReport.file_path
        )
      window.open(url, '_blank')
      if (this.practicesStore.error) {
        this.toast.error(this.practicesStore.error || 'Nepodarilo sa stiahnuť nahratú správu.')
      }
    },

    getFileName(path) {
      if (!path) return ''
      return path.split('/').pop()
    },

    async submitR() {
        await this.practicesStore.requestReportApproval(this.practice.id)
      if (this.practicesStore.error) {
        this.toast.error(this.practicesStore.error || 'Chyba pri odoslaní správy na schválenie.')
        return
      }
      this.toast.success(this.practicesStore.success)
      await this.fetchPractice()
      this.$emit('update', this.practice)
    },
    async deleteAgreement() {
      if (!this.uploadedAgreement) return
      if (!confirm('Naozaj chcete odstrániť túto dohodu?')) return
        await this.practicesStore.deleteUploadedDocument(this.practice.id, this.uploadedAgreement.file_path)
      if (this.practicesStore.error) {
        this.toast.error(this.practicesStore.error || 'Chyba pri odstraňovaní dohody.')
        return
      }
      this.toast.success(this.practicesStore.success)
      await this.fetchPractice()
    },

    async deleteReport() {
      if (!this.uploadedReport) return
      if (!confirm('Naozaj chcete odstrániť túto správu?')) return
        await this.practicesStore.deleteUploadedDocument(this.practice.id, this.uploadedReport.file_path)
      if (this.practicesStore.error) {
        this.toast.error(this.practicesStore.error || 'Chyba pri odstraňovaní správy.')
        return
      }
      this.toast.success(this.practicesStore.success)
      await this.fetchPractice()
    },
    async approveDocument(documentType) {
      const comment = this.commentText
      await this.practicesStore.updateDocumentStatus(this.practice.id, documentType, 'agree', comment)

      if (this.practicesStore.error) {
        this.toast.error(this.practicesStore.error || 'Nepodarilo sa schváliť dokument')
        return
      }
      this.toast.success(this.practicesStore.success)
      await this.fetchPractice()
      this.commentText = ''
    },

    async rejectDocument(documentType) {
        const comment = this.commentText;
        await this.practicesStore.updateDocumentStatus(this.practice.id, documentType, 'reject', comment);
        if (this.practicesStore.error) {
          this.toast.error(this.practicesStore.error ||'Nepodarilo sa odmietnuť dokument');
          return
        }
      this.toast.success(this.practicesStore.success);
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
    }
  }
}
</script>

