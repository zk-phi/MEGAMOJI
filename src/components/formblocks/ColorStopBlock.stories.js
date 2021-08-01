import ColorStopBlock from "./ColorStopBlock.vue";

export default {
  title: "molecules/text/ColorStopBlock",
  component: ColorStopBlock,
};

export const Base = (args) => ({
  components: { ColorStopBlock },
  data: () => args,
  template: "<ColorStopBlock :model-value='modelValue' :baseColor='baseColor' />",
});
Base.args = { modelValue: { pos: 50, color: "darker" }, baseColor: "#ff0000" };
