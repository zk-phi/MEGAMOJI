import Button from "./Button.vue";

export default {
  title: "atoms/inputs/Button",
  component: Button,
};

const Template = (args) => ({
  components: { Button },
  data: () => args,
  template: `
    <Button :type="type" :block="block" :danger="danger">ボタン</Button>
  `,
});

export const Base = Template.bind({});
Base.args = { type: "default", danger: false, block: false };

export const Danger = Template.bind({});
Danger.args = { type: "default", danger: true, block: false };

export const Primary = Template.bind({});
Primary.args = { type: "primary", danger: false, block: false };

export const Dashed = Template.bind({});
Dashed.args = { type: "dashed", danger: false, block: false };

export const Text = Template.bind({});
Text.args = { type: "text", danger: false, block: false };

export const Block = Template.bind({});
Block.args = { type: "default", danger: false, block: true };
