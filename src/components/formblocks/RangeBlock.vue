<script lang="ts">
import { defineComponent } from "vue";
import { NFormItem, NSlider } from "naive-ui";

export default defineComponent({
  components: {
    NFormItem, NSlider,
  },
  props: {
    modelValue: { type: [Number, Array], required: true },
    label: { type: String, default: undefined },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    range: { type: Boolean, default: false },
    step: { type: Number, default: 1 },
    marks: { type: Object, default: undefined },
  },
  emits: [
    "update:modelValue",
  ],
});
</script>

<template>
  <NFormItem :label="label">
    <NSlider
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :range="range"
        :marks="marks"
        @update:value="$emit('update:modelValue', $event) " />
  </NFormItem>
</template>
