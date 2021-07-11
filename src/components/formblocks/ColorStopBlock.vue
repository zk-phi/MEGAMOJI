<script lang="ts">
import { NButton, NColorPicker, NSlider } from "naive-ui";

export default {
  components: {
    NButton, NColorPicker, NSlider,
  },
  props: {
    modelValue: { type: Object, required: true },
  },
  emits: [
    "update:modelValue",
    "remove",
  ],
  methods: {
    changeColor(val: string): void {
      this.$emit("update:modelValue", { color: val, pos: this.modelValue.pos });
    },
    changePos(val: string): void {
      this.$emit("update:modelValue", { color: this.modelValue.color, pos: Number(val) });
    },
  },
};
</script>

<template>
  <div style="display: flex; align-items: center; width: 100%">
    <NColorPicker
        :modes="['hex']"
        :value="modelValue.color"
        :show-alpha="false"
        style="width: 128px; margin-right: 8px"
        @update:value="changeColor($event)" />
    <NSlider
        :value="modelValue.pos"
        :min="1"
        :max="100"
        style="margin-right: 8px"
        @update:value="changePos($event)" />
    <NButton ghost type="error" style="width: 16px" @click="$emit('remove')">
      x
    </NButton>
  </div>
</template>
