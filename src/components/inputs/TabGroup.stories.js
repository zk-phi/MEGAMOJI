import TabGroup from "./TabGroup.vue";
import TabButton from "./TabButton.vue";

export default {
  title: "atoms/inputs/TabGroup",
  component: TabGroup,
};

export const Base = () => ({
  components: { TabGroup, TabButton },
  data: () => ({
    value: "1",
  }),
  template: `
    <TabGroup>
      <TabButton v-model="value" :value="1">1</TabButton>
      <TabButton v-model="value" :value="2">2</TabButton>
      <TabButton v-model="value" :value="3">3</TabButton>
      <TabButton v-model="value" :value="4">4</TabButton>
    </TabGroup>
  `,
});
