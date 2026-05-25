import { fixDrawImage } from "../utils/canvas";
import { Animation } from "../types";

const animationScroll: Animation = async (
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
  const kf = (keyframe + 0.5) % 1;
  for (const i of [0, 1, 2]) {
    await fixDrawImage(
      ctx,
      image,
      offsetH,
      offsetV,
      width,
      height,
      cellWidth / 2 * i - cellWidth / 2 * kf,
      cellHeight / 4,
      cellWidth / 2,
      cellHeight / 2,
    );
  }
};

export default animationScroll;
