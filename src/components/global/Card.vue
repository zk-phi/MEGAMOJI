<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: { type: String, default: null },
  },
});
</script>

<template>
  <div class="card">
    <div class="content">
      <h3 v-if="title" class="title">
        {{ title }}
      </h3>
      <slot />
    </div>
    <div v-if="$slots.footer" class="footer">
      <div class="footer-content">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--accentBg);
  border: 1px solid var(--border);
  border-radius: var(--borderRadius);
}

.content {
  padding: var(--spacingXLarge);
}

.title {
  margin: 0 0 var(--spacingXLarge);
  font-size: var(--fontSizeXLarge);
  font-weight: bold;
  color: var(--fg);
}

.footer {
  text-align: right;
}

.footer-content {
  display: inline-block;
  padding: var(--spacingMedium);
  border-top: 1px dotted var(--border);
  border-left: 1px dotted var(--border);
  border-top-left-radius: var(--borderRadius);
}
</style>
