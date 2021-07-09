<script lang="ts">
export default {
  props: {
    modelValue: { type: String, required: true },
    label: { type: String, default: undefined },
    rows: { type: Number, required: true },
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
      <textarea
          :value="modelValue"
          class="textarea"
          :rows="rows"
          @input="$emit('update:modelValue', $event.target.value)" />
    </div>
  </div>
</template>
