import NumberBlock from "./NumberBlock.vue";

export default {
  title: "formblocks/molecules/NumberBlock",
  component: NumberBlock,
};

export const Base = (args) => ({
  components: { NumberBlock },
  data: () => args,
  template: "<NumberBlock :model-value='modelValue' :label='label' :min='min' />",
});
Base.args = { modelValue: 100, label: "数", min: 1 };
