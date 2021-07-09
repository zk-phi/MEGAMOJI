import { Effect } from "../types";

const effectYurayura: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  ctx.translate(cellWidth / 2, cellHeight * 3 / 4);
  ctx.rotate(Math.PI * Math.abs(keyframe - 0.5) / 2 - Math.PI / 8);
  ctx.translate(-cellWidth / 2, -cellHeight * 3 / 4);
};

export default effectYurayura;
