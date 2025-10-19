<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar class="sidebar" />
        <v-container fluid class="pa-4">
          <v-row class="mb-4">
            <v-col cols="12">
              <h1 class="text-h5">Rozhranie garanta</h1>
              <p class="text-subtitle-1">Potvrdenie firiem</p>
            </v-col>
          </v-row>

          <v-card class="mb-6">
            <v-card-title class="text-h6 d-flex justify-space-between">
              <div>Zoznam firiem</div>
              <span class="text-body-2 text-grey-darken-1">
              Celkovo {{ store.companies.length }} firiem
            </span>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <template v-if="store.loading">
                <div class="text-center py-10">Načítavam...</div>
              </template>
              <template v-else-if="!store.companies.length">
                <div class="text-center py-12 text-grey-darken-1">
                  <v-icon size="64" color="#3A803D" class="mb-3">mdi-check-circle-outline</v-icon>
                  <p>Žiadne firmy</p>
                </div>
              </template>
              <template v-else>
                <v-table>
                  <thead>
                  <tr>
                    <th>Názov</th>
                    <th>Kontakt</th>
                    <th>Email</th>
                    <th>Telefón</th>
                    <th>Stav</th>
                    <th class="text-right">Akcie</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="c in store.companies" :key="c.id">
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
                        {{ c.status === true ? 'Aktívna' : 'Neaktívna' }}
                      </v-chip>
                    </td>
                    <td class="text-right">
                      <v-btn
                        size="small"
                        color="#3A803D"
                        class="me-2 text-white"
                        prepend-icon="mdi-check-circle"
                        @click="confirmCompany(c.id)"
                      >
                        Potvrdiť
                      </v-btn>
                      <v-btn
                        size="small"
                        color="error"
                        prepend-icon="mdi-close-circle"
                        @click="rejectCompany(c.id)"
                      >
                        Odmietnuť
                      </v-btn>
                    </td>
                  </tr>
                  </tbody>
                </v-table>
                <v-pagination
                  v-model="store.current_page"
                  :length="store.total_pages"
                  rounded="circle"
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
import Sidebar from '@/components/Sidebar.vue'
import { useCompaniesStore } from '@/stores/companies'

export default {
  name: 'CompaniesView',
  components: { Sidebar },

  data() {
    return {
      store: useCompaniesStore()
    }
  },

  methods: {
    confirmCompany(id) {
      this.store.changeStatus(id, 1)
    },
    rejectCompany(id) {
      this.store.changeStatus(id, 0)
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


