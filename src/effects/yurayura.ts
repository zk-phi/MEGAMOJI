import { Effect } from "../types";

const effectYurayura: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  ctx.translate(cellWidth / 2, cellHeight * 3 / 4);
  ctx.rotate(0.25 * Math.sin(keyframe * 2 * Math.PI + 0.25));
  ctx.translate(-cellWidth / 2, -cellHeight * 3 / 4);
};

export default effectYurayura;
