<script lang="ts">
import { defineComponent } from "vue";
import { NFormItem, NCheckbox } from "naive-ui";

export default defineComponent({
  components: {
    NFormItem, NCheckbox,
  },
  props: {
    modelValue: { type: Boolean, required: true },
    label: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
});
</script>

<template>
  <NFormItem :label="label">
    <NCheckbox :checked="modelValue" @update:checked="$emit('update:modelValue', $event)">
      <slot />
    </NCheckbox>
  </NFormItem>
</template>
