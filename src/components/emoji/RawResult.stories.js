import RawResult from "./RawResult.vue";
import icon from "../../samples/image.png";

export default {
  title: "atoms/result/RawResult",
  component: RawResult,
};

export const Base = (args) => ({
  components: { RawResult },
  data: () => args,
  template: "<RawResult :images='images' />",
});
Base.args = { images: [[icon, icon], [icon, icon]] };
