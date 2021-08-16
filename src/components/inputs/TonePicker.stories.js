import TonePicker from "./TonePicker.vue";

export default {
  title: "atoms/inputs/TonePicker",
  component: TonePicker,
};

export const Base = (args) => ({
  components: { TonePicker },
  data: () => ({
    h: args.defaultValue.h,
    w: args.defaultValue.w,
    b: args.defaultValue.b,
  }),
  template: `
    <TonePicker :h="h" v-model:w="w" v-model:b="b" />
  `,
});
Base.args = {
  defaultValue: { h: 100, w: 0, b: 0 },
};
