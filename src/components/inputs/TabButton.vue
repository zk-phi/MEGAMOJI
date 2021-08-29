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
  padding: var(--tabButtonPadding);
  font-size: var(--fontSizeMedium);
  color: var(--fg);
  cursor: pointer;
  background-color: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: var(--primary);
  border-color: var(--primary);
  box-shadow: 0 1px 0 0 var(--primary)
}

.tab-button:active {
  color: var(--primaryActive);
  border-color: var(--primaryActive);
  box-shadow: 0 1px 0 0 var(--primaryActive)
}

.tab-button.selected {
  font-weight: bold;
  border-color: var(--primary);
  box-shadow: 0 1px 0 0 var(--primary)
}
</style>
