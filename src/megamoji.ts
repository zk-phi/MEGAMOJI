import { createApp } from "vue";
import rollbar from "./utils/rollbar";
import App from "./components/App.vue";

const app = createApp(App);

app.config.errorHandler = (err: Error) => {
  if (rollbar) {
    rollbar.error(err);
  }
  throw err; // rethrow
};

app.mount("#app");

ga("send", "pageview", "/");
