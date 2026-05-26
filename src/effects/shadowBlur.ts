import { Effect } from "../types";

const effectShadowBlur: Effect = (keyframe, ctx) => {
  ctx.shadowColor = `rgba(0, 0, 0, ${1 - keyframe})`;
  ctx.shadowBlur = 50 * keyframe;
};

export default effectShadowBlur;
