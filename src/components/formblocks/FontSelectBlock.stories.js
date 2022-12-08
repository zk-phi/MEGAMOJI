import FontSelectBlock from "./FontSelectBlock.vue";

export default {
  title: "organisms/text/FontSelectBlock",
  component: FontSelectBlock,
};

const Template = (args) => ({
  components: { FontSelectBlock },
  data: () => args,
  template: "<FontSelectBlock :model-value='modelValue' :show-details='showDetails' />",
});

export const Basic = Template.bind({});
Basic.args = { modelValue: "normal 1em sans-serif", showDetails: false };

export const Details = Template.bind({});
Details.args = { modelValue: "normal 1em sans-serif", showDetails: true };
