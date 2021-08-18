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
  padding: var(--paddingMedium);
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

.block {
  display: block;
  width: 100%;
  text-align: center;
}

.default {
  color: var(--buttonColorBase);
  border-color: var(--buttonColorBase);
}

.default:hover {
  color: var(--buttonColorHover);
  border-color: var(--buttonColorHover);
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
