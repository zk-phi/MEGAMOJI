import { Easing } from "../types";

const easingStopNGo: Easing = (x) => (
  x < 0.5 ? x * 2 : 1
);

export default easingStopNGo;
