import Input from "./Input.vue";

export default {
  title: "atoms/inputs/Input",
  component: Input,
};

const Template = (args) => ({
  components: { Input },
  data: () => args,
  template: `
    <Input :model-value="modelValue" :block="block" :small="small" :error="error" />
  `,
});

export const Base = Template.bind({});
Base.args = { modelValue: "", block: false, small: false, error: false };

export const Error = Template.bind({});
Error.args = { modelValue: "", block: false, small: false, error: true };

export const Block = Template.bind({});
Block.args = { modelValue: "", block: true, small: false, error: false };

export const Small = Template.bind({});
Small.args = { modelValue: "", block: false, small: true, error: false };
