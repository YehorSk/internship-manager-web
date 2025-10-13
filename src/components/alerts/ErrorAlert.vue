<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  message: { type: String, default: 'Nastala chyba' },
  items: { type: Object, default: () => ({}) } // { field: ['msg1','msg2'] }
})
const emit = defineEmits(['update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<template>
  <v-alert
    v-model="open"
    type="error"
    variant="tonal"
    class="rounded-lg"
    closable
  >
    <div class="mb-2">{{ message }}</div>
    <ul v-if="items && Object.keys(items).length" class="pl-4">
      <li v-for="(msgs, field) in items" :key="field">
        <strong>{{ field }}:</strong>
        <span v-for="(m, i) in msgs" :key="i">{{ m }}</span>
      </li>
    </ul>
  </v-alert>
</template>
