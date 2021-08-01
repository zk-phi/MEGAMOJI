import GradientBlock from "./GradientBlock.vue";

export default {
  title: "organisms/text/GradientBlock",
  component: GradientBlock,
};

export const Base = (args) => ({
  components: { GradientBlock },
  data: () => args,
  template: "<GradientBlock :model-value='modelValue' :base-color='baseColor' />",
});
Base.args = {
  modelValue: [
    { color: "identical", pos: 40 },
    { color: "lighter", pos: 50 },
    { color: "darker", pos: 60 },
    { color: "identical", pos: 85 },
  ],
  baseColor: "#ff0000",
};
