import Result from "./Result.vue";
import image from "../../samples/image.png";

export default {
  title: "cards/Result",
  component: Result,
};

export const Base = (args) => ({
  components: { Result },
  data: () => args,
  template: "<Result :images='images' />",
});
Base.args = { images: [[image, image], [image, image]] };
