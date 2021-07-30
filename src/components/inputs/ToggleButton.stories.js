import ToggleButton from "./ToggleButton.vue";

export default {
  title: "atoms/inputs/ToggleButton",
  component: ToggleButton,
};

export const Base = () => ({
  components: { ToggleButton },
  data: () => ({
    value: false,
  }),
  template: `
    <ToggleButton v-model="value">ボタン</ToggleButton>
  `,
});

const Template = (args) => ({
  components: { ToggleButton },
  data: () => ({
    value: args.initialValue,
  }),
  template: `
    <div>
      <ToggleButton v-model="value" value="1">ボタン</ToggleButton>&nbsp;
      <ToggleButton v-model="value" value="2">ボタン</ToggleButton>&nbsp;
      <ToggleButton v-model="value" value="3">ボタン</ToggleButton>&nbsp;
      <ToggleButton v-model="value" value="4">ボタン</ToggleButton>&nbsp;
      <ToggleButton v-model="value" value="5">ボタン</ToggleButton>
    </div>
  `,
});

export const Radio = Template.bind({});
Radio.args = { initialValue: "1" };

export const Multiple = Template.bind({});
Multiple.args = { initialValue: ["1"] };
