import { Effect } from "../types";

const effectNorinori: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const k = 1 / 4;
  const a = (2 * k - 1) / (k * k - k);
  const b = (1 - 2 * k * k) / (k * k - k);
  const ratio = (keyframe < k
    ? (-a * keyframe ^ 2 + -b * keyframe)
    : (a * keyframe ^ 2 + b * keyframe + 2)
  ) / 4;
  ctx.transform(1 + ratio, 0, 0, 1 - ratio, -ratio * cellWidth / 2, ratio * cellHeight * 3 / 4);
};

export default effectNorinori;
