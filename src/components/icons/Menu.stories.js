import Menu from "./Menu.vue";

export default {
  title: "icons/Menu",
  component: Menu,
};

export const Base = () => ({
  components: { Menu },
  template: "<Menu />",
});
