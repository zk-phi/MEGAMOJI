<script lang="ts">
export default {
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
    onToggle(effect): void {
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
  <label class="checkbox">
    <input type="checkbox" :checked="checked" @change="onToggle(effect)">
    {{ effect.label }}
  </label>
</template>
