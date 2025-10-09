<template>
  <v-snackbar
    v-model="model"
    color="green-darken-2"
    location="top"
    timeout="4000"
    rounded="lg"
    multi-line
  >
    <div class="text-white font-weight-medium">
      <slot>{{ message }}</slot>
    </div>
    <template #actions>
      <v-btn icon @click="model = false">
        <span class="text-white text-h6">✕</span>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { defineModel, defineProps } from 'vue'
const model = defineModel({ type: Boolean })
defineProps({
  message: { type: String, default: 'Registrácia bola úspešná — skontrolujte svoj email.' }
})
</script>
