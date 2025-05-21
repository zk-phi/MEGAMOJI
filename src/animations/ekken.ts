import { fixDrawImage } from "../utils/canvas";
import { Animation } from "../types";

const animationEkken: Animation = async (
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
  await fixDrawImage(
    ctx,
    image,
    offsetH,
    offsetV,
    width,
    height,
    cellWidth / 2 * (1 - keyframe / 2),
    cellHeight / 2 * (1 - keyframe / 2),
    cellWidth / 2 * keyframe,
    cellHeight / 2 * keyframe,
  );
  await fixDrawImage(
    ctx,
    image,
    offsetH,
    offsetV,
    width / 2,
    height,
    cellWidth / 4 * (1 - keyframe),
    cellHeight / 4,
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
    cellWidth / 2 + cellWidth / 4 * keyframe,
    cellHeight / 4,
    cellWidth / 4,
    cellHeight / 2,
  );
};

export default animationEkken;
