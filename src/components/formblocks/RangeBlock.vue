<script lang="ts">
export default {
  props: {
    modelValue: { type: Number, required: true },
    label: { type: String, default: undefined },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
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
          type="range"
          :min="min"
          :max="max"
          @input="$emit('update:modelValue', Number($event.target.value))">
    </div>
  </div>
</template>
