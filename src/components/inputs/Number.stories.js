import Number from "./Number.vue";

export default {
  title: "atoms/inputs/Number",
  component: Number,
};

const Template = (args) => ({
  components: { Number },
  data: () => args,
  template: `
    <Number :model-value="modelValue" :block="block" />
  `,
});

export const Base = Template.bind({});
Base.args = {
  modelValue: 1,
  block: false,
};

export const Block = Template.bind({});
Block.args = {
  modelValue: 1,
  block: true,
};
