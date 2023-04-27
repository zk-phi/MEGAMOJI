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
  --buttonColorBg: var(--primaryBg);
  --buttonShadow: var(--primaryShadow);
  --buttonPressableShadow: var(--pressableShadowPrimary);
  --buttonPressableShadowHover: var(--pressableShadowPrimaryHover);

  display: inline-block;
  font-size: var(--fontSizeMedium);
  line-height: 1;
  cursor: pointer;
}

.button.danger {
  --buttonColorBase: var(--danger);
  --buttonColorHover: var(--dangerHover);
  --buttonColorActive: var(--dangerActive);
  --buttonColorBg: var(--dangerBg);
  --buttonShadow: var(--dangerShadow);
  --buttonPressableShadow: var(--pressableShadowDanger);
  --buttonPressableShadowHover: var(--pressableShadowDangerHover);
}

.block {
  display: block;
  width: 100%;
  text-align: center;
}

.icon {
  display: inline-block;
  font-size: var(--fontSizeSmallIcon);
  line-height: 0;
  vertical-align: -0.05em;
}

.default {
  padding: var(--padding);
  color: var(--fg);
  background-color: var(--bg);
  border: 1px solid var(--fg);
  border-radius: var(--borderRadius);
  box-shadow: var(--pressableShadowDefault);
  transform: translateY(-1px);
}

.default:hover {
  color: var(--buttonColorBase);
  border-color: var(--buttonColorBase);
  box-shadow: var(--buttonPressableShadow);
}

.default:active {
  box-shadow: none;
  transform: none;
}

.text {
  padding: 0;
  color: var(--fg);
  background-color: transparent;
  border: 0;
  border-bottom: 1px dotted currentColor;
  border-radius: 0;
}

.text:hover {
  color: var(--buttonColorBase);
}

.text:active {
  color: var(--buttonColorActive);
  background-color: var(--buttonColorBg);
}

.dashed {
  padding: var(--padding);
  color: var(--fg);
  background-color: transparent;
  border: 1px dashed var(--border);
  border-radius: var(--borderRadius);
}

.dashed:hover {
  color: var(--buttonColorBase);
  border-color: var(--buttonColorBase);
}

.dashed:active {
  color: var(--buttonColorActive);
  background-color: var(--buttonColorBg);
  border-color: var(--buttonColorActive);
}

.primary {
  padding: var(--padding);
  color: var(--distantFg);
  background-color: var(--buttonColorBase);
  border: 1px solid var(--buttonColorBase);
  border-radius: var(--borderRadius);
  box-shadow: var(--buttonPressableShadow);
  transform: translateY(-1px);
}

.primary:hover {
  background-color: var(--buttonColorHover);
  border-color: var(--buttonColorHover);
  box-shadow: var(--buttonPressableShadowHover);
}

.primary:active {
  box-shadow: none;
  transform: none;
}
</style>
