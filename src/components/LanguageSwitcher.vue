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
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const store = useProfileStore()
    const { locale } = useI18n()

    const lang = store.lang
    const languages = ['sk', 'en', 'ua', 'ru', 'be']

    async function setLang(l) {
      await store.setLanguage(l)
      locale.value = l
      window.location.reload()
    }

    return { lang, languages, setLang }
  }
}
</script>


