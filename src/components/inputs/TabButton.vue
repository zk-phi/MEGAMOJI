<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: { type: String, required: true },
    value: { type: String, default: null },
  },
  emits: [
    "update:modelValue",
  ],
  computed: {
    selected(): boolean {
      return this.modelValue === this.value;
    },
  },
});
</script>

<template>
  <button :class="['tab-button', { selected }]" @click="$emit('update:modelValue', value)">
    <slot />
  </button>
</template>

<style scoped>
.tab-button {
  display: inline-block;
  box-sizing: border-box;
  padding: 0 0 var(--paddingMinimal);
  font-size: var(--fontSizeMedium);
  color: var(--fg);
  cursor: pointer;
  background-color: transparent;
  border: 0;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.tab-button:active {
  color: var(--primaryActive);
  border-color: var(--primaryActive);
}

.tab-button.selected:not(:hover) {
  border-color: var(--border);
}
</style>
