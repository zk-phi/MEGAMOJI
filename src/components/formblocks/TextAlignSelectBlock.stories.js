import TextAlignSelectBlock from "./TextAlignSelectBlock.vue";

export default {
  title: "formblocks/molecules/TextAlignSelectBlock",
  component: TextAlignSelectBlock,
};

export const Base = (args) => ({
  components: { TextAlignSelectBlock },
  data: () => args,
  template: "<TextAlignSelectBlock :model-value='modelValue' />",
});
Base.args = { modelValue: "left" };
