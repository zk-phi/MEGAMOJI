import { Effect } from "../types";
import { OUTLINE_THICKNESS } from "../constants/emoji";

const effectShadowRotate: Effect = (keyframe, ctx, targetWidth, targetHeight) => {
  const size = Math.min(targetWidth, targetHeight);
  const thickness = size * OUTLINE_THICKNESS * 5 / 12;
  ctx.shadowColor = "black";
  ctx.shadowOffsetY = Math.cos(2 * Math.PI * keyframe) * thickness;
  ctx.shadowOffsetX = Math.sin(2 * Math.PI * keyframe) * thickness;
};

export default effectShadowRotate;
