import { Animation } from "../types";
import { flipContext } from "../utils/canvas";

const animationKanpai: Animation = (
  keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
) => {
  const size = 0.35 - 0.25 * Math.cos(Math.PI * keyframe); /* 0 ~ 0.6 */
  flipContext(ctx, cellWidth);
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    cellWidth / 2 * (1.5 - size), cellHeight / 4, cellWidth / 2, cellHeight / 2,
  );
  flipContext(ctx, cellWidth);
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    cellWidth / 2 * (1.5 - size), cellHeight / 4, cellWidth / 2, cellHeight / 2,
  );
};

export default animationKanpai;
