import FontColorSelectBlock from "./FontColorSelectBlock.vue";

export default {
  title: "organisms/text/FontColorSelectBlock",
  component: FontColorSelectBlock,
};

const Template = (args) => ({
  components: { FontColorSelectBlock },
  data: () => args,
  template: "<FontColorSelectBlock :model-value='modelValue' :show-details='showDetails' />",
});

export const Basic = Template.bind({});
Basic.args = { modelValue: "#ff0000", showDetails: false };

export const Details = Template.bind({});
Details.args = { modelValue: "#ff0000", showDetails: true };
