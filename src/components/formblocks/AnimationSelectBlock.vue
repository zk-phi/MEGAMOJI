<script lang="ts">
import { defineComponent } from "vue";
import SelectBlock from "./SelectBlock.vue";
import animations from "../../constants/animations";

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
        ...animations.map((animation) => ({ label: animation.label, value: animation.label })),
      ],
    };
  },
  methods: {
    onChange(label: string): void {
      this.$emit(
        "update:modelValue",
        animations.find((animation) => animation.label === label) || null,
      );
    },
  },
});
</script>

<template>
  <SelectBlock
      :model-value="modelValue ? modelValue.label : ''"
      label="アニメーション"
      :options="options"
      @update:model-value="onChange" />
</template>
