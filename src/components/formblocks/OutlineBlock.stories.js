import OutlineBlock from "./OutlineBlock.vue";

export default {
  title: "organisms/text/OutlineBlock",
  component: OutlineBlock,
};

const Template = (args) => ({
  components: { OutlineBlock },
  data: () => args,
  template: `
    <OutlineBlock :model-value='modelValue' :base-color='baseColor' :show-details='showDetails' />
  `,
});

export const Base = Template.bind({});
Base.args = { modelValue: ["#000000", "darker"], baseColor: "#ff0000", showDetails: false };

export const Details = Template.bind({});
Details.args = { modelValue: ["#000000", "darker"], baseColor: "#ff0000", showDetails: true };
