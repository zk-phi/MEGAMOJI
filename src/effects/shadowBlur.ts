import { Effect } from "../types";
import { HSV2RGB } from "../utils/color";

const effectShadowBlur: Effect = (keyframe, ctx) => {
  const HSVColor = HSV2RGB({ h: 0, s: 0, v: keyframe });
  ctx.shadowColor = `rgb(${HSVColor.r}, ${HSVColor.g}, ${HSVColor.b})`;
  ctx.shadowBlur = 50 * keyframe;
};

export default effectShadowBlur;
