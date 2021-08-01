<script lang="ts">
import { defineComponent } from "vue";
import { NSpace, NFormItem } from "naive-ui";
import TextBlock from "./TextBlock.vue";
import Checkbox from "../inputs/Checkbox.vue";
import fonts from "../../constants/fonts";

export default defineComponent({
  components: {
    Checkbox, TextBlock, NSpace, NFormItem,
  },
  props: {
    modelValue: { type: String, required: true },
    showDetails: { type: Boolean, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  data() {
    return {
      fonts,
    };
  },
});
</script>

<template>
  <NFormItem v-for="category in fonts" :key="category.label" :label="category.label">
    <NSpace vertical>
      <Checkbox
          v-for="font in category.fonts"
          :key="font.label"
          :model-value="modelValue"
          :value="font.value"
          @update:model-value="$emit('update:modelValue', $event)">
        <span :style="{ font: font.value }">{{ font.label }}</span>
      </Checkbox>
    </NSpace>
  </NFormItem>
  <TextBlock
      v-if="showDetails"
      label="その他のフォント"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)" />
</template>
