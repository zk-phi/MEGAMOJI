import Footer from "./Footer.vue";

export default {
  title: "global/organisms/Footer",
  component: Footer,
};

export const Base = () => ({
  components: { Footer },
  template: "<Footer />",
});
