import { Effect } from "../types";

const effectYokoyure: Effect = (keyframe, ctx, cellWidth) => {
  ctx.translate(
    Math.sin(Math.PI * 2 * keyframe) * 0.05 * cellWidth,
    0,
  );
};

export default effectYokoyure;
