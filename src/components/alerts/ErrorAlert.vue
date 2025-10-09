<template>
  <v-snackbar
    v-model="model"
    color="red-darken-2"
    location="top"
    timeout="5000"
    rounded="lg"
    multi-line
  >
    <div class="text-white font-weight-medium">
      {{ resolvedMessage }}
    </div>
    <ul v-if="hasItems" class="mt-2 pl-4">
      <li v-for="(msg, i) in flatItems" :key="i" class="text-white text-body-2">
        {{ msg }}
      </li>
    </ul>
    <template #actions>
      <v-btn icon @click="model = false">
        <span class="text-white text-h6">✕</span>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue'
import { defineModel, defineProps } from 'vue'

const model = defineModel({ type: Boolean })
const props = defineProps({
  message: { type: String, default: 'Chyba pri registrácii.' },
  items: { type: [Array, Object], default: () => [] }
})

const isArray = v => Array.isArray(v)
const isObject = v => v && typeof v === 'object' && !Array.isArray(v)

const flatItems = computed(() => {
  if (isArray(props.items)) return props.items.filter(Boolean).map(String)
  if (isObject(props.items)) {
    return Object.values(props.items)
      .flat()
      .filter(Boolean)
      .map(String)
  }
  return []
})

const hasItems = computed(() => flatItems.value.length > 0)
const resolvedMessage = computed(() => props.message)
</script>
