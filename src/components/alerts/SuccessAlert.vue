<template>
  <v-snackbar v-model="show" color="green-darken-2" location="top">
    <div class="text-white">{{ message }}</div>
    <template #actions>
      <v-btn icon @click="show = false">
        <span class="text-white">✕</span>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    message: { type: String, default: 'Registrácia bola úspešná — skontrolujte svoj email.' },
  },
  data() {
    return { show: this.modelValue }
  },
  watch: {
    modelValue(v) { this.show = v },
    show(v) { this.$emit('update:modelValue', v) },
  },
}
</script>
