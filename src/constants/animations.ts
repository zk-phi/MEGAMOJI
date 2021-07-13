import animationEkken from "../animations/ekken";
import animationEkkenVertical from "../animations/ekkenVertical";
import animationKanpai from "../animations/kanpai";
import animationKanpaiLefty from "../animations/kanpaiLefty";
import animationScroll from "../animations/scroll";
import animationScrollVertical from "../animations/scrollVertical";
import animationPush from "../animations/push";
import animationPushVertical from "../animations/pushVertical";
import animationXile from "../animations/xile";
import animationScrollFull from "../animations/scrollFull";

export default [
  { label: "スクロール", fn: animationScroll },
  { label: "スクロール (縦)", fn: animationScrollVertical },
  { label: "押し出し", fn: animationPush },
  { label: "押し出し (縦)", fn: animationPushVertical },
  { label: "謁見", fn: animationEkken },
  { label: "謁見バーティカル", fn: animationEkkenVertical },
  { label: "乾杯", fn: animationKanpai },
  { label: "乾杯 (左利き)", fn: animationKanpaiLefty },
  { label: "ザイル", fn: animationXile },
  { label: "全体スクロール ('はみだす'用)", fn: animationScrollFull },
];
