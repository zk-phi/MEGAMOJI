<script lang="ts">
import { NCheckbox } from "naive-ui";
import { darkerColor, lighterColor } from "../../utils/color";

export default {
  components: {
    NCheckbox,
  },
  props: {
    modelValue: { type: Array, required: true },
    color: { type: String, required: true },
    baseColor: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  computed: {
    checked(): boolean {
      return this.modelValue.includes(this.color);
    },
    iconColor(): string {
      if (this.color === "#ffffff") {
        return "#000000";
      } else if (this.color === "identical") {
        return this.baseColor;
      } else if (this.color === "darker") {
        return darkerColor(this.baseColor);
      } else if (this.color === "lighter") {
        return lighterColor(this.baseColor);
      } else {
        return this.color;
      }
    },
  },
  methods: {
    onToggle(color: string): void {
      if (this.checked) {
        this.$emit("update:modelValue", this.modelValue.filter((c) => c !== color));
      } else {
        this.$emit("update:modelValue", [...this.modelValue, color]);
      }
    },
  },
};
</script>

<template>
  <NCheckbox :checked="checked" @update:checked="onToggle(color)">
    <span :style="{ color: iconColor }">
      {{ color === "#ffffff" ? "♢" : "◆" }}
    </span>
  </NCheckbox>
</template>
