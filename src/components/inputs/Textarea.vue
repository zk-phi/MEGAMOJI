<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: { type: String, default: "" },
    rows: { type: Number, required: true },
    block: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
  },
  emits: [
    "update:modelValue",
  ],
  computed: {
    className(): string {
      return `textarea${this.block ? " block" : ""}`;
    },
  },
});
</script>

<template>
  <textarea
      :rows="rows"
      :class="className"
      :value="modelValue"
      :autofocus="autofocus"
      @input="$emit('update:modelValue', $event.target.value)" />
</template>

<style scoped>
.textarea {
  display: inline-block;
  box-sizing: border-box;
  padding: var(--paddingMedium);
  font-size: var(--fontSizeMedium);
  line-height: var(--textareaLineHeight);
  color: var(--fg);
  background-color: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--borderRadius);
  outline: none;
}

.textarea:hover {
  border-color: var(--primary);
}

.textarea:focus {
  border-color: var(--primary);
  box-shadow: var(--primaryShadow);
}

.textarea:active {
  border-color: var(--primaryActive);
  box-shadow: var(--primaryShadow);
}

.block {
  display: block;
  width: 100%;
}
</style>
