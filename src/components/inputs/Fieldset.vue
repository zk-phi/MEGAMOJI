<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: { type: String, required: true },
  },
});
</script>

<template>
  <div class="fieldset">
    <label class="title">{{ label }}</label>
    <slot />
  </div>
</template>

<style>
.fieldset {
  padding-bottom: var(--fieldsetBottomSpacing);
}

.title {
  display: block;
  margin-bottom: var(--marginMedium);
  font-size: var(--fontSizeMedium);
  font-weight: bold;
  line-height: 1;
}
</style>
