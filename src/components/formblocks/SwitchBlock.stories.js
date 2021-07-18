import SwitchBlock from "./SwitchBlock.vue";

export default {
  title: "formblocks/molecules/SwitchBlock",
  component: SwitchBlock,
};

export const Base = (args) => ({
  components: { SwitchBlock },
  data: () => args,
  template: "<SwitchBlock :model-value='modelValue' :label='label' />",
});
Base.args = { modelValue: true, label: "ほげほげモード" };
