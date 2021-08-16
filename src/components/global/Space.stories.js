import Space from "./Space.vue";
import ColorSample from "./ColorSample.vue";

export default {
  title: "utils/Space",
  component: Space,
};

const Template = (args) => ({
  components: { Space, ColorSample },
  data: () => args,
  template: `
    <Space vertical :small="small" :large="large">
      <Space :small="small" :large="large">
        <ColorSample color="#f00" />
        <ColorSample color="#0f0" />
        <ColorSample color="#00f" />
      </Space>
      <Space :small="small" :large="large">
        <ColorSample color="#f00" />
        <ColorSample color="#0f0" />
        <ColorSample color="#00f" />
      </Space>
      <Space :small="small" :large="large">
        <ColorSample color="#f00" />
        <ColorSample color="#0f0" />
        <ColorSample color="#00f" />
      </Space>
    </Space>
  `,
});

export const Base = Template.bind({});
Base.args = { small: false, large: false };

export const Small = Template.bind({});
Small.args = { small: true, large: false };

export const Large = Template.bind({});
Large.args = { small: false, large: true };
