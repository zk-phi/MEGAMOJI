import Select from "./Select.vue";

export default {
  title: "atoms/inputs/Select",
  component: Select,
};

const options = [
  { label: "ほげ", value: "hoge" },
  { label: "ふが", value: "fuga" },
  { label: "ぴよ", value: "piyo" },
];

const Template = (args) => ({
  components: { Select },
  data: () => args,
  template: `
    <Select :model-value="modelValue" :options="options" :block="block" :nullable="nullable" />
  `,
});

export const Base = Template.bind({});
Base.args = {
  modelValue: options[1],
  options,
  block: false,
  nullable: false,
};

export const Nullable = Template.bind({});
Nullable.args = {
  modelValue: null,
  options,
  block: false,
  nullable: true,
};

export const Block = Template.bind({});
Block.args = {
  modelValue: options[1],
  options,
  block: true,
  nullable: false,
};
