<script lang="ts">
import { NFormItem, NSelect } from "naive-ui";

export default {
  components: {
    NFormItem, NSelect,
  },
  props: {
    modelValue: { type: String, required: true },
    label: { type: String, default: undefined },
    options: { type: Object, required: true },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <NFormItem :label="label">
    <NSelect
        :value="modelValue"
        :options="options"
        @update:value="$emit('update:modelValue', $event)">
    </NSelect>
  </NFormItem>
</template>
