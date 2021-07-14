<script lang="ts">
import { defineComponent, PropType } from "vue";
import { NCheckbox } from "naive-ui";
import { absColor } from "../../utils/color";

export default defineComponent({
  components: {
    NCheckbox,
  },
  props: {
    modelValue: { type: Array as PropType<string[]>, required: true },
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
    absColor(): string {
      return absColor(this.color, this.baseColor);
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
});
</script>

<template>
  <NCheckbox :checked="checked" @update:checked="onToggle(color)">
    <span :style="{ color: absColor }">
      {{ color === "#ffffff" ? "♢" : "◆" }}
    </span>
  </NCheckbox>
</template>
