import Textarea from "./Textarea.vue";

export default {
  title: "atoms/inputs/Textarea",
  component: Textarea,
};

const Template = (args) => ({
  components: { Textarea },
  data: () => args,
  template: `
    <Textarea :model-value="modelValue" :rows="rows" :block="block" />
  `,
});

export const Base = Template.bind({});
Base.args = { modelValue: "", rows: 3, block: false };

export const Block = Template.bind({});
Block.args = { modelValue: "", rows: 3, block: true };
