<script lang="ts">
import { defineComponent, PropType } from "vue";
import Popover from "../utils/Popover.vue";
import HueSlider from "./HueSlider.vue";
import TonePicker from "./TonePicker.vue";
import Space from "../global/Space.vue";
import { HEX2HWB, HWB2HEX } from "../../utils/color";

export default defineComponent({
  components: {
    Popover, HueSlider, TonePicker Space,
  },
  props: {
    el: { type: Object as PropTypes<HTMLElement>, default: null },
    show: { type: Boolean, required: true },
    onHide: { type: Function, required: true },
    modelValue: { type: String, required: true },
  },
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
  <Popover :show="show" :el="el" :on-hide="onHide">
    <div class="container">
      <Space vertical full>
        <TonePicker :h="hwb.h" v-model:w="hwb.w" v-model:b="hwb.b" :style="{ height: '180px' }" />
        <HueSlider v-model:h="hwb.h" :w="hwb.w" :b="hwb.b" />
        <slot />
      </Space>
    </div>
  </Popover>
</template>

<style scoped>
.container {
  width: 260px;
}
</style>
