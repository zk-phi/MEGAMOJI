<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    modelValue: { type: Object as PropType<{ label: string }>, default: null },
    options: { type: Array as PropType<{ label: string }>, required: true },
    block: { type: Boolean, default: false },
    nullable: { type: Boolean, default: false },
  },
  emits: [
    "update:modelValue",
  ],
  computed: {
    className(): string {
      return `select ${this.block ? " block" : ""}`;
    },
    value(): number {
      if (!this.modelValue) return "null";
      return this.options.findIndex((option) => option.label === this.modelValue.label);
    },
  },
  methods: {
    onChange(ix): void {
      if (ix === "null") {
        this.$emit("update:modelValue", null);
      } else {
        this.$emit("update:modelValue", this.options[ix]);
      }
    },
  },
});
</script>

<template>
  <select :class="className" :value="value" @change="onChange($event.target.value)">
    <option v-if="nullable" value="null">
      なし
    </option>
    <option v-for="(option, ix) in options" :key="ix" :value="ix">
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped>
.select {
  display: inline-block;
  box-sizing: border-box;
  padding: var(--paddingSmall);
  font-size: var(--fontSizeMedium);
  line-height: 1;
  border: 1px solid var(--border);
  border-radius: var(--borderRadius);
  outline: none;
}

.select:hover {
  border-color: var(--primary);
}

.select:focus {
  border-color: var(--primary);
  box-shadow: var(--primaryShadow);
}

.select:active {
  border-color: var(--primaryActive);
  box-shadow: var(--primaryShadow);
}

.block {
  display: block;
  width: 100%;
}
</style>
