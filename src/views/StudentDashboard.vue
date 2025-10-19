<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <Sidebar class="sidebar" />
        <v-container fluid class="pa-4">
          <v-row class="mb-4">
            <v-col cols="12">
              <h1 class="text-h5">Rozhranie študenta</h1>
              <p class="text-subtitle-1">Prehľad odborných praxí</p>
            </v-col>
          </v-row>
        </v-container>
      </v-row>
    </v-container>
  </v-main>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
<script>
import { useAuthStore } from '@/stores/authStore.js'
import Sidebar from '@/components/Sidebar.vue'

export default {
  components: { Sidebar },
  data() {
    return {
      authStore: useAuthStore(),
    }
  },
  methods: {
  }
}
</script>
