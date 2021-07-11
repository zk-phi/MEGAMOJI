<script lang="ts">
import { NCheckbox } from "naive-ui";
import { Effect } from "../../types";

type EffectOption = { label: string, fn: Effect };

export default {
  components: {
    NCheckbox,
  },
  props: {
    modelValue: { type: Array, required: true },
    effect: { type: Object, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  computed: {
    checked(): boolean {
      return this.modelValue.some((eff) => eff.label === this.effect.label);
    },
  },
  methods: {
    onToggle(effect: EffectOption): void {
      if (this.checked) {
        this.$emit("update:modelValue", this.modelValue.filter((eff) => (
          eff.label !== effect.label
        )));
      } else {
        this.$emit("update:modelValue", [...this.modelValue, effect]);
      }
    },
  },
};
</script>

<template>
  <NCheckbox :checked="checked" @update:checked="onToggle(effect)">
    {{ effect.label }}
  </NCheckbox>
</template>
