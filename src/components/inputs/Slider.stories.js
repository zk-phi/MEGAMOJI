import Slider from "./Slider.vue";

export default {
  title: "atoms/inputs/Slider",
  component: Slider,
};

const Template = (args) => ({
  components: { Slider },
  data: () => ({
    ...args,
    value: args.initialValue,
  }),
  template: `
    <Slider v-model="value" :min="min" :max="max" :marks="marks" />
  `,
});

export const Base = Template.bind({});
Base.args = { initialValue: 5, min: 0, max: 100, marks: [25, 75] };

export const Range = Template.bind({});
Range.args = { initialValue: [5, 20], min: 0, max: 100, marks: [25, 75] };
