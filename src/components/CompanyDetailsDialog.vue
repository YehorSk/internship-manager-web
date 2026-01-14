<template>
  <v-dialog v-model="open" max-width="700" scrollable>
    <template v-if="company">
      <v-card outlined>
        <v-card-title>
          <div class="d-flex align-center">
            <v-btn icon variant="text" @click="close">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <span class="ml-3 text-h6">{{ company.name }}</span>
          </div>
        </v-card-title>
        <v-card-text>
          <p>
            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.ico') }}:</span>
            {{ company.ico }}
          </p>

          <p>
            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.address') }}:</span>
            {{ company.address }}
          </p>

          <p>
            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.contactPosition') }}:</span>
            {{ company.contact_position }}
          </p>

          <p>
            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.contactName') }}:</span>
            {{ company.contact_name }}
          </p>

          <p>
            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.companyEmail') }}:</span>
            {{ company.company_email }}
          </p>

          <p>
            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.contactEmail') }}:</span>
            {{ company.contact_email }}
          </p>

          <p>
            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.contactPhone') }}:</span>
            {{ company.contact_phone }}
          </p>

          <p>
            <span class="font-weight-bold">{{ $t('CompanyDetailsDialog.status') }}:</span>
            {{ company.status
            ? $t('CompanyDetailsDialog.statusActive')
            : $t('CompanyDetailsDialog.statusInactive')
            }}
          </p>

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
