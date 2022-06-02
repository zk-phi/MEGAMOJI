<script lang="ts">
import { defineComponent } from "vue";
import Checkbox from "../inputs/Checkbox.vue";
import Input from "../inputs/Input.vue";
import Fieldset from "../inputs/Fieldset.vue";
import Space from "../global/Space.vue";
import fonts from "../../constants/fonts";

const validateFont = (font: string): boolean => {
  const s = new Option().style;
  s.font = font;
  return s.font !== "";
}

export default defineComponent({
  components: {
    Checkbox, Input, Space, Fieldset,
  },
  props: {
    modelValue: { type: String, required: true },
    showDetails: { type: Boolean, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  data: (props) => ({
    fonts,
    stringValue: props.modelValue,
  }),
  watch: {
    stringValue: {
      handler() {
        if (validateFont(this.stringValue)) {
          this.$emit("update:modelValue", this.stringValue);
        }
      }
    }
  },
});
</script>

<template>
  <Space vertical xlarge full>
    <Fieldset v-for="category in fonts" :key="category.label" :label="category.label">
      <Space vertical>
        <Checkbox
            v-for="font in category.fonts"
            :key="font.label"
            :model-value="modelValue"
            :value="font.value"
            @update:model-value="$emit('update:modelValue', $event)">
          <span :style="{ font: font.value }">{{ font.label }}</span>
        </Checkbox>
      </Space>
    </Fieldset>
    <Fieldset v-if="showDetails" label="その他のフォント">
      <Input block v-model="stringValue" />
    </Fieldset>
  </Space>
</template>
