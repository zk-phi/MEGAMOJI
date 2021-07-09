<script lang="ts">
import FontOption from "../inputs/FontOption.vue";
import TextInput from "../inputs/TextInput.vue";
import fonts from "../../constants/fonts";

export default {
  components: {
    FontOption, TextInput,
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
  <div v-if="showDetails" class="field">
    <label class="label">その他のフォント</label>
    <TextInput
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)" />
  </div>
</template>
