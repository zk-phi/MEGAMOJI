import { GA4_TOKEN } from "./env";

export default (() => {
  if (GA4_TOKEN) {
    gtag("js", new Date());
    gtag("config", GA4_TOKEN);
    console.log("GA4 initialized");
    return gtag;
  } else {
    return null;
  }
})();
