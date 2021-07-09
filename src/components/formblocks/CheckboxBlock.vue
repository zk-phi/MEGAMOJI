<script lang="ts">
export default {
  props: {
    modelValue: { type: Boolean, required: true },
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
      <label class="checkbox">
        <input
            :checked="modelValue"
            type="checkbox"
            @input="$emit('update:modelValue', !modelValue)">
        <slot />
      </label>
    </div>
  </div>
</template>
