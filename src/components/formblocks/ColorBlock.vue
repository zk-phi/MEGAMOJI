<script lang="ts">
export default {
  props: {
    modelValue: { type: String, required: true },
    label: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <div class="field">
    <label v-if="label" class="label">{{ label }}</label>
    <div class="control">
      <input
          :value="modelValue"
          class="input"
          type="color"
          :disabled="disabled"
          @change="$emit('update:modelValue', $event.target.value)">
    </div>
  </div>
</template>
