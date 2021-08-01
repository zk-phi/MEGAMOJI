import Preview from "./Preview.vue";
import icon from "../../samples/image.png";

export default {
  title: "organisms/result/Preview",
  component: Preview,
};

const Template = (args) => ({
  components: { Preview },
  data: () => args,
  template: "<Preview :images='images' :darkMode='darkMode' />",
});

export const Light = Template.bind({});
Light.args = { images: [[icon, icon], [icon, icon]], darkMode: false };

export const Dark = Template.bind({});
Dark.args = { images: [[icon, icon], [icon, icon]], darkMode: true };
