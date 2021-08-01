import Checkbox from "./Checkbox.vue";

export default {
  title: "atoms/inputs/Checkbox",
  component: Checkbox,
};

export const Base = () => ({
  components: { Checkbox },
  data: () => ({
    value: false,
  }),
  template: `
    <Checkbox v-model="value">ボタン</Checkbox>
  `,
});

const Template = (args) => ({
  components: { Checkbox },
  data: () => ({
    value: args.initialValue,
  }),
  template: `
    <div>
      <Checkbox v-model="value" value="1">ボタン</Checkbox>&nbsp;
      <Checkbox v-model="value" value="2">ボタン</Checkbox>&nbsp;
      <Checkbox v-model="value" value="3">ボタン</Checkbox>&nbsp;
      <Checkbox v-model="value" value="4">ボタン</Checkbox>&nbsp;
      <Checkbox v-model="value" value="5">ボタン</Checkbox>
    </div>
  `,
});

export const Radio = Template.bind({});
Radio.args = { initialValue: "1" };

export const Multiple = Template.bind({});
Multiple.args = { initialValue: ["1"] };
