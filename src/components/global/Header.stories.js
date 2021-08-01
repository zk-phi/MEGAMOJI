import Header from "./Header.vue";

export default {
  title: "organisms/global/Header",
  component: Header,
};

export const Base = () => ({
  components: { Header },
  template: "<Header />",
});
