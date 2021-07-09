import { Effect } from "../types";

const effectFlipVertical: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  ctx.translate(0, cellHeight);
  ctx.scale(1, -1);
};

export default effectFlipVertical;
