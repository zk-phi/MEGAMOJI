<script lang="ts">
import { NRadio } from "naive-ui";

export default {
  components: {
    NRadio,
  },
  props: {
    modelValue: { type: String, required: true },
    font: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <NRadio :checked="modelValue === font" @update:checked="$emit('update:modelValue', font)">
    <span :style="{ font: font }"><slot /></span>
  </NRadio>
</template>
