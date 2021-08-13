import GradientBlock from "./GradientBlock.vue";

export default {
  title: "organisms/text/GradientBlock",
  component: GradientBlock,
};

const Template = (args) => ({
  components: { GradientBlock },
  data: () => args,
  template: `
    <GradientBlock :model-value='modelValue' :base-color='baseColor' :showDetails="showDetails" />
  `,
});

export const Base = Template.bind({});
Base.args = {
  modelValue: [
    { color: "identical", pos: 40 },
    { color: "lighter", pos: 50 },
    { color: "darker", pos: 60 },
    { color: "identical", pos: 85 },
  ],
  baseColor: "#ff0000",
  showDetails: false,
};

export const Details = Template.bind({});
Details.args = {
  modelValue: [
    { color: "identical", pos: 40 },
    { color: "lighter", pos: 50 },
    { color: "darker", pos: 60 },
    { color: "identical", pos: 85 },
  ],
  baseColor: "#ff0000",
  showDetails: true,
};
