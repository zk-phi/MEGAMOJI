import { fixDrawImage } from "../utils/canvas";
import { Animation } from "../types";

const animationScrollVertical: Animation = (
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
  const kf = 1 - (keyframe + 0.5) % 1;
  fixDrawImage(
    ctx,
    image,
    offsetH,
    offsetV,
    width,
    height,
    cellWidth / 4,
    -cellHeight / 2 * kf,
    cellWidth / 2,
    cellHeight / 2,
  );
  fixDrawImage(
    ctx,
    image,
    offsetH,
    offsetV,
    width,
    height,
    cellWidth / 4,
    cellHeight / 2 - cellHeight / 2 * kf,
    cellWidth / 2,
    cellHeight / 2,
  );
  fixDrawImage(
    ctx,
    image,
    offsetH,
    offsetV,
    width,
    height,
    cellWidth / 4,
    cellHeight - cellHeight / 2 * kf,
    cellWidth / 2,
    cellHeight / 2,
  );
};

export default animationScrollVertical;
