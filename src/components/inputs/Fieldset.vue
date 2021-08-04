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
  font-size: var(--fontSizeMedium);
  display: block;
  font-weight: bold;
  line-height: 1;
  margin-bottom: var(--marginMedium);
}
</style>
