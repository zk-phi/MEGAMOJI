import App from "./App.vue";

export default {
  title: "App",
  component: App,
  parameters: {
    layout: "fullscreen",
  },
};

export const Base = () => ({
  components: { App },
  template: "<App />",
});
