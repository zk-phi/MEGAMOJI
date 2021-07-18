import App from "./App.vue";

export default {
  title: "global/pages/App",
  component: App,
};

export const Base = (args) => ({
  components: { App },
  data: () => args,
  template: "<App />",
});
Base.args = { };
