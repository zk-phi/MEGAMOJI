import TextAreaBlock from "./TextAreaBlock.vue";

export default {
  title: "formblocks/molecules/TextAreaBlock",
  component: TextAreaBlock,
};

export const Base = (args) => ({
  components: { TextAreaBlock },
  data: () => args,
  template: "<TextAreaBlock :model-value='modelValue' :label='label' :rows='rows' />",
});
Base.args = { modelValue: "", label: "テキスト入力", rows: 3 };
