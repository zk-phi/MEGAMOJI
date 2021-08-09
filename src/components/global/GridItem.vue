<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  inject: [
    "numColumns",
  ],
  props: {
    span: { type: Number, default: 1 },
  },
});
</script>

<template>
  <div :style="{ gridColumn: `span ${Math.min(numColumns(), span)}` }">
    <slot />
  </div>
</template>
