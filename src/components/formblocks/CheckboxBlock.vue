<script lang="ts">
import { NFormItem, NCheckbox } from "naive-ui";

export default {
  components: {
    NFormItem, NCheckbox,
  },
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
  <NFormItem :label="label">
    <NCheckbox :checked="modelValue" @update:checked="$emit('update:modelValue', $event)">
      <slot />
    </NCheckbox>
  </NFormItem>
</template>
