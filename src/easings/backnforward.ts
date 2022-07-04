import { Easing } from "../types";

const easingBackNForward: Easing = (x) => (
  x < 0.5 ? x * 2 : 1 - ((x - 0.5) * 2)
);

export default easingBackNForward;
