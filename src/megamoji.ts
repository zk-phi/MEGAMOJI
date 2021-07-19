import { createApp } from "vue";
import rollbar from "./utils/rollbar";
import App from "./components/App.vue";

const app = createApp(App, { ga });

app.config.errorHandler = (err: unknown) => {
  if (rollbar) {
    rollbar.error(err as Error);
  }
  throw err; // rethrow
};

ga("create", "UA-121793995-1", "auto");
ga("send", "pageview", "/");

app.mount("#app");
