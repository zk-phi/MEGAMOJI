<script lang="ts">
import { defineComponent } from "vue";
import ToggleButton from "./ToggleButton.vue";
import ColorSample from "../global/ColorSample.vue";

export default defineComponent({
  components: {
    ToggleButton, ColorSample,
  },
  props: {
    modelValue: { type: String, required: true },
    color: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
});
</script>

<template>
  <ToggleButton
      :model-value="modelValue"
      :value="color"
      @update:model-value="$emit('update:modelValue', $event)">
    <ColorSample :color="color" />
  </ToggleButton>
</template>
