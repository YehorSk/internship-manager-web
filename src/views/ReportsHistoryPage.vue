<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar/>
        <v-container fluid class="pa-4">
          <v-row class="align-center justify-space-between mb-4">
            <v-col cols="auto">
              <h1 class="text-h5"> {{ $t('ReportsHistoryPage.title') }}</h1>
            </v-col>
            <v-col cols="auto">
              <v-btn color="#3A803D" prepend-icon="mdi-file-export" @click="dialog = true">
                {{ $t('SupervisorDashboard.exportButton') }}
              </v-btn>
            </v-col>
          </v-row>

          <ExportDialog :dialog="dialog" @close="dialog = false" />
        </v-container>
      </v-row>
    </v-container>
  </v-main>

</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import ExportDialog from '@/components/ExportDialog.vue'

export default {
  components: { Sidebar, ExportDialog },
  data() {
    return {
      dialog: false,
    }
  },
}
</script>


