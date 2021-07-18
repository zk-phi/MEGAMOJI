import TextBlock from "./TextBlock.vue";

export default {
  title: "formblocks/molecules/TextBlock",
  component: TextBlock,
};

export const Base = (args) => ({
  components: { TextBlock },
  data: () => args,
  template: "<TextBlock :model-value='modelValue' :label='label' />",
});
Base.args = { modelValue: "", label: "テキスト入力" };
