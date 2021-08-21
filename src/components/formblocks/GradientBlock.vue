<script lang="ts">
import { defineComponent, PropType } from "vue";
import Checkbox from "../inputs/Checkbox.vue";
import Gradient from "../inputs/Gradient.vue";
import Space from "../global/Space.vue";
import { ColorStop } from "../../types";

export default defineComponent({
  components: {
    Checkbox, Gradient, Space,
  },
  props: {
    modelValue: { type: Array as PropType<ColorStop[]>, required: true },
    baseColor: { type: String, required: true },
    showDetails: { type: Boolean, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  methods: {
    initializeGradient(): void {
      this.$emit("update:modelValue", [
        { color: "lighter", pos: 0 },
        { color: "lighter", pos: 50 },
        { color: "darker", pos: 63 },
        { color: "lighter", pos: 100 },
      ]);
    },
    toggle(): void {
      if (this.modelValue.length === 0) {
        this.initializeGradient();
      } else {
        this.$emit("update:modelValue", []);
      }
    },
    update(ix: number, value: ColorStop): void {
      this.$emit("update:modelValue", this.modelValue.map((origVal, i) => (
        i === ix ? value : origVal
      )));
    },
    remove(ix: number): void {
      this.$emit("update:modelValue", this.modelValue.filter((_, i) => i !== ix));
    },
    add(): void {
      this.$emit("update:modelValue", [
        ...this.modelValue,
        { color: "identical", pos: 50 },
      ]);
    },
    clearGradient(): void {
      this.$emit("update:modelValue", []);
    },
  },
});
</script>

<template>
  <Space vertical full>
    <Gradient
        v-if="showDetails && modelValue.length > 0"
        :model-value="modelValue"
        :base-color="baseColor"
        @update:model-value="$emit('update:modelValue', $event)" />
    <Checkbox :model-value="modelValue.length > 0" @update:model-value="toggle">
      グラデーション
    </Checkbox>
  </Space>
</template>
