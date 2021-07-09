import { Effect } from "../types";

const effectYatta: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  if (keyframe >= 0.5) {
    /* flip */
    ctx.translate(cellWidth, 0);
    ctx.scale(-1, 1);
  }
  ctx.translate(cellWidth / 2, cellHeight / 2);
  ctx.rotate(0.1);
  ctx.translate(-cellWidth / 2, -cellHeight / 2);
  ctx.translate(0, cellHeight / 16 * Math.sin(8 * Math.PI * keyframe));
};

export default effectYatta;
