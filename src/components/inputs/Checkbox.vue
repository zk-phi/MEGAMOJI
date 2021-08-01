<script lang="ts">
import { defineComponent } from "vue";
import Check from "../icons/Check.vue";
import RadioCheck from "../icons/RadioCheck.vue";

export default defineComponent({
  components: {
    Check, RadioCheck,
  },
  props: {
    modelValue: { type: undefined, required: true },
    value: { type: undefined, default: null },
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
    isRadio(): boolean {
      return typeof this.modelValue !== "boolean" && !Array.isArray(this.modelValue);
    },
    className(): string {
      return `check ${this.isRadio ? " radio" : ""}${this.selected ? " selected" : ""}`;
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
  <button class="checkbox" @click="toggle">
    <span :class="className">
      <RadioCheck v-if="isRadio" />
      <Check v-else />
    </span>
    <slot />
  </button>
</template>

<style scoped>
.checkbox {
  display: inline-block;
  color: var(--fg);
  cursor: pointer;
  line-height: 1;
  background-color: transparent;
  border: 0;
}

.check {
  color: transparent;
  display: inline-block;
  border: 1px solid var(--border);
  border-radius: var(--borderRadiusSmall);
  font-size: var(--fontSizeMedium);
  margin-right: var(--marginSmall);
  line-height: 0;
}

.check.radio {
  border-radius: calc((var(--fontSizeMedium) + var(--paddingMinimal)) / 2);
}

.check.selected {
  color: var(--fg);
}

.checkbox:hover {
  color: var(--primary);
}

.checkbox:active {
  color: var(--primaryActive);
}
</style>
