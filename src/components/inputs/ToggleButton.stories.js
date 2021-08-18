import ToggleButton from "./ToggleButton.vue";

export default {
  title: "atoms/inputs/ToggleButton",
  component: ToggleButton,
};

const Single = (args) => ({
  components: { ToggleButton },
  data: () => ({
    ...args,
    value: false,
  }),
  template: `
    <ToggleButton v-model="value" :size="size">ボタン</ToggleButton>
  `,
});

export const Base = Single.bind({});
Base.args = { size: undefined };

const Multiple = (args) => ({
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

export const Radio = Multiple.bind({});
Radio.args = { initialValue: "1" };

export const Check = Multiple.bind({});
Check.args = { initialValue: ["1"] };
