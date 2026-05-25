import { Effect } from "../types";

const effectTateyure: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  ctx.translate(
    0,
    - Math.sin(Math.PI * 2 * keyframe) * 0.05 * cellHeight,
  );
};

export default effectTateyure;
