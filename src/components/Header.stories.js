import Header from "./Header.vue";

export default {
  title: "global/organisms/Header",
  component: Header,
};

export const Base = () => ({
  components: { Header },
  template: "<Header />",
});
