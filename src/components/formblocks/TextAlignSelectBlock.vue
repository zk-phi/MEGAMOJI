<script lang="ts">
import { defineComponent } from "vue";
import SelectBlock from "./SelectBlock.vue";

export default defineComponent({
  components: {
    SelectBlock,
  },
  props: {
    modelValue: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  data() {
    return {
      options: [
        { label: "両端", value: "stretch" },
        { label: "左", value: "left" },
        { label: "中央", value: "center" },
        { label: "右", value: "right" },
      ],
    };
  },
});
</script>

<template>
  <SelectBlock
      :model-value="modelValue"
      label="揃え"
      :options="options"
      @update:model-value="$emit('update:modelValue', $event)" />
</template>
