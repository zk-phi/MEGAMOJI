<script lang="ts">
import { NFormItem, NButton, NSpace } from "naive-ui";
import OutlineOption from "../inputs/OutlineOption.vue";
import CheckboxGroup from "../inputs/CheckboxGroup.vue";
import OutlineItemBlock from "./OutlineItemBlock.vue";
import { darkerColor, lighterColor } from "../../utils/color";

export default {
  components: {
    OutlineOption, CheckboxGroup, OutlineItemBlock, NFormItem, NButton, NSpace,
  },
  props: {
    modelValue: { type: Array, required: true },
    baseColor: { type: String, required: true },
    showDetails: { type: Boolean, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  computed: {
    colors(): string[] {
      return this.modelValue.map((color) => {
        if (color === "darker") {
          return darkerColor(this.baseColor);
        } else if (color === "lighter") {
          return lighterColor(this.baseColor);
        } else if (color === "identical") {
          return this.baseColor;
        } else {
          return color;
        }
      });
    },
  },
  methods: {
    update(ix: number, value: string): void {
      this.$emit("update:modelValue", this.modelValue.map((origVal, i) => (
        ix === i ? value : origVal
      )));
    },
    add(): void {
      this.$emit("update:modelValue", [...this.modelValue, this.baseColor]);
    },
    remove(ix: number): void {
      this.$emit("update:modelValue", this.modelValue.filter((_, i) => i !== ix));
    },
  },
};
</script>

<template>
  <NFormItem v-if="!showDetails" label="アウトライン">
    <CheckboxGroup>
      <OutlineOption
          :model-value="modelValue"
          :base-color="baseColor"
          color="#000000"
          @update:modelValue="$emit('update:modelValue', $event)" />
      <OutlineOption
          :model-value="modelValue"
          :base-color="baseColor"
          color="darker"
          @update:modelValue="$emit('update:modelValue', $event)" />
      <OutlineOption
          :model-value="modelValue"
          :base-color="baseColor"
          color="identical"
          @update:modelValue="$emit('update:modelValue', $event)" />
      <OutlineOption
          :model-value="modelValue"
          :base-color="baseColor"
          color="lighter"
          @update:modelValue="$emit('update:modelValue', $event)" />
      <OutlineOption
          :model-value="modelValue"
          :base-color="baseColor"
          color="#ffffff"
          @update:modelValue="$emit('update:modelValue', $event)" />
    </CheckboxGroup>
  </NFormItem>
  <NFormItem v-else label="アウトライン">
    <NSpace vertical style="width: 100%;">
      <OutlineItemBlock
          v-for="(color, ix) in modelValue"
          :key="ix"
          :model-value="colors[ix]"
          @update:model-value="update(ix, $event)"
          @remove="remove(ix) " />
      <NButton dashed block @click="add">
        + アウトラインを追加
      </NButton>
    </NSpace>
  </NFormItem>
</template>
