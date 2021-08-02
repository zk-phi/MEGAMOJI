<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    color: { type: String, required: true },
  },
});
</script>

<template>
  <span class="color-sample" :style="{ backgroundColor: color }" />
</template>

<style scoped>
.color-sample {
  display: inline-block;
  width: 1.6em;
  height: 1em;
  vertical-align: middle;
  border: 1px solid var(--border);
  border-radius: var(--borderRadiusSmall);
}
</style>
