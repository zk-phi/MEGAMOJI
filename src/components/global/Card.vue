<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: { type: String, default: null },
    style: { type: [Object, String], default: {} },
  },
});
</script>

<template>
  <div class="card" :style="style">
    <h3 v-if="title" class="title">
      {{ title }}
    </h3>
    <slot />
    <div v-if="$slots.footer" class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--accentBg);
  border: 1px solid var(--border);
  padding: var(--cardPaddingV) var(--cardPaddingH);
  border-radius: var(--borderRadius);
}

.title {
  color: var(--fg);
  font-size: var(--fontSizeLarge);
  margin: 0 0 var(--marginLarge);
  font-weight: normal;
}

.footer {
  margin-top: var(--cardPaddingV);
  padding-top: var(--cardPaddingV);
  border-top: 1px solid var(--border);
}
</style>
