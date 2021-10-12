<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: { type: String, default: "" },
    block: { type: Boolean, default: false },
  },
  emits: [
    "update:modelValue",
  ],
  computed: {
    className(): string {
      return `input${this.block ? " block" : ""}`;
    },
  },
});
</script>

<template>
  <input
      type="text"
      :class="className"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
</template>

<style scoped>
.input {
  display: inline-block;
  box-sizing: border-box;
  padding: var(--padding);
  font-size: var(--fontSizeMedium);
  line-height: 1;
  color: var(--fg);
  background-color: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--borderRadius);
  outline: none;
}

.input:hover {
  border-color: var(--primary);
}

.input:focus {
  border-color: var(--primary);
  box-shadow: var(--primaryShadow);
}

.input:active {
  border-color: var(--primaryActive);
  box-shadow: var(--primaryShadow);
}

.block {
  display: block;
  width: 100%;
}
</style>
