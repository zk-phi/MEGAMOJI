<script lang="ts">
import { NSpace, NFormItem } from "naive-ui";
import TextBlock from "./TextBlock.vue";
import FontOption from "../inputs/FontOption.vue";
import fonts from "../../constants/fonts";

export default {
  components: {
    FontOption, TextBlock, NSpace, NFormItem,
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
  <NFormItem v-for="category in fonts" :key="category.label" :label="category.label">
    <NSpace vertical>
      <FontOption
          v-for="font in category.fonts"
          :key="font.label"
          :model-value="modelValue"
          :font="font.value"
          @update:model-value="$emit('update:modelValue', $event)">
        {{ font.label }}
      </FontOption>
    </NSpace>
  </NFormItem>
  <TextBlock
      v-if="showDetails"
      label="その他のフォント"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)" />
</template>
