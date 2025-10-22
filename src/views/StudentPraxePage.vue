<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar/>

        <v-container fluid class="pa-4">
          <v-row class="align-center mb-4">
            <v-col cols="8">
              <h1 class="text-h5 mb-1">Moje praxe</h1>
              <p class="text-subtitle-1">Prehľad všetkých vašich praxí</p>
            </v-col>
            <v-col cols="4" class="d-flex justify-end">
              <v-btn
                color="#3A803D"
                class="text-white"
                @click="openForm"
              >
                Pridať novú prax
              </v-btn>
            </v-col>
          </v-row>

          <InternshipFormDialog ref="formDialog" />
        </v-container>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js'
import Sidebar from '@/components/Sidebar.vue'
import InternshipFormDialog from '@/components/StudentAddPraxeForm.vue'

export default {
  components: { Sidebar, InternshipFormDialog },
  data() {
    return {
      authStore: useAuthStore()
    }
  },
  methods: {
    openForm() {
      this.$refs.formDialog.openDialog()
    }
  }
}
</script>

