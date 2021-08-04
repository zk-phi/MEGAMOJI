<script lang="ts">
import { defineComponent, PropType } from "vue";
import Button from "../inputs/Button.vue";
import Fieldset from "../inputs/Fieldset.vue";
import ColorStopBlock from "./ColorStopBlock.vue";
import Space from "../global/Space.vue";
import { ColorStop } from "../../types";

export default defineComponent({
  components: {
    ColorStopBlock, Button, Fieldset, Space,
  },
  props: {
    modelValue: { type: Array as PropType<ColorStop[]>, required: true },
    baseColor: { type: String, required: true },
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
  <Fieldset label="グラデ">
    <Button v-if="modelValue.length == 0" type="dashed" block @click="initializeGradient">
      + グラデーションを追加
    </Button>
    <Space v-else vertical full>
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
  </Fieldset>
</template>
