import App from "./App.vue";

export default {
  title: "App",
  component: App,
};

export const Base = () => ({
  components: { App },
  template: "<App />",
});
