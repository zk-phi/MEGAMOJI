<script lang="ts">
import { defineComponent } from "vue";
import SelectBlock from "./SelectBlock.vue";
import filters from "../../constants/filters";

export default defineComponent({
  components: {
    SelectBlock,
  },
  props: {
    modelValue: { type: Object, default: null },
  },
  emits: [
    "update:modelValue",
  ],
  data() {
    return {
      options: [
        { label: "なし", value: "" },
        ...filters.map((filter) => ({ label: filter.label, value: filter.label })),
      ],
    };
  },
  methods: {
    onChange(label: string): void {
      this.$emit("update:modelValue", filters.find((filter) => filter.label === label) || null);
    },
  },
});
</script>

<template>
  <SelectBlock
      :model-value="modelValue ? modelValue.label : ''"
      label="前処理"
      :options="options"
      @update:model-value="onChange" />
</template>
