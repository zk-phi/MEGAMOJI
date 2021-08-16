import Color from "./Color.vue";

export default {
  title: "molecules/inputs/Color",
  component: Color,
};

const Template = (args) => ({
  components: { Color },
  data: () => args,
  template: `
    <Color :model-value="modelValue" :block="block" />
  `,
});

export const Base = Template.bind({});
Base.args = { modelValue: "#ff0000", block: false };

export const Block = Template.bind({});
Block.args = { modelValue: "#ff0000", block: true };
