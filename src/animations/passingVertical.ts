import { fixDrawImage } from "../utils/canvas";
import { Animation } from "../types";

const animationPassingVertical: Animation = async (
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
  for (let i = 0; i < 3; i += 1) {
    await fixDrawImage(
      ctx,
      image,
      offsetH,
      offsetV,
      width / 2,
      height,
      cellWidth / 4,
      cellHeight / 2 * i - cellHeight / 2 * kf,
      cellWidth / 4,
      cellHeight / 2,
    );
    await fixDrawImage(
      ctx,
      image,
      offsetH + width / 2,
      offsetV,
      width / 2,
      height,
      cellWidth / 2,
      -cellHeight / 2 + cellHeight / 2 * i + cellHeight / 2 * kf,
      cellWidth / 4,
      cellHeight / 2,
    );
  }
};

export default animationPassingVertical;
