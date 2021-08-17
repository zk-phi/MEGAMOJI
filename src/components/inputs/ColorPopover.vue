<script lang="ts">
import { defineComponent, PropType } from "vue";
import Popover from "../global/Popover.vue";
import HueSlider from "./HueSlider.vue";
import TonePicker from "./TonePicker.vue";
import Space from "../global/Space.vue";
import { HEX2HWB, HWB2HEX } from "../../utils/color";

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
    hwb: HEX2HWB(props.modelValue),
    reset: false,
    showPopover: false,
  }),
  watch: {
    modelValue: {
      handler() {
        if (this.modelValue !== this.value) {
          this.value = this.modelValue;
          this.hwb = HEX2HWB(this.modelValue);
          this.reset = true;
        }
      },
    },
    hwb: {
      handler() {
        if (this.reset) {
          this.reset = false;
          return;
        }
        this.value = HWB2HEX(this.hwb);
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
      <TonePicker v-model:w="hwb.w" v-model:b="hwb.b" :h="hwb.h" :style="{ height: '180px' }" />
      <HueSlider v-model:h="hwb.h" :w="hwb.w" :b="hwb.b" />
      <slot />
    </Space>
  </Popover>
</template>
