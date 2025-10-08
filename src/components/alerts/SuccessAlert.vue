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
      Registrácia bola úspešná — skontrolujte svoj email pre ďalšie inštrukcie.
    </div>
    <template #actions>
      <v-btn icon @click="model = false">
        <span class="text-white text-h6">✕</span>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { defineModel } from 'vue'
const model = defineModel()
</script>
