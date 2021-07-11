<script lang="ts">
import { NFormItem, NInput } from "naive-ui";

export default {
  components: {
    NFormItem, NInput,
  },
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
  <NFormItem :label="label">
    <NInput
        type="textarea"
        :value="modelValue"
        :autosize="{ minRows: 3 }"
        @update:value="$emit('update:modelValue', $event)" />
  </NFormItem>
</template>
