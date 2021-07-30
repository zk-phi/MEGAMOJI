import ColorSample from "./ColorSample.vue";

export default {
  title: "atoms/global/ColorSample",
  component: ColorSample,
};

export const Base = (args) => ({
  components: { ColorSample },
  data: () => args,
  template: `
    <ColorSample :color="color" />
  `,
});
Base.args = { color: "#f00" };
