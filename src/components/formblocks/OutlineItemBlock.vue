<script lang="ts">
import { defineComponent } from "vue";
import { NButton, NColorPicker } from "naive-ui";

export default defineComponent({
  components: {
    NButton, NColorPicker,
  },
  props: {
    modelValue: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
    "remove",
  ],
});
</script>

<template>
  <div style="display: flex; align-items: center; width: 100%;">
    <NColorPicker
        :modes="['hex']"
        :value="modelValue"
        :show-alpha="false"
        style="margin-right: 8px;"
        @update:value="$emit('update:modelValue', $event)" />
    <NButton ghost type="error" style="width: 16px;" @click="$emit('remove')">
      x
    </NButton>
  </div>
</template>
