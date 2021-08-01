import FileSource from "./FileSource.vue";

export default {
  title: "cards/FileSource",
  component: FileSource,
};

export const Base = (args) => ({
  components: { FileSource },
  data: () => args,
  template: "<FileSource :show='show' />",
});
Base.args = { show: true };
