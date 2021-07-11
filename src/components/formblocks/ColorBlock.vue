<script lang="ts">
import { NFormItem, NColorPicker } from "naive-ui";

export default {
  components: {
    NFormItem, NColorPicker,
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
    <NColorPicker
        :modes="['hex']"
        :value="modelValue"
        :show-alpha="false"
        @update:value="$emit('update:modelValue', $event)" />
  </NFormItem>
</template>
