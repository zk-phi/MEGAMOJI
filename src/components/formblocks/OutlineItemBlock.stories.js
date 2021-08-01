import OutlineItemBlock from "./OutlineItemBlock.vue";

export default {
  title: "molecules/text/OutlineItemBlock",
  component: OutlineItemBlock,
};

export const Base = (args) => ({
  components: { OutlineItemBlock },
  data: () => args,
  template: "<OutlineItemBlock :model-value='modelValue' />",
});
Base.args = { modelValue: "#000000" };
