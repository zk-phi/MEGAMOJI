<script lang="ts">
import { NButton, NFormItem, NSpace } from "naive-ui";
import ColorStopBlock from "./ColorStopBlock.vue";
import { lighterColor, darkerColor } from "../../utils/color";

type ColorStop = { color: string, pos: number };

export default {
  components: {
    ColorStopBlock, NButton, NFormItem, NSpace,
  },
  props: {
    modelValue: { type: Array, required: true },
    baseColor: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  methods: {
    initializeGradient(): void {
      this.$emit("update:modelValue", [
        { color: "#ffffff", pos: 0 },
        { color: this.baseColor, pos: 45 },
        { color: lighterColor(this.baseColor), pos: 55 },
        { color: darkerColor(this.baseColor), pos: 65 },
        { color: "#ffffff", pos: 100 },
      ]);
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
        { color: this.baseColor, pos: 50 },
      ]);
    },
  },
};
</script>

<template>
  <NFormItem label="グラデ">
    <NButton v-if="modelValue.length == 0" dashed block @click="initializeGradient">
      グラデーションを追加
    </NButton>
    <NSpace v-else vertical style="width: 100%">
      <ColorStopBlock
          v-for="(colorstop, ix) in modelValue"
          :key="ix"
          :model-value="colorstop"
          @remove="remove(ix)"
          @update:model-value="update(ix, $event)" />
      <NButton dashed block @click="add">
        + 色を追加
      </NButton>
    </NSpace>
  </NFormItem>
</template>
