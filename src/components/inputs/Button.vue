<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    type: { type: String, default: "default" },
    block: { type: Boolean, default: false },
    danger: { type: Boolean, default: false },
  },
});
</script>

<template>
  <button :class="['button', type, { block, danger }]">
    <span v-if="$slots.icon" class="icon">
      <slot name="icon" />
    </span>
    <slot />
  </button>
</template>

<style scoped>
.button {
  --buttonColorBase: var(--primary);
  --buttonColorHover: var(--primaryHover);
  --buttonColorActive: var(--primaryActive);
  --buttonShadow: var(--primaryShadow);

  display: inline-block;
  box-sizing: border-box;
  padding: var(--padding);
  font-size: var(--fontSizeMedium);
  line-height: 1;
  cursor: pointer;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--borderRadius);
}

.button.danger {
  --buttonColorBase: var(--danger);
  --buttonColorHover: var(--dangerHover);
  --buttonColorActive: var(--dangerActive);
  --buttonShadow: var(--dangerShadow);
}

.icon {
  display: inline-block;
  font-size: var(--fontSizeSmallIcon);
  line-height: 0;
  vertical-align: text-bottom;
}

.block {
  display: block;
  width: 100%;
  text-align: center;
}

.default {
  color: var(--fg);
  border-color: var(--fg);
}

.default:hover {
  color: var(--buttonColorBase);
  border-color: var(--buttonColorBase);
}

.default:active {
  color: var(--buttonColorActive);
  border-color: var(--buttonColorActive);
  box-shadow: var(--buttonShadow);
}

.text {
  padding: 0;
  color: var(--fg);
}

.text:hover {
  color: var(--buttonColorBase);
}

.text:active {
  color: var(--buttonColorActive);
}

.dashed {
  color: var(--fg);
  border-color: var(--border);
  border-style: dashed;
}

.dashed:hover {
  color: var(--buttonColorBase);
  border-color: var(--buttonColorBase);
}

.dashed:active {
  color: var(--buttonColorActive);
  border-color: var(--buttonColorActive);
  box-shadow: var(--buttonShadow);
}

.primary {
  color: var(--distantFg);
  background-color: var(--buttonColorBase);
}

.primary:hover {
  background-color: var(--buttonColorHover);
}

.primary:active {
  background-color: var(--buttonColorActive);
  box-shadow: var(--buttonShadow);
}
</style>
