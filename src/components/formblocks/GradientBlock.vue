<script lang="ts">
import { defineComponent, PropType } from "vue";
import Button from "../inputs/Button.vue";
import Checkbox from "../inputs/Checkbox.vue";
import ColorStopBlock from "./ColorStopBlock.vue";
import Space from "../global/Space.vue";
import { ColorStop } from "../../types";

export default defineComponent({
  components: {
    ColorStopBlock, Button, Checkbox, Space,
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
        { color: "identical", pos: 40 },
        { color: "lighter", pos: 50 },
        { color: "darker", pos: 60 },
        { color: "identical", pos: 85 },
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
  },
});
</script>

<template>
  <Checkbox v-if="!showDetails" :model-value="modelValue.length > 0" @update:model-value="toggle">
    グラデーション
  </Checkbox>
  <Button
      v-if="showDetails && modelValue.length == 0"
      block
      type="dashed"
      @click="initializeGradient">
    + グラデーションを追加
  </Button>
  <Space v-if="showDetails && modelValue.length > 0" vertical full>
    <ColorStopBlock
        v-for="(colorstop, ix) in modelValue"
        :key="ix"
        :model-value="colorstop"
        :base-color="baseColor"
        @remove="remove(ix)"
        @update:model-value="update(ix, $event)" />
    <Button type="dashed" block @click="add">
      + 色を追加
    </Button>
  </Space>
</template>
