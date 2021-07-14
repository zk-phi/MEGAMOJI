<script lang="ts">
import { defineComponent } from "vue";
import { NFormItem, NSwitch } from "naive-ui";

export default defineComponent({
  components: {
    NFormItem, NSwitch,
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
    <NSwitch
        :value="modelValue"
        @update:value="$emit('update:modelValue', $event)" />
  </NFormItem>
</template>
