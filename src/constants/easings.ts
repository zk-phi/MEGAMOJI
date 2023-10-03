import easingLinear from "../easings/linear";
import easingStopNGo from "../easings/stopngo";
import easingExponent from "../easings/exponent";
import easingBounce from "../easings/bounce";

export default [
  { label: "スルスル", value: easingLinear },
  { label: "シュッシュ", value: easingStopNGo },
  { label: "ニュルニュル", value: easingExponent },
  { label: "ボテボテ", value: easingBounce },
];
