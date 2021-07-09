<script lang="ts">
import EffectOption from "../inputs/EffectOption.vue";

export default {
  components: {
    EffectOption,
  },
  props: {
    modelValue: { type: Array, required: true },
    effects: { type: Array, required: true },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <div v-for="category in effects" :key="category.label" class="field">
    <label class="label">{{ category.label }}</label>
    <EffectOption
        v-for="effect in category.effects"
        :key="effect.label"
        :effect="effect"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)" />
  </div>
</template>
