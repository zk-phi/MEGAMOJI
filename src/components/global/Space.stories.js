import Space from "./Space.vue";
import ColorSample from "./ColorSample.vue";

export default {
  title: "atoms/global/Space",
  component: Space,
};

const Template = (args) => ({
  components: { Space, ColorSample },
  data: () => args,
  template: `
    <Space :vertical="vertical" :small="small" :full="full">
      <ColorSample color="#f00" />
      <ColorSample color="#0f0" />
      <ColorSample color="#00f" />
    </Space>
  `,
});

export const Base = Template.bind({});
Base.args = { vertical: false, small: false, full: false };

export const Small = Template.bind({});
Small.args = { vertical: false, small: true, full: false };

export const Vertical = Template.bind({});
Vertical.args = { vertical: false, small: false, full: false };
