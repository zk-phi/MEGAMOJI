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
    name: { type: String, default: "" },
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
  <button class="checkbox" :name="name" @click="toggle">
    <span :class="['check', { selected, radio: isRadio }]">
      <RadioCheck v-if="isRadio" />
      <Check v-else />
    </span>
    <slot />
  </button>
</template>

<style scoped>
.checkbox {
  display: inline-block;
  padding: 0;
  font-size: var(--fontSizeMedium);
  line-height: 1;
  color: var(--fg);
  cursor: pointer;
  background-color: transparent;
  border: 0;
}

.check {
  display: inline-block;
  margin-right: var(--spacingInlineSmall);
  line-height: 0;
  color: transparent;
  background-color: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--borderRadiusMicro);
}

.check.radio {
  /* +2px for borders */
  border-radius: 50%;
}

.check.selected {
  color: var(--fg);
}

.checkbox:hover {
  color: var(--primary);
}

.checkbox:hover .check {
  border-color: var(--primary);
}

.checkbox:active {
  color: var(--primaryActive);
  background-color: var(--primaryBg);
}

.checkbox:active .check {
  border-color: var(--primaryActive);
}
</style>
