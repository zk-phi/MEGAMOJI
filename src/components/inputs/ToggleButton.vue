<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: { type: undefined, required: true },
    value: { type: undefined, default: null },
    size: { type: String, default: "default" },
  },
  emits: [
    "update:modelValue",
  ],
  computed: {
    selected(): boolean {
      if (typeof this.modelValue === "boolean") { // toggle
        return this.modelValue;
      } else if (Array.isArray(this.modelValue)) { // multiple
        return this.modelValue.findIndex((item) => item === this.value) !== -1;
      } else { // radio
        return this.modelValue === this.value;
      }
    },
    className(): string {
      return `toggle-button ${this.size}${this.selected ? " selected" : ""}`;
    },
  },
  methods: {
    toggle() {
      if (typeof this.modelValue === "boolean") { // toggle
        this.$emit("update:modelValue", !this.modelValue);
      } else if (!Array.isArray(this.modelValue)) { // radio
        this.$emit("update:modelValue", this.value);
      } else if (this.selected) { // multiple (selected)
        this.$emit("update:modelValue", this.modelValue.filter((item: unknown) => (
          item !== this.value
        )));
      } else { // multiple (not selected)
        this.$emit("update:modelValue", [...this.modelValue, this.value]);
      }
    },
  },
});
</script>

<template>
  <button :class="className" @click="toggle">
    <slot />
  </button>
</template>

<style scoped>
.toggle-button {
  display: inline-block;
  box-sizing: border-box;
  padding: var(--paddingMinimal);
  color: var(--fg);
  cursor: pointer;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--borderRadius);
}

.small {
  font-size: var(--fontSizeMedium);
  line-height: 1;
}

.default {
  padding: var(--paddingMedium);
  font-size: var(--fontSizeMedium);
  line-height: 1;
}

.tab {
  border: 0;
  border-bottom: 2px solid transparent;
  border-radius: 0;
}

.toggle-button.tab:active {
  box-shadow: none;
}

.icon {
  font-size: var(--fontSizeIcon);
  line-height: 0;
}

.part {
  font-size: var(--fontSizePart);
  line-height: 0;
}

.toggle-button:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.toggle-button:active {
  color: var(--primaryActive);
  border-color: var(--primaryActive);
  box-shadow: var(--primaryShadow);
}

.toggle-button.selected:not(:hover) {
  border-color: var(--border);
}
</style>
