<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: { type: String, default: null },
    style: { type: [Object, String], default: "" },
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
  padding: var(--cardPaddingV) var(--cardPaddingH);
  background-color: var(--accentBg);
  border: 1px solid var(--border);
  border-radius: var(--borderRadius);
}

.title {
  margin: 0 0 var(--marginLarge);
  font-size: var(--fontSizeLarge);
  font-weight: normal;
  color: var(--fg);
}

.footer {
  padding-top: var(--cardPaddingV);
  margin-top: var(--cardPaddingV);
  border-top: 1px solid var(--border);
}
</style>
