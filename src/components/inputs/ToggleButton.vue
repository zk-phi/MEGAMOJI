<script lang="ts">
import { defineComponent, PropType } from "vue";

type InputType = boolean | string | number | (string | number)[];

export default defineComponent({
  props: {
    modelValue: { type: [Boolean, String, Number, Array] as PropType<InputType>, default: null },
    value: { type: [String, Number], default: null },
  },
  emits: [
    "update:modelValue",
  ],
  computed: {
    selected(): boolean {
      if (typeof this.modelValue === "boolean") {
        return this.modelValue;
      } else if (Array.isArray(this.modelValue)) {
        return this.modelValue.findIndex((item) => item === this.value) !== -1;
      } else {
        return this.modelValue === this.value;
      }
    },
    className(): string {
      return `toggle-button ${this.selected ? " selected" : ""}`;
    },
  },
  methods: {
    toggle() {
      if (typeof this.modelValue === "boolean") {
        this.$emit("update:modelValue", !this.modelValue);
      } else if (!Array.isArray(this.modelValue)) {
        this.$emit("update:modelValue", this.value);
      } else if (this.selected) {
        this.$emit("update:modelValue", this.modelValue.filter((item: string | number) => (
          item !== this.value
        )));
      } else {
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
  font-size: var(--fontSizeMedium);
  line-height: 1;
  color: var(--fg);
  cursor: pointer;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--borderRadius);
}

.toggle-button:hover {
  border-color: var(--border);
}

.toggle-button:active {
  border-color: var(--primaryActive);
  box-shadow: var(--primaryShadow);
}

.toggle-button.selected {
  border-color: var(--primary);
}
</style>
