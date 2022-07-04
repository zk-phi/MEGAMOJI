import { Animation } from "../types";

const animationScroll: Animation = (
  keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
) => {
  const kf = (keyframe + 0.5) % 1;
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    -cellWidth / 2 * kf, cellHeight / 4, cellWidth / 2, cellHeight / 2,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    cellWidth / 2 - cellWidth / 2 * kf, cellHeight / 4, cellWidth / 2, cellHeight / 2,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    cellWidth - cellWidth / 2 * kf, cellHeight / 4, cellWidth / 2, cellHeight / 2,
  );
};

export default animationScroll;
