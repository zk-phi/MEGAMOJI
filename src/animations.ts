import animationEkken from "./animations/ekken";
import animationEkkenVertical from "./animations/ekkenVertical";
import animationKanpai from "./animations/kanpai";
import animationKanpaiLefty from "./animations/kanpaiLefty";
import animationScroll from "./animations/scroll";
import animationScrollVertical from "./animations/scrollVertical";
import animationPush from "./animations/push";
import animationPushVertical from "./animations/pushVertical";
import animationXile from "./animations/xile";

// An animation is a function which actually renders each animation frames.
export type Animation = (
  // a 0.0 - 1.0 progress of the animation
  keyframe: number,
  // a (possively) effected 2d rendering context
  ctx: CanvasRenderingContext2D,
  // the source image to be rendered
  image: HTMLImageElement,
  // range of the source image to be rendered
  offsetH: number, offsetV: number, width: number, height: number,
  // size of the image to be rendered
  cellWidth: number, cellHeight: number,
) => void;

export const ANIMATIONS = [
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
