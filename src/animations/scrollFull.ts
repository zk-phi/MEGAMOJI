import { Animation } from "../types";

const animationScrollFull: Animation = (
  keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
) => {
  const ratio = (cellWidth / 2) / width;
  let x = -keyframe * image.naturalWidth;
  while (x < width * 2) {
    ctx.drawImage(
      image,
      0, offsetV, image.naturalWidth, height,
      x * ratio, cellHeight / 4, image.naturalWidth * ratio, cellHeight / 2,
    );
    x += image.naturalWidth;
  }
};

export default animationScrollFull;
