<script lang="ts">
import { defineComponent, PropType } from "vue";
import Popover from "../global/Popover.vue";
import HueSlider from "./HueSlider.vue";
import TonePicker from "./TonePicker.vue";
import Space from "../global/Space.vue";
import { HEX2HSV, HSV2HEX } from "../../utils/color";

export default defineComponent({
  components: {
    Popover, HueSlider, TonePicker, Space,
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
    value: props.modelValue,
    hsv: HEX2HSV(props.modelValue),
    reset: false,
    showPopover: false,
  }),
  watch: {
    modelValue: {
      handler() {
        if (this.modelValue !== this.value) {
          this.value = this.modelValue;
          this.hsv = HEX2HSV(this.modelValue);
          this.reset = true;
        }
      },
    },
    hsv: {
      handler() {
        if (this.reset) {
          this.reset = false;
          return;
        }
        this.value = HSV2HEX(this.hsv);
        this.$emit("update:modelValue", this.value);
      },
      deep: true,
    },
  },
  methods: {
    hidePopover(): void {
      this.showPopover = false;
    },
  },
});
</script>

<template>
  <Popover :show="show" :el="el" :on-hide="onHide" :style="{ width: '260px' }">
    <Space vertical full>
      <TonePicker v-model:s="hsv.s" v-model:v="hsv.v" :h="hsv.h" :style="{ height: '180px' }" />
      <HueSlider v-model:h="hsv.h" />
      <slot />
    </Space>
  </Popover>
</template>
