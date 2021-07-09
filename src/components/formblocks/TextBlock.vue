<script lang="ts">
export default {
  props: {
    modelValue: { type: String, required: true },
    label: { type: String, default: undefined },
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
          type="text"
          @input="$emit('update:modelValue', $event.target.value)">
    </div>
  </div>
</template>
