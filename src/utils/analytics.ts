import { GA4_TOKEN } from "./env";

let mode = "";
let type = "";
let font = "";
let effects = "";

const switchMode = (value: string, interactive?: boolean) => {
  mode = value;
  if (value !== "target") {
    type = value;
  }
  if (GA4_TOKEN && interactive) {
    gtag("event", "switch_mode", { mode: value, font, effects, type });
  } else {
    // eslint-disable-next-line no-console
    console.log("switch_mode", { mode: value });
  }
};

const changeFont = (value: string) => {
  font = value;
  // eslint-disable-next-line no-console
  console.log("change_font", { font: value });
};

const changeAnimation = (animationName: string, effectNames: string[]) => {
  effects = `${animationName}/${effectNames.join(",")}`;
  // eslint-disable-next-line no-console
  console.log("change_animation", { effects });
};

const render = () => {
  if (GA4_TOKEN) {
    gtag("event", "render_emoji", { mode, font, effects, type });
  } else {
    // eslint-disable-next-line no-console
    console.log("render_emoji", { mode, font, effects, type });
  }
};

const download = () => {
  if (GA4_TOKEN) {
    gtag("event", "download", { mode, font, effects, type });
  } else {
    // eslint-disable-next-line no-console
    console.log("download", { mode, font, effects, type });
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
