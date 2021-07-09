<script lang="ts">
export default {
  props: {
    modelValue: { type: Number, required: true },
    label: { type: String, default: undefined },
    min: { type: Number, required: true },
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
          type="number"
          :min="min"
          @change="$emit('update:modelValue', Number($event.target.value))">
    </div>
  </div>
</template>
