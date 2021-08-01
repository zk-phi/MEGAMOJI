import Image from "./Image.vue";

export default {
  title: "icons/Image",
  component: Image,
};

export const Base = () => ({
  components: { Image },
  template: "<Image />",
});
