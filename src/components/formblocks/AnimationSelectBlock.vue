<script lang="ts">
import SelectBlock from "./SelectBlock.vue";
import animations from "../../constants/animations";

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
    options: [
      { label: "なし", value: "" },
      ...animations.map((animation, ix) => ({ label: animation.label, value: animation.label })),
    ],
  }),
  methods: {
    onChange(label: string): void {
      this.$emit(
        "update:modelValue",
        animations.find((animation) => animation.label === label) || null,
      );
    },
  },
};
</script>

<template>
  <SelectBlock
      :model-value="modelValue ? modelValue.label : ''"
      label="アニメーション"
      :options="options"
      @update:model-value="onChange" />
</template>
