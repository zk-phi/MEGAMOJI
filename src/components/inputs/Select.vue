<script lang="ts">
import { defineComponent, PropType } from "vue";
import Expand from "../images/Expand.svg";

type Option = { label: string, value: unknown };

export default defineComponent({
  props: {
    modelValue: { type: Object as PropType<Option>, default: null },
    options: { type: Array as PropType<Option[]>, required: true },
    block: { type: Boolean, default: false },
    nullable: { type: Boolean, default: false },
  },
  emits: [
    "update:modelValue",
  ],
  data: () => ({
    Expand,
  }),
  computed: {
    value(): number | null {
      if (!this.modelValue) return -1;
      return this.options.findIndex((option) => option.label === this.modelValue.label);
    },
  },
  methods: {
    onChange(ix: number): void {
      if (ix === -1) {
        this.$emit("update:modelValue", null);
      } else {
        this.$emit("update:modelValue", this.options[ix]);
      }
    },
  },
});
</script>

<template>
  <select
      :class="['select', { block }]"
      :value="value"
      :style="{ backgroundImage: `url(${Expand})` }"
      @change="onChange($event.target.value)">
    <option v-if="nullable" value="-1">
      なし
    </option>
    <option v-for="(option, ix) in options" :key="ix" :value="ix">
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped>
.select {
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  appearance: none;
  display: inline-block;
  box-sizing: border-box;
  padding: var(--selectPadding);
  font-size: var(--fontSizeMedium);
  line-height: 1;
  color: var(--fg);
  cursor: pointer;
  background-color: var(--bg);
  background-repeat: no-repeat;
  background-position: right var(--marginXSmall) bottom 50%;
  background-size: var(--fontSizeXLarge);
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
