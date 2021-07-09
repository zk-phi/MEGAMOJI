<script lang="ts">
import SelectBlock from "./SelectBlock.vue";
import filters from "../../constants/filters";

export default {
  components: {
    SelectBlock,
  },
  props: {
    modelValue: { type: Object, default: null },
  },
  emits: [
    "update:modelValue",
  ],
  data: (): Record<string, unknown> => ({
    filters,
  }),
  methods: {
    onChange(label: string): void {
      this.$emit("update:modelValue", filters.find((filter) => filter.label === label) || null);
    },
  },
};
</script>

<template>
  <SelectBlock
      :model-value="modelValue ? modelValue.label : ''"
      label="前処理"
      @update:model-value="onChange">
    <option value="">
      なし
    </option>
    <option v-for="filter in filters" :key="filter.label" :value="filter.label">
      {{ filter.label }}
    </option>
  </SelectBlock>
</template>
