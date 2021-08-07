import TabButton from "./TabButton.vue";

export default {
  title: "atoms/inputs/TabButton",
  component: TabButton,
};

export const Base = (args) => ({
  components: { TabButton },
  data: () => ({
    value: args.initialValue,
  }),
  template: `
    <div>
      <TabButton v-model="value" value="1">タブ</TabButton>&nbsp;
      <TabButton v-model="value" value="2">タブ</TabButton>&nbsp;
      <TabButton v-model="value" value="3">タブ</TabButton>&nbsp;
      <TabButton v-model="value" value="4">タブ</TabButton>&nbsp;
      <TabButton v-model="value" value="5">タブ</TabButton>
    </div>
  `,
});
Base.args = { initialValue: "1" };
