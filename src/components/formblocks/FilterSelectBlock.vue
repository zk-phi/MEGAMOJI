<script lang="ts">
import SelectBlock from "./SelectBlock.vue";
import filters from "../../constants/filters";

export default {
  components: {
    SelectBlock
  },
  props: {
    modelValue: { type: Object, default: null },
  },
  data: (): Record<string, unknown> => ({
    filters
  }),
  methods: {
    onChange(label): void {
      this.$emit('update:modelValue', filters.find((filter) => filter.label === label) || null);
    },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <SelectBlock
      :model-value="modelValue ? modelValue.label : ''"
      @update:model-value="onChange"
      label="前処理">
    <option value="">
      なし
    </option>
    <option v-for="(filter, ix) in filters" :value="filter.label">
      {{ filter.label }}
    </option>
  </SelectBlock>
</template>
