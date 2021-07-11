<script lang="ts">
import { NFormItem, NInputNumber } from "naive-ui";

export default {
  components: {
    NFormItem, NInputNumber,
  },
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
  <NFormItem :label="label">
    <NInputNumber
        :value="modelValue"
        :min="min"
        @update:value="$emit('update:modelValue', $event)" />
  </NFormItem>
</template>
