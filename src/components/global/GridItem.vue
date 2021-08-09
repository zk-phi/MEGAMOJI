<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    span: { type: Number, default: 1 },
  },
  inject: [
    "numColumns",
  ],
});
</script>

<template>
  <div :style="{ gridColumn: `span ${Math.min(numColumns(), span)}` }">
    <slot />
  </div>
</template>
