import { Effect } from "../types";

const effectStamp: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const kf = keyframe < 0.25 ? (
    1
  ) : keyframe < 0.75 ? (
    (keyframe - 0.25) * 2 // 0 -> 1
  ) : (
    1
  );
  const scale = 0.9 + 0.5 * Math.cos(Math.PI / 2 * kf);
  ctx.translate(cellWidth / 2, cellHeight / 2);
  ctx.rotate(-0.3);
  ctx.scale(scale, scale);
  ctx.translate(-cellWidth / 2, -cellHeight / 2);
};

export default effectStamp;
