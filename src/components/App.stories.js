import App from "./App.vue";

export default {
  title: "global/pages/App",
  component: App,
};

export const Base = () => ({
  components: { App },
  template: "<App />",
});
