import { Easing } from "../types";

const n1 = 7.5625;
const d1 = 2.75;

const easingBounce: Easing = (x) => (
  x < 1 / d1 ? (
    n1 * (x ** 2)
  ) : x < 2 / d1 ? (
    n1 * (x - 1.5 / d1) ** 2 + 0.75
  ) : x < 2.5 / d1 ? (
    n1 * (x - 2.25 / d1) ** 2 + 0.9375
  ) : (
    n1 * (x - 2.625 / d1) ** 2 + 0.984375
  )
);

export default easingBounce;
