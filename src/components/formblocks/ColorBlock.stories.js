import ColorBlock from "./ColorBlock.vue";

export default {
  title: "formblocks/molecules/ColorBlock",
  component: ColorBlock,
};

export const Base = (args) => ({
  components: { ColorBlock },
  data: () => args,
  template: "<ColorBlock :model-value='modelValue' :label='label' />",
});
Base.args = { modelValue: "#ff0000", label: "Foo" };
