import { Effect } from "../types";
import { HSV2RGB } from "../utils/color";

const effectShadowNeon: Effect = (keyframe, ctx) => {
  const HSVColor = HSV2RGB({ h: Math.floor(keyframe * 360 * 4) % 360, s: 1, v: 1 });
  ctx.shadowColor = `rgb(${HSVColor.r}, ${HSVColor.g}, ${HSVColor.b})`;
  ctx.shadowBlur = 10;
};

export default effectShadowNeon;
