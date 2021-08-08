import Emoji from "./Emoji.vue";

export default {
  title: "icons/Emoji",
  component: Emoji,
};

export const Base = () => ({
  components: { Emoji },
  template: "<Emoji />",
});
