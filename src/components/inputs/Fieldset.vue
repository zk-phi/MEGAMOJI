<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: { type: String, required: true },
  },
});
</script>

<template>
  <label class="title">{{ label }}</label>
  <slot />
</template>

<style scoped>
.title {
  display: block;
  margin-bottom: var(--marginMedium);
  font-size: var(--fontSizeMedium);
  font-weight: bold;
  line-height: 1;
  color: var(--fg);
}
</style>
