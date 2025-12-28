<template>
  <v-btn
    v-bind="$attrs"
    variant="tonal"
    color="grey"
    rounded="lg"
    class="ml-2"
    @click="$emit('click', $event)"
  >
    <slot>{{ text }}</slot>
  </v-btn>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
}
</script>
