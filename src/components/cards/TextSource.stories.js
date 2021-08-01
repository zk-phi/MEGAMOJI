import TextSource from "./TextSource.vue";

export default {
  title: "cards/TextSource",
  component: TextSource,
};

export const Base = (args) => ({
  components: { TextSource },
  data: () => args,
  template: "<TextSource :show='show' />",
});
Base.args = { show: true };
