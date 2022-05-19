import { GA4_TOKEN } from "./env";

let mode = "";

const switchMode = (value: string, interactive?: boolean) => {
  mode = value;
  if (interactive) {
    ga("send", "pageview", `/${value}`);
    gtag("event", "switch_mode", { mode: value });
  }
};

const changeFont = (value: string) => {
  ga("set", "dimension1", value);
};

const changeAnimation = (animationName: string, effectNames: string[]) => {
  ga("set", "dimension2", `${animationName}/${effectNames.join(',')}`);
};

const render = () => {
  ga("send", "event", mode, "render");
  gtag("event", "render_emoji", { mode: mode });
};

const download = () => {
  ga("send", "event", mode, "download");
  gtag("event", "download", { mode: mode });
};

export default (() => {
  if (GA4_TOKEN) {
    gtag("js", new Date());
    gtag("config", GA4_TOKEN);
    // eslint-disable-next-line no-console
    console.log("GA4 initialized.");
    return { switchMode, changeFont, changeAnimation, render, download };
  } else {
    return null;
  }
})();
