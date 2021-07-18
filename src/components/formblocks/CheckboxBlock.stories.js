import CheckboxBlock from "./CheckboxBlock.vue";

export default {
  title: "formblocks/molecules/CheckboxBlock",
  component: CheckboxBlock,
};

export const Base = (args) => ({
  components: { CheckboxBlock },
  data: () => args,
  template: "<CheckboxBlock :model-value='modelValue' :label='label'>Checkbox</CheckboxBlock>",
});
Base.args = { modelValue: false, label: "Foo" };
