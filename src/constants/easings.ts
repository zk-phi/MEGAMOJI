import easingLinear from "../easings/linear";
import easingStopNGo from "../easings/stopngo";
import easingExponent from "../easings/exponent";
import easingBounce from "../easings/bounce";
import easingStop from "../easings/stop";

import { NODE_ENV } from "../utils/env";

export default [
  { label: "スルスル", value: easingLinear },
  { label: "シュッシュ", value: easingStopNGo },
  { label: "ニュルニュル", value: easingExponent },
  { label: "ボテボテ", value: easingBounce },
  ...(NODE_ENV === "development" ? [
    { label: "１フレーム目固定 (デバッグ用)", value: easingStop },
  ] : []),
];
