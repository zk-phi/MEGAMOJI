import { Animation } from "../types";

const animationScrollFull: Animation = (
  keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
) => {
  const ratio = (cellWidth / 2) / width;
  const srcWidth = image.naturalWidth + width; // add margin at the end
  let x = -keyframe * srcWidth;
  while (x < width * 2) {
    ctx.drawImage(
      image,
      0, offsetV, srcWidth, height,
      x * ratio, cellHeight / 4, srcWidth * ratio, cellHeight / 2,
    );
    x += srcWidth;
  }
};

export default animationScrollFull;
