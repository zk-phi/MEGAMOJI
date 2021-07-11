<script lang="ts">
import { NButton, NColorPicker } from "naive-ui";

export default {
  components: {
    NButton, NColorPicker,
  },
  props: {
    modelValue: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
    "remove"
  ],
};
</script>

<template>
  <div style="display: flex; align-items: center; width: 100%">
    <NColorPicker
        :modes="['hex']"
        :value="modelValue"
        :show-alpha="false"
        @update:value="$emit('update:modelValue', $event)"
        style="margin-right: 8px" />
    <NButton ghost type="error" @click="$emit('remove')" style="width: 16px">
      x
    </NButton>
  </div>
</template>
