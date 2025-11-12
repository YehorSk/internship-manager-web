<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="text" class="text-capitalize">
        {{ lang.toUpperCase() }}
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="l in languages"
        :key="l"
        @click="setLang(l)"
      >
        <v-list-item-title>{{ l.toUpperCase() }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { useProfileStore } from '@/stores/profileStore.js'

export default {
  data() {
    return {
      store: useProfileStore(),
      languages: ['sk', 'en', 'ua', 'ru', 'be']
    }
  },
  computed: {
    lang() {
      return this.store.lang
    }
  },
  methods: {
    async setLang(l) {
      await this.store.setLanguage(l)
    }
  }
}
</script>


