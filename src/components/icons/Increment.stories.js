import Increment from "./Increment.vue";

export default {
  title: "icons/Increment",
  component: Increment,
};

export const Base = () => ({
  components: { Increment },
  template: "<Increment />",
});
