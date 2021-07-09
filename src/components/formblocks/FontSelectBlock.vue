<script>
import FontOption from "../inputs/FontOption.vue";
import TextInput from "../inputs/TextInput.vue";
import fonts from "../../constants/fonts";
export default {
  props: ["modelValue", "showDetails"],
  emits: ["update:modelValue"],
  data: () => ({
    fonts,
  }),
  components: {
    FontOption, TextInput,
  },
};
</script>

<template>
  <div v-for="category in fonts" :key="category.label" class="field">
    <label class="label">{{ category.label }}</label>
    <FontOption
        v-for="font in category.fonts"
        :model-value="modelValue"
        :key="font.label"
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
