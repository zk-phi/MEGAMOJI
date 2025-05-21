import { Animation } from "../types";
import { flipContext, fixDrawImage } from "../utils/canvas";

const animationKanpaiLefty: Animation = async (
  keyframe,
  ctx,
  image,
  offsetH,
  offsetV,
  width,
  height,
  cellWidth,
  cellHeight,
) => {
  const size = 0.6 - 0.6 * Math.sin(Math.PI * keyframe); /* 0.6 -> 0 -> 0.6 */
  flipContext(ctx, cellWidth);
  await fixDrawImage(
    ctx,
    image,
    offsetH,
    offsetV,
    width,
    height,
    -cellWidth / 2 * (0.5 - size),
    cellHeight / 4,
    cellWidth / 2,
    cellHeight / 2,
  );
  flipContext(ctx, cellWidth);
  await fixDrawImage(
    ctx,
    image,
    offsetH,
    offsetV,
    width,
    height,
    -cellWidth / 2 * (0.5 - size),
    cellHeight / 4,
    cellWidth / 2,
    cellHeight / 2,
  );
};

export default animationKanpaiLefty;
