<template>
  <v-chip
    v-bind="$attrs"
    :style="chipStyle"
    class="text-white"
    size="small"
  >
    <slot>{{ text }}</slot>
  </v-chip>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
    backgroundColor: {
      type: String,
      default: '',
    },
    style: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    chipStyle() {
      const baseStyle = { ...this.style }
      if (this.backgroundColor) {
        baseStyle.backgroundColor = this.backgroundColor
      }
      return baseStyle
    },
  },
}
</script>
