import CellcountBlock from "./CellcountBlock.vue";

export default {
  title: "organisms/target/CellcountBlock",
  component: CellcountBlock,
};

export const Base = (args) => ({
  components: { CellcountBlock },
  data: () => args,
  template: "<CellcountBlock :model-value='modelValue' />",
});
Base.args = { modelValue: [1, 1] };
