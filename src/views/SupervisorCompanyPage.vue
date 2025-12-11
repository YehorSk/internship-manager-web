<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar/>
        <v-container fluid class="pa-4">
          <v-row class="mb-4">
            <v-col cols="12">
              <h1 class="text-h5">{{ $t('SupervisorCompanyPage.title') }}</h1>
              <p class="text-subtitle-1">{{ $t('SupervisorCompanyPage.subtitle') }}</p>
            </v-col>
          </v-row>

          <v-card class="mb-6">
            <v-card-title class="text-h6 d-flex justify-space-between">
              <div>{{ $t('SupervisorCompanyPage.listTitle') }}</div>
              <span class="text-body-2 text-grey-darken-1">
              {{ $t('SupervisorCompanyPage.total') }} {{ store.companies.length }} {{ $t('SupervisorCompanyPage.total2') }}
            </span>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <template v-if="loadingStore.is('fetchCompanies')">
                <div class="text-center py-10">{{ $t('common.loading') }}</div>
              </template>
              <template v-else-if="!store.companies.length">
                <div class="text-center py-12 text-grey-darken-1">
                  <v-icon size="64" color="#3A803D" class="mb-3">mdi-check-circle-outline</v-icon>
                  <p>{{ $t('SupervisorCompanyPage.empty') }}</p>
                </div>
              </template>
              <template v-else>
                <v-table>
                  <thead>
                  <tr>
                    <th>{{ $t('common.ico') }}</th>
                    <th>{{ $t('SupervisorCompanyPage.name') }}</th>
                    <th>{{ $t('SupervisorCompanyPage.contact') }}</th>
                    <th>{{ $t('SupervisorCompanyPage.email') }}</th>
                    <th>{{ $t('SupervisorCompanyPage.phone') }}</th>
                    <th>{{ $t('SupervisorCompanyPage.status') }}</th>
                    <th class="text-right">{{ $t('SupervisorCompanyPage.actions') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="c in store.companies" :key="c.user_id">
                    <td>{{ c.ico }}</td>
                    <td>{{ c.name }}</td>
                    <td>{{ c.contact_name }}</td>
                    <td>{{ c.contact_email }}</td>
                    <td>{{ c.contact_phone }}</td>
                    <td>
                      <v-chip
                        :color="c.status === true ? 'green' : 'grey'"
                        class="text-white"
                        size="small"
                      >
                        {{ c.status === true
                        ? $t('SupervisorCompanyPage.active')
                        : $t('SupervisorCompanyPage.inactive')
                        }}
                      </v-chip>
                    </td>
                    <td class="text-right">
                      <div class="d-flex justify-end align-center ga-2">
                        <v-btn
                          icon
                          size="small"
                          color="#3A803D"
                          :loading="loadingStore.is(`changeStatus_true_${c.user_id}`)"
                          @click="confirmCompany(c.user_id)"
                        >
                          <v-icon>mdi-check-circle</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          size="small"
                          color="error"
                          :loading="loadingStore.is(`changeStatus_false_${c.user_id}`)"
                          @click="rejectCompany(c.user_id)"
                        >
                          <v-icon>mdi-close-circle</v-icon>
                        </v-btn>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </v-table>
                <v-pagination
                  :model-value="store.current_page"
                  :length="store.total_pages"
                  rounded="circle"
                  @update:modelValue="(page) => loadCompanies(page)"
                ></v-pagination>
              </template>
            </v-card-text>
          </v-card>
        </v-container>
      </v-row>
    </v-container>
  </v-main>

</template>

<script>
import Sidebar from '@/components/SideBar.vue'
import { useCompaniesStore } from '@/stores/companiesStore.js'
import { useLoadingStore } from '@/stores/loadingStore.js'

export default {
  name: 'CompaniesView',
  components: { Sidebar },

  data() {
    return {
      store: useCompaniesStore(),
      loadingStore: useLoadingStore(),
    }
  },

  methods: {
    async loadCompanies(page = 1) {
      this.store.current_page = page
      await this.store.fetchCompanies()
    },
    async confirmCompany(user_id) {
      await this.store.changeStatus(user_id, true)

      this.store.$patch(state => {
        const idx = state.companies.map(c =>
          c.user_id === user_id ? { ...c, status: true } : c
        )
        state.companies = idx
      })
    },

    async rejectCompany(user_id) {
      await this.store.changeStatus(user_id, false)
      this.store.$patch(state => {
        const idx = state.companies.map(c =>
          c.user_id === user_id ? { ...c, status: false } : c
        )
        state.companies = idx
      })
    }
  },

  mounted() {
    this.store.fetchCompanies()
  }
}
</script>


<style>
body {
  background-color: #f9fafb !important;
}
</style>
