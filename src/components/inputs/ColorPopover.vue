<script lang="ts">
import { defineComponent, PropType } from "vue";
import Popover from "../global/Popover.vue";
import HueSlider from "./HueSlider.vue";
import TonePicker from "./TonePicker.vue";
import Input from "./Input.vue";
import Space from "../global/Space.vue";
import { HEX2HSV, HSV2HEX } from "../../utils/color";

const validateColor = (color: string): boolean => {
  const s = new Option().style;
  s.color = color;
  return s.color !== "";
};

export default defineComponent({
  components: {
    Popover, HueSlider, TonePicker, Input, Space,
  },
  props: {
    el: { type: Object as PropType<HTMLElement>, default: null },
    show: { type: Boolean, required: true },
    onHide: { type: Function, required: true },
    modelValue: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  data: (props) => ({
    hsv: HEX2HSV(props.modelValue),
    stringValue: props.modelValue,
    stringIsValid: true,
    showPopover: false,
  }),
  watch: {
    modelValue: {
      handler() {
        if (this.modelValue.match(/^#/)) {
          this.hsv = HEX2HSV(this.modelValue);
        }
        this.stringValue = this.modelValue;
        this.stringIsValid = true;
      },
    },
    hsv: {
      handler() {
        this.$emit("update:modelValue", HSV2HEX(this.hsv));
      },
      deep: true,
    },
    stringValue: {
      handler() {
        this.stringIsValid = validateColor(this.stringValue);
        if (this.stringIsValid) {
          this.$emit("update:modelValue", this.stringValue);
        }
      },
    },
  },
  methods: {
    hidePopover(): void {
      this.showPopover = false;
    },
    refreshStyle(): void {
      (this.$refs.popover as Popover).refreshStyle();
    },
  },
});
</script>

<template>
  <Popover ref="popover" :show="show" :el="el" :on-hide="onHide" :style="{ width: '260px' }">
    <Space vertical full>
      <TonePicker v-model="hsv" :style="{ height: '180px' }" />
      <HueSlider v-model="hsv" />
      <Input v-model="stringValue" block small :error="!stringIsValid" />
      <slot />
    </Space>
  </Popover>
</template>
