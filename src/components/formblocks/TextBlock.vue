<script lang="ts">
import { NFormItem, NInput } from "naive-ui";

export default {
  components: {
    NFormItem, NInput,
  },
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
  <NFormItem :label="label">
    <NInput :value="modelValue" @update:value="$emit('update:modelValue', $event)" />
  </NFormItem>
</template>
