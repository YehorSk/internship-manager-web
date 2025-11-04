<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar/>
        <v-container fluid class="pa-4">
          <v-row class="mb-4">
            <v-col cols="12">
              <h1 class="text-h5">Rozhranie spoločnosti</h1>
              <p class="text-subtitle-1">Prehľad odborných praxí študentov</p>
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
