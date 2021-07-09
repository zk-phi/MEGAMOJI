import animationEkken from "../animations/ekken";
import animationEkkenVertical from "../animations/ekkenVertical";
import animationKanpai from "../animations/kanpai";
import animationKanpaiLefty from "../animations/kanpaiLefty";
import animationScroll from "../animations/scroll";
import animationScrollVertical from "../animations/scrollVertical";
import animationPush from "../animations/push";
import animationPushVertical from "../animations/pushVertical";
import animationXile from "../animations/xile";

export default [
  { label: "スクロール（水平）", fn: animationScroll },
  { label: "スクロール（垂直）", fn: animationScrollVertical },
  { label: "押し出し（水平）", fn: animationPush },
  { label: "押し出し（垂直）", fn: animationPushVertical },
  { label: "謁見", fn: animationEkken },
  { label: "謁見バーティカル", fn: animationEkkenVertical },
  { label: "乾杯", fn: animationKanpai },
  { label: "乾杯 (左利き)", fn: animationKanpaiLefty },
  { label: "ザイル", fn: animationXile },
];
