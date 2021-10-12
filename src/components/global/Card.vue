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
    <div class="content">
      <h3 v-if="title" class="title">
        {{ title }}
      </h3>
      <slot />
    </div>
    <div v-if="$slots.footer" class="footer">
      <slot name="footer" />
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
  margin: 0 0 var(--spacingLarge);
  font-size: var(--fontSizeXLarge);
  font-weight: bold;
  color: var(--fg);
}

.footer {
  padding: var(--spacingXLarge);
  border-top: 1px solid var(--border);
}
</style>
