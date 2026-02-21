<template>
  <v-dialog v-model="open" max-width="700" scrollable>
    <template v-if="company">
      <v-card outlined>
        <v-card-title>
          <div class="d-flex align-center">
            <v-btn icon variant="text" @click="close">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <span class="ml-3 text-h6">{{ $t('CompanyDetailsDialog.companyDetails') }}</span>
          </div>
        </v-card-title>
        <v-card-text class="pt-4">
          <v-container fluid class="pa-0">
            <v-row dense>

              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">
                  {{ $t('CompanyDetailsDialog.companyName') }}
                </div>
                <div class="font-weight-medium mt-1">
                  {{ company.name }}
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">
                  {{ $t('CompanyDetailsDialog.ico') }}
                </div>
                <div class="font-weight-medium mt-1">
                  {{ company.ico }}
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">
                  {{ $t('CompanyDetailsDialog.status') }}
                </div>
                <v-chip
                  class="mt-1"
                  :color="company.status ? 'success' : 'error'"
                  size="small"
                  variant="flat"
                >
                  {{ company.status
                  ? $t('CompanyDetailsDialog.statusActive')
                  : $t('CompanyDetailsDialog.statusInactive')
                  }}
                </v-chip>
              </v-col>

              <v-col cols="12">
                <div class="text-caption text-medium-emphasis">
                  {{ $t('CompanyDetailsDialog.address') }}
                </div>
                <div class="d-flex align-center ga-2 mt-1">
                  <v-icon size="16">mdi-map-marker</v-icon>
                  <span class="font-weight-medium">
                  {{ company.address }}
                </span>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">
                  {{ $t('CompanyDetailsDialog.companyEmail') }}
                </div>
                <div class="d-flex align-center ga-2 mt-1">
                  <v-icon size="16">mdi-email</v-icon>
                  <span class="font-weight-medium">
                  {{ company.company_email }}
                </span>
                </div>
              </v-col>

            </v-row>
          </v-container>
          <!-- Contact Section -->
          <div class="mt-6">
            <div class="text-caption text-medium-emphasis mb-3">
              {{ $t('CompanyDetailsDialog.contactName') }}
            </div>

            <v-container fluid class="pa-0">
              <v-row dense>

                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis">
                    {{ $t('CompanyDetailsDialog.contactPosition') }}
                  </div>
                  <div class="font-weight-medium mt-1">
                    {{ company.contact_position }}
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis">
                    {{ $t('CompanyDetailsDialog.contactName') }}
                  </div>
                  <div class="font-weight-medium mt-1">
                    {{ company.contact_name }}
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis">
                    {{ $t('CompanyDetailsDialog.contactEmail') }}
                  </div>
                  <div class="d-flex align-center ga-2 mt-1">
                    <v-icon size="16">mdi-email</v-icon>
                    <span class="font-weight-medium">
                    {{ company.contact_email }}
                  </span>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis">
                    {{ $t('CompanyDetailsDialog.contactPhone') }}
                  </div>
                  <div class="d-flex align-center ga-2 mt-1">
                    <v-icon size="16">mdi-phone</v-icon>
                    <span class="font-weight-medium">
                    {{ company.contact_phone }}
                  </span>
                  </div>
                </v-col>

              </v-row>
            </v-container>
          </div>
<!--          <p>-->
<!--            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.ico') }}:</span>-->
<!--            {{ company.ico }}-->
<!--          </p>-->

<!--          <p>-->
<!--            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.address') }}:</span>-->
<!--            {{ company.address }}-->
<!--          </p>-->

<!--          <p>-->
<!--            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.contactPosition') }}:</span>-->
<!--            {{ company.contact_position }}-->
<!--          </p>-->

<!--          <p>-->
<!--            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.contactName') }}:</span>-->
<!--            {{ company.contact_name }}-->
<!--          </p>-->

<!--          <p>-->
<!--            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.companyEmail') }}:</span>-->
<!--            {{ company.company_email }}-->
<!--          </p>-->

<!--          <p>-->
<!--            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.contactEmail') }}:</span>-->
<!--            {{ company.contact_email }}-->
<!--          </p>-->

<!--          <p>-->
<!--            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.contactPhone') }}:</span>-->
<!--            {{ company.contact_phone }}-->
<!--          </p>-->

<!--          <p>-->
<!--            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.status') }}:</span>-->
<!--            {{ company.status-->
<!--            ? $t('CompanyDetailsDialog.statusActive')-->
<!--            : $t('CompanyDetailsDialog.statusInactive')-->
<!--            }}-->
<!--          </p>-->

          <template v-if="company.student">
            <hr class="my-4" />

            <p>
      <span class="font-weight-bold">
        {{ $t('CompanyDetailsDialog.registeredBy') }}:
      </span>
            </p>

            <p>
              <span class="font-weight-bold">Id:</span>
              {{ company.student.user_id}}
            </p>

            <p>
              <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.student') }}:</span>
              {{ company.student.first_name + ' ' + company.student.last_name }}
            </p>

            <p>
              <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.email') }}:</span>
              {{ company.student.student_email }}
            </p>
          </template>
        </v-card-text>
      </v-card>
    </template>
    <template v-if="loadingStore.is(`getCompany_${companyId}`)">
      <v-card class="pa-8 text-center">
        <p class="mt-4">{{ $t('common.loading') }}</p>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import {useCompaniesStore} from "@/stores/companiesStore.js";
import {useLoadingStore} from "@/stores/loadingStore.js";

export default {
  name: "CompanyDetailsDialog",
  props: {
    modelValue: { type: Boolean, default: false },
    companyId: {
      type: [Number, null],
      default: null,
      required: false,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      store: useCompaniesStore(),
      loadingStore: useLoadingStore(),
      company: null
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
      if (newVal) this.fetchCompany()
    }
  },
  methods: {
    close() {
      this.open = false
    },
    async fetchCompany() {
      this.company = null
      this.company = await this.store.getCompany(this.companyId)
      console.log(this.company)
    }
  }
}
</script>
