import AnimationSelectBlock from "./AnimationSelectBlock.vue";

export default {
  title: "formblocks/molecules/AnimationSelectBlock",
  component: AnimationSelectBlock,
};

export const Base = (args) => ({
  components: { AnimationSelectBlock },
  data: () => args,
  template: "<AnimationSelectBlock :model-value='modelValue' />",
});
Base.args = { modelValue: null };
