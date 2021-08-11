import Decrement from "./Decrement.vue";

export default {
  title: "icons/Decrement",
  component: Decrement,
};

export const Base = () => ({
  components: { Decrement },
  template: "<Decrement />",
});
