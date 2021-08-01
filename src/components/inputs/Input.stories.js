import Input from "./Input.vue";

export default {
  title: "atoms/inputs/Input",
  component: Input,
};

const Template = (args) => ({
  components: { Input },
  data: () => args,
  template: `
    <Input :model-value="modelValue" :block="block" />
  `,
});

export const Base = Template.bind({});
Base.args = { modelValue: "", block: false };

export const Block = Template.bind({});
Block.args = { modelValue: "", block: true };
