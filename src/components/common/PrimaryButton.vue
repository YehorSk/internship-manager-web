<template>
  <v-btn
    v-bind="$attrs"
    color="#3A803D"
    class="text-white"
    rounded="lg"
    style="background-color: #3a803d"
    :disabled="isDisabled"
    :type="type"
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
    type: {
      type: String,
      default: 'button',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
}
</script>
