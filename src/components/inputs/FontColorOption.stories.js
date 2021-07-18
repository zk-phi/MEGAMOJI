import FontColorOption from "./FontColorOption.vue";

export default {
  title: "inputs/molecules/FontColorOption",
  component: FontColorOption,
};

const Template = (args) => ({
  components: { FontColorOption },
  data: () => args,
  template: "<FontColorOption :model-value='modelValue' :color='color' />",
});

export const Base = Template.bind({});
Base.args = { modelValue: "#ff0000", color: "#000000" };

export const Selected = Template.bind({});
Selected.args = { modelValue: "#ff0000", color: "#ff0000" };
