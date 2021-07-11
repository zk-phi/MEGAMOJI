<script lang="ts">
import EffectOption from "../inputs/EffectOption.vue";
import CheckboxGroup from "../inputs/CheckboxGroup.vue";
import { NFormItem } from "naive-ui";

export default {
  components: {
    NFormItem, EffectOption, CheckboxGroup,
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
  <NFormItem v-for="category in effects" :label="category.label">
    <CheckboxGroup>
      <EffectOption
          v-for="effect in category.effects"
          :key="effect.label"
          :effect="effect"
          :model-value="modelValue"
          @update:model-value="$emit('update:modelValue', $event)" />
    </CheckboxGroup>
  </NFormItem>
</template>
