<script setup>
import { computed } from 'vue'

// v-model
const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<template>
  <v-snackbar
    v-model="open"
    color="success"
    variant="tonal"
    location="top"
    timeout="4000"
    class="rounded-lg"
  >
    <slot>Operácia prebehla úspešne.</slot>
  </v-snackbar>
</template>
