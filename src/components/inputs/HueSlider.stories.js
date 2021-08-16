import HueSlider from "./HueSlider.vue";

export default {
  title: "atoms/inputs/HueSlider",
  component: HueSlider,
};

export const Base = (args) => ({
  components: { HueSlider },
  data: () => ({
    h: args.defaultValue.h,
    w: args.defaultValue.w,
    b: args.defaultValue.b,
  }),
  template: `
    <HueSlider v-model:h="h" :w="0" :b="0" />
  `,
});
Base.args = {
  defaultValue: { h: 100, w: 0, b: 0 },
};
