<script lang="ts">
import { defineComponent } from "vue";
import { NFormItem, NSelect } from "naive-ui";

export default defineComponent({
  components: {
    NFormItem, NSelect,
  },
  props: {
    modelValue: { type: [String, Number], required: true },
    label: { type: String, default: undefined },
    options: { type: Object, required: true },
  },
  emits: [
    "update:modelValue",
  ],
});
</script>

<template>
  <NFormItem :label="label">
    <NSelect
        :value="modelValue"
        :options="options"
        @update:value="$emit('update:modelValue', $event)" />
  </NFormItem>
</template>
