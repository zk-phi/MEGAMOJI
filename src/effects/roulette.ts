import { Effect } from "../types";

const effectRoulette: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  ctx.translate(cellWidth / 2, cellHeight / 2);
  ctx.rotate(Math.PI * 2 * keyframe + 0.1);
  ctx.translate(-cellWidth / 2, -cellHeight / 2);
};

export default effectRoulette;
