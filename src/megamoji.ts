import { createApp } from "vue";
import rollbar from "./utils/rollbar";
import App from "./components/App.vue";

const app = createApp(App);

if (rollbar) {
  app.config.errorHandler = (err: Error) => {
    rollbar.error(err);
    throw err; // rethrow
  };
  // eslint-disable-next-line no-console
  console.log("Rollbar initialized.");
}

window.onerror = (msg, file, line, col) => {
  ga("send", "event", "error", "thrown", `${file}:${line}:${col} ${msg}`);
};

const match = window.location.href.match(/debugrollbar=(.*)/);
if (match) {
  throw new Error(match[1]);
}

app.mount("#app");

ga("send", "pageview", "/");
