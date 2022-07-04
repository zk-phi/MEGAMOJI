import { Animation } from "../types";

const animationXile: Animation = (
  keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
) => {
  for (let i = 2; i >= 0; i -= 1) {
    const x = (
      Math.cos(Math.PI * 2 * (keyframe - i * 0.2)) * 0.3 * cellWidth / 2 + cellWidth / 4
    );
    const y = (
      Math.sin(Math.PI * 2 * (keyframe - i * 0.2)) * 0.3 * cellHeight / 2 + cellHeight / 4
    );
    ctx.drawImage(
      image,
      offsetH, offsetV, width, height,
      x, y, cellWidth / 2 * 0.8, cellHeight / 2 * 0.8,
    );
  }
};

export default animationXile;
