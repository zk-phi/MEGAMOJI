import { Effect } from "../types";

const effectNeruneru: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  ctx.translate(
    Math.cos(Math.PI * 2 * keyframe) * 0.05 * cellWidth,
    Math.sin(Math.PI * 2 * keyframe) * 0.05 * cellHeight,
  );
};

export default effectNeruneru;
