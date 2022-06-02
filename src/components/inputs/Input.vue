<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: { type: String, default: "" },
    block: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
  },
  emits: [
    "update:modelValue",
  ],
});
</script>

<template>
  <input
      type="text"
      :class="['input', { block, error, small }]"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
</template>

<style scoped>
.input {
  --inputColorBase: var(--border);
  --inputColorHover: var(--primary);
  --inputColorActive: var(--primaryActive);
  --inputColorShadow: var(--primaryShadow);
  display: inline-block;
  box-sizing: border-box;
  padding: var(--padding);
  font-size: var(--fontSizeMedium);
  line-height: 1;
  color: var(--fg);
  background-color: var(--bg);
  border: 1px solid var(--inputColorBase);
  border-radius: var(--borderRadius);
  outline: none;
}

.error {
  --inputColorBase: var(--danger);
  --inputColorHover: var(--dangerHover);
  --inputColorActive: var(--dangerActive);
  --inputColorShadow: var(--dangerShadow);
}

.small {
  padding: var(--paddingMinimal);
}

.input:hover {
  border-color: var(--inputColorHover);
}

.input:focus {
  border-color: var(--inputColorHover);
  box-shadow: var(--inputColorShadow);
}

.input:active {
  border-color: var(--inputColorActive);
  box-shadow: var(--inputColorShadow);
}

.block {
  display: block;
  width: 100%;
}
</style>
