<script lang="ts">
import { defineComponent, PropType } from "vue";
import { absColor } from "../../utils/color";
import ToggleButton from "./ToggleButton.vue";
import ColorSample from "../global/ColorSample.vue";

export default defineComponent({
  components: {
    ToggleButton, ColorSample,
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
  <ToggleButton
      :model-value="modelValue"
      :value="color"
      @update:model-value="$emit('update:modelValue', $event)">
    <ColorSample :color="absColor" />
  </ToggleButton>
</template>
