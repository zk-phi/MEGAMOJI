import { Easing } from "../types";

const easingExponent: Easing = (x) => (
  x === 0 ? (
    0
  ) : x === 1 ? (
    1
  ) : x < 0.5 ? (
    2 ** (20 * x - 10) / 2
  ) : (
    (2 - 2 ** (-20 * x + 10)) / 2
  )
);

export default easingExponent;
