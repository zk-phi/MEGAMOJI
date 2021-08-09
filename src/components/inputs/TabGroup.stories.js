import TabGroup from "./TabGroup.vue";
import TabButton from "./TabButton.vue";

export default {
  title: "molecules/inputs/TabGroup",
  component: TabGroup,
};

export const Base = () => ({
  components: { TabGroup, TabButton },
  data: () => ({
    value: 1,
  }),
  template: `
    <TabGroup>
      <TabButton v-model="value" :value="1">タブ</TabButton>
      <TabButton v-model="value" :value="2">タブ</TabButton>
      <TabButton v-model="value" :value="3">タブ</TabButton>
      <TabButton v-model="value" :value="4">タブ</TabButton>
    </TabGroup>
  `,
});
