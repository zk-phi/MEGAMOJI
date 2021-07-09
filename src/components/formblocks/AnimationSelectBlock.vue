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
    animations,
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
      @update:model-value="onChange">
    <option value="">
      なし
    </option>
    <option
        v-for="animation in animations"
        :key="animation.label"
        :value="animation.label">
      {{ animation.label }}
    </option>
  </SelectBlock>
</template>
