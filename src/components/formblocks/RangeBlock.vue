<script lang="ts">
import { NFormItem, NSlider } from "naive-ui";

export default {
  components: {
    NFormItem, NSlider,
  },
  props: {
    modelValue: { type: [Number, Array], required: true },
    label: { type: String, default: undefined },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    range: { type: Boolean, default: false },
    marks: { type: Object, default: undefined },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <NFormItem :label="label">
    <NSlider
        :value="modelValue"
        :min="min"
        :max="max"
        :range="range"
        :marks="marks"
        @update:value="$emit('update:modelValue', $event) "/>
  </NFormItem>
</template>
