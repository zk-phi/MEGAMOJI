import FontOption from "./FontOption.vue";

export default {
  title: "inputs/molecules/FontOption",
  component: FontOption,
};

const Template = (args) => ({
  components: { FontOption },
  data: () => args,
  template: "<FontOption :model-value='modelValue' :font='font'>ほげほげ</FontOption>",
});

export const Base = Template.bind({});
Base.args = {
  modelValue: "normal 1em sans-serif",
  font: "normal 1em serif",
};

export const Selected = Template.bind({});
Selected.args = {
  modelValue: "normal 1em sans-serif",
  font: "normal 1em sans-serif",
};
