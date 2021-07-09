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
    <label class="label">{{ label }}</label>
    <div class="control">
      <div class="select">
        <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
          <slot />
        </select>
      </div>
    </div>
  </div>
</template>
