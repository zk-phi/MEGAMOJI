import { Effect } from "../types";

const effectPatapata: Effect = (keyframe, ctx, cellWidth) => {
  ctx.transform(
    Math.cos(2 * Math.PI * keyframe),
    0, 0,
    1,
    cellWidth * (0.5 - 0.5 * Math.cos(2 * Math.PI * keyframe)), 0,
  );
};

export default effectPatapata;
