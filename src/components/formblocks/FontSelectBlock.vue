<script lang="ts">
import { defineComponent } from "vue";
import FileSelect from "../inputs/FileSelect.vue";
import Checkbox from "../inputs/Checkbox.vue";
import Input from "../inputs/Input.vue";
import Fieldset from "../inputs/Fieldset.vue";
import Space from "../global/Space.vue";
import Text from "../icons/Text.vue";
import fonts, { fontStatusWatcher } from "../../constants/fonts";

const validateFont = (font: string): boolean => {
  const s = new Option().style;
  s.font = font;
  return s.font !== "";
};

export default defineComponent({
  components: {
    Checkbox, Input, Space, Fieldset, FileSelect, Text,
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
    stringIsValid: true,
    rerenderKey: 0,
  }),
  watch: {
    modelValue: {
      handler() {
        this.stringValue = this.modelValue;
        this.stringIsValid = true;
      },
    },
    stringValue: {
      handler() {
        this.stringIsValid = validateFont(this.stringValue);
        if (this.stringIsValid) {
          this.$emit("update:modelValue", this.stringValue);
        }
      },
    },
  },
  mounted() {
    fontStatusWatcher.on("load", () => {
      this.rerenderKey += 1;
    });
  },
  methods: {
    onLoadFont(font: FontFace) {
      font.load().then(() => {
        document.fonts.add(font);
        this.$emit("update:modelValue", `bold 1em ${font.family}`);
      });
    },
  },
});
</script>

<template>
  <Space :key="rerenderKey" vertical xlarge full>
    <Fieldset v-for="category in fonts" :key="category.label" :label="category.label">
      <Space vertical>
        <Checkbox
            v-for="font in category.fonts"
            :key="font.label"
            :name="font.label"
            :model-value="modelValue"
            :value="font.value"
            @update:model-value="$emit('update:modelValue', $event)">
          <span :style="{ font: font.value, lineHeight: 1 }">
            {{ font.loaded ? font.label : 'loading ...' }}
          </span>
        </Checkbox>
      </Space>
    </Fieldset>
    <Fieldset label="その他のフォント">
      <Space vertical>
        <FileSelect type="font" name="ファイルを選ぶ" @load="onLoadFont">
          <Text /> ファイルを選ぶ
        </FileSelect>
        <Input
            v-if="showDetails"
            v-model="stringValue"
            name="font-spec"
            block :error="!stringIsValid" />
      </Space>
    </Fieldset>
  </Space>
</template>
