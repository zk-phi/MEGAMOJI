import SelectBlock from "./SelectBlock.vue";

export default {
  title: "formblocks/molecules/SelectBlock",
  component: SelectBlock,
};

export const Base = (args) => ({
  components: { SelectBlock },
  data: () => args,
  template: "<SelectBlock :model-value='modelValue' :label='label' :options='options' />",
});
Base.args = {
  modelValue: 20,
  label: "選択",
  options: [
    { label: "選択肢１", value: 10 },
    { label: "選択肢２", value: 20 },
    { label: "選択肢３", value: 30 },
  ],
};
