import FilterSelectBlock from "./FilterSelectBlock.vue";

export default {
  title: "formblocks/molecules/FilterSelectBlock",
  component: FilterSelectBlock,
};

export const Base = (args) => ({
  components: { FilterSelectBlock },
  data: () => args,
  template: "<FilterSelectBlock :model-value='modelValue' />",
});
Base.args = { modelValue: null };
