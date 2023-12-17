import { Effect } from "../types";

const effectNorinori: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const k = 1 / 4;
  const a = (2 * k - 1) / (k * k - k);
  const b = (1 - 2 * k * k) / (k * k - k);

  const kf = (keyframe % 0.5) * 2;
  const sign = (keyframe < 0.5) ? -1 : 1;
  const ratio = (kf < k
    ? (-a * kf ** 2 + -b * kf)
    : (a * kf ** 2 + b * kf + 2)
  ) / 6;

  ctx.transform(
    1, 0,
    sign * ratio, 1 - ratio,
    -sign * ratio * cellWidth * 3 / 4, ratio * cellHeight * 3 / 4
  );
};

export default effectNorinori;
