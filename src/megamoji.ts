import { createApp } from "vue";
import rollbar from "./utils/rollbar";
import App from "./components/App.vue";

const app = createApp(App);

if (rollbar) {
  app.config.errorHandler = (err: Error) => {
    rollbar.error(err);
    throw err; // rethrow
  };
}

window.onerror = (msg, file, line, col) => {
  ga("send", "event", "error", "thrown", `${file}:${line}:${col} ${msg}`);
};

app.mount("#app");

ga("send", "pageview", "/");
