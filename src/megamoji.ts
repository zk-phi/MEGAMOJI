import Vue from 'vue';
import controller from "./components/controller";

const vm = new Vue(controller).$mount("#app");

window.onerror = (msg, file, line, col) => {
  ga("send", "event", "error", "thrown", `${file}:${line}:${col} ${msg}`);
};

ga("send", "pageview", "/");
