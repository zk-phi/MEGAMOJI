<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: { type: String, required: true },
    value: { type: String, default: null },
    name: { type: String, default: "" },
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
  <button
      :class="['tab-button', { selected }]"
      :name="name"
      @click="$emit('update:modelValue', value)">
    <span v-if="$slots.icon" class="icon">
      <slot name="icon" />
    </span>
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
  background: transparent;
  border: 0;
  border-bottom: 3px solid transparent;
}

.icon {
  display: inline-block;
  font-size: var(--fontSizeSmallIcon);
  line-height: 0;
  vertical-align: text-bottom;
}

.tab-button:hover {
  color: var(--primary);
}

.tab-button:active {
  color: var(--primaryActive);
  background: linear-gradient(to bottom, transparent 0%, var(--primaryBg) 50%);
  border-color: var(--primaryBg);
}

.tab-button.selected {
  font-weight: bold;
  border-color: var(--primary);
  box-shadow: 0 1px var(--primary);
}

.tab-button.selected:active {
  border-color: var(--primaryActive);
  box-shadow: 0 1px var(--primaryActive);
}
</style>
