import TonePicker from "./TonePicker.vue";

export default {
  title: "atoms/inputs/TonePicker",
  component: TonePicker,
};

export const Base = (args) => ({
  components: { TonePicker },
  data: () => ({
    h: args.defaultValue.h,
    s: args.defaultValue.s,
    v: args.defaultValue.v,
  }),
  template: `
    <TonePicker :h="h" v-model:s="s" v-model:v="v" />
  `,
});
Base.args = {
  defaultValue: { h: 100, s: 100, v: 100 },
};
