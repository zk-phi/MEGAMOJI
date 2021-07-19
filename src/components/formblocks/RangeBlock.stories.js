import RangeBlock from "./RangeBlock.vue";

export default {
  title: "formblocks/molecules/RangeBlock",
  component: RangeBlock,
};

const Template = (args) => ({
  components: { RangeBlock },
  data: () => args,
  template: `
    <RangeBlock
        :model-value="modelValue"
        :label="label"
        :min="min"
        :max="max"
        :range="range"
        :marks="marks" />
  `,
});

export const Base = Template.bind({});
Base.args = {
  modelValue: 20,
  label: "値",
  min: 0,
  max: 100,
  step: 1,
  marks: { 50: "基準値" },
};

export const Range = Template.bind({});
Range.args = {
  modelValue: [20, 80],
  label: "値",
  range: true,
  min: 0,
  max: 100,
  step: 1,
  marks: { 50: "基準値" },
};
