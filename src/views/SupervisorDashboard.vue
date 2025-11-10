<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar/>
        <v-container fluid class="pa-4">
          <v-row class="mb-4">
            <v-col cols="12">
              <h1 class="text-h5">{{ $t('SupervisorDashboard.title') }}</h1>
            </v-col>
          </v-row>


        </v-container>
      </v-row>
    </v-container>
  </v-main>

</template>

<script>
import Sidebar from '@/components/Sidebar.vue'

export default {
  components: { Sidebar },
}
</script>


