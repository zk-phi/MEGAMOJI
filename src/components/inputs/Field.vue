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
  margin-right: var(--spacingMedium);
  font-size: var(--fontSizeMedium);
  line-height: 1;
  color: var(--fg);
}
</style>
