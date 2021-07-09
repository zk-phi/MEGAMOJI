import { createApp } from "vue";
import App from "./components/App.vue";

createApp(App).mount("#app");

window.onerror = (msg, file, line, col) => {
  ga("send", "event", "error", "thrown", `${file}:${line}:${col} ${msg}`);
};

ga("send", "pageview", "/");
