import Gradient from "./Gradient.vue";

export default {
  title: "molecules/inputs/Gradient",
  component: Gradient,
};

export const Base = (args) => ({
  components: { Gradient },
  data: () => ({
    ...args,
    value: args.initialValue,
  }),
  template: `
    <Gradient v-model="value" :base-color="baseColor" />
  `,
});
Base.args = {
  initialValue: [
    { color: "identical", pos: 40 },
    { color: "lighter", pos: 50 },
    { color: "darker", pos: 60 },
    { color: "identical", pos: 85 },
  ],
  baseColor: "#fa0",
  block: false,
};
