<template>
  <v-label v-if="label.length > 0">
    <v-icon v-if="icon" start color="grey-darken-2">{{ icon }}</v-icon>
    <span class="font-weight-bold">{{ label }}</span><span v-if="important" class="text-red ml-2">*</span>
  </v-label>

  <v-text-field
    v-bind="$attrs"
    :model-value="modelValue"
    :disabled="isDisabled"
    :rules="rules"
    :type="type"
    :placeholder="placeholder"
    rounded="lg"
    density="compact"
    :variant="outlined ? 'outlined' : 'solo-filled'"
    flat
    single-line
    @update:model-value="$emit('update:modelValue', $event)"
    @focus="$emit('focus', $event)"
  />
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    important:{
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    rules: {
      type: Array,
      default: () => [],
    },
    outlined: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'focus'],
}
</script>
