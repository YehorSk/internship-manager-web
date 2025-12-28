<template>
  <v-btn
    v-bind="$attrs"
    color="#3A803D"
    class="text-white"
    rounded="lg"
    @click="$emit('click', $event)"
  >
    <v-icon v-if="icon" start>{{ icon }}</v-icon>
    <slot>{{ text }}</slot>
  </v-btn>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
}
</script>

