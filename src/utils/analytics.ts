import { GA4_TOKEN } from "./env";

let mode = "";

const switchMode = (value: string, interactive?: boolean) => {
  mode = value;
  if (GA4_TOKEN && interactive) {
    gtag("event", "switch_mode", { mode: value });
  } else {
    // eslint-disable-next-line no-console
    console.log("switch_mode", { mode: value });
  }
};

const changeFont = (value: string) => {
};

const changeAnimation = (animationName: string, effectNames: string[]) => {
};

const render = () => {
  if (GA4_TOKEN) {
    gtag("event", "render_emoji", { mode });
  } else {
    // eslint-disable-next-line no-console
    console.log("render_emoji", { mode });
  }
};

const download = () => {
  if (GA4_TOKEN) {
    gtag("event", "download", { mode });
  } else {
    // eslint-disable-next-line no-console
    console.log("download", { mode });
  }
};

export default (() => {
  if (GA4_TOKEN) {
    gtag("js", new Date());
    gtag("config", GA4_TOKEN);
    // eslint-disable-next-line no-console
    console.log("GA4 initialized.");
  } else {
    // eslint-disable-next-line no-console
    console.log("Specify GA4_TOKEN to enable analytics.");
  }
  return { switchMode, changeFont, changeAnimation, render, download };
})();
