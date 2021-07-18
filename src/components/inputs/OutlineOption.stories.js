import OutlineOption from "./OutlineOption.vue";

export default {
  title: "inputs/molecules/OutlineOption",
  component: OutlineOption,
};

const Template = (args) => ({
  components: { OutlineOption },
  data: () => args,
  template: "<OutlineOption :model-value='modelValue' :color='color' :base-color='baseColor' />",
});

export const Base = Template.bind({});
Base.args = { modelValue: ["darker"], color: "identical", baseColor: "#ff0000" };

export const Selected = Template.bind({});
Selected.args = { modelValue: ["darker"], color: "darker", baseColor: "#ff0000" };
