import Button from "./Button.vue";

export default {
  title: "atoms/inputs/Button",
  component: Button,
};

const Template = (args) => ({
  components: { Button },
  data: () => args,
  template: `
    <Button :type="type" :block="block">ボタン</Button>
  `,
});

export const Base = Template.bind({});
Base.args = { type: "default", block: false };

export const Primary = Template.bind({});
Primary.args = { type: "primary", block: false };

export const Dashed = Template.bind({});
Dashed.args = { type: "dashed", block: false };

export const Text = Template.bind({});
Text.args = { type: "text", block: false };

export const Block = Template.bind({});
Block.args = { type: "default", block: true };
