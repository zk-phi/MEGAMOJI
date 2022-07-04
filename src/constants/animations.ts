import animationEkken from "../animations/ekken";
import animationEkkenVertical from "../animations/ekkenVertical";
import animationKanpai from "../animations/kanpai";
import animationKanpaiLefty from "../animations/kanpaiLefty";
import animationScroll from "../animations/scroll";
import animationScrollVertical from "../animations/scrollVertical";
import animationXile from "../animations/xile";
import animationScrollFull from "../animations/scrollFull";

export default [
  { label: "スクロール", value: animationScroll },
  { label: "スクロール (縦)", value: animationScrollVertical },
  { label: "謁見", value: animationEkken },
  { label: "謁見バーティカル", value: animationEkkenVertical },
  { label: "通過 ('はみだす'向け)", value: animationScrollFull },
  { label: "乾杯", value: animationKanpai },
  { label: "乾杯 (左利き)", value: animationKanpaiLefty },
  { label: "ザイル", value: animationXile },
];
