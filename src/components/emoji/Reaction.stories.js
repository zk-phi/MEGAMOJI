import Reaction from "./Reaction.vue";
import icon from "../../samples/image.png";

export default {
  title: "emoji/atoms/Reaction",
  component: Reaction,
};

export const Base = (args) => ({
  components: { Reaction },
  data: () => args,
  template: "<Reaction :src='src' />",
});
Base.args = { src: icon };
