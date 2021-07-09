import { Effect } from "../types";

const effectFlip: Effect = (keyframe, ctx, cellWidth) => {
  ctx.translate(cellWidth, 0);
  ctx.scale(-1, 1);
};

export default effectFlip;
