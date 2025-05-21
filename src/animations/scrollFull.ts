import { fixDrawImage } from "../utils/canvas";
import { Animation } from "../types";

const animationScrollFull: Animation = async (
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
  const kf = (keyframe + 0.75) % 1;
  const ratio = (cellWidth / 2) / width;
  const naturalWidth = image instanceof HTMLImageElement ? image.naturalWidth : image.width;
  const srcWidth = naturalWidth + width; // add margin at the end
  let x = -kf * srcWidth;
  while (x < width * 2) {
    await fixDrawImage(
      ctx,
      image,
      0,
      offsetV,
      srcWidth,
      height,
      x * ratio,
      cellHeight / 4,
      srcWidth * ratio,
      cellHeight / 2,
    );
    x += srcWidth;
  }
};

export default animationScrollFull;
