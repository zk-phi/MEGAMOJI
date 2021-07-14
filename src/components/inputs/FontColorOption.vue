<script lang="ts">
import { defineComponent } from "vue";
import { NRadio } from "naive-ui";

export default defineComponent({
  components: {
    NRadio,
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
  <NRadio :checked="modelValue === color" @change="$emit('update:modelValue', color)">
    <span :style="{ color: color === '#ffffff' ? '#000000' : color }">
      {{ color === "#ffffff" ? "♢" : "◆" }}
    </span>
  </NRadio>
</template>
