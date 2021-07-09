import { Effect } from "../types";

const effectShadowRotate: Effect = (keyframe, ctx) => {
  ctx.shadowColor = "black";
  ctx.shadowOffsetY = Math.cos(2 * Math.PI * keyframe) * 5;
  ctx.shadowOffsetX = Math.sin(2 * Math.PI * keyframe) * 5;
};

export default effectShadowRotate;
