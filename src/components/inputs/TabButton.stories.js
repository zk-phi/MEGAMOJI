import TabButton from "./TabButton.vue";

export default {
  title: "atoms/inputs/TabButton",
  component: TabButton,
};

const Template = (args) => ({
  components: { TabButton },
  data: () => args,
  template: `
    <TabButton :model-value="value" value="1">タブ</TabButton>
  `,
});

export const Base = Template.bind({});
Base.args = { value: "0" };

export const Selected = Template.bind({});
Selected.args = { value: "1" };
