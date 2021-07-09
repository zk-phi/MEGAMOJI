<script lang="ts">
import TextBlock from "./TextBlock.vue";
import FontOption from "../inputs/FontOption.vue";
import fonts from "../../constants/fonts";

export default {
  components: {
    FontOption, TextBlock,
  },
  props: {
    modelValue: { type: String, required: true },
    showDetails: { type: Boolean, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  data: (): Record<string, unknown> => ({
    fonts,
  }),
};
</script>

<template>
  <div v-for="category in fonts" :key="category.label" class="field">
    <label class="label">{{ category.label }}</label>
    <FontOption
        v-for="font in category.fonts"
        :key="font.label"
        :model-value="modelValue"
        :font="font.value"
        @update:model-value="$emit('update:modelValue', $event)">
      {{ font.label }}
    </FontOption>
  </div>
  <TextBlock
      v-if="showDetails"
      label="その他のフォント"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)" />
</template>
