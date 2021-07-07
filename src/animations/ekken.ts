import { Animation } from "../animations";

const animationEkken: Animation = (
  keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
) => {
  const kf = keyframe < 0.5 ? 1 : (keyframe - 0.5) * 2;
  const size = 1.0 * kf + 0.5 * (1 - kf);
  const ekkenOffset = (cellWidth / 2) * kf;
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    cellWidth * (2 - size) / 4, cellHeight * (2 - size) / 4,
    cellWidth / 2 * size, cellHeight / 2 * size,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV, width / 2, height,
    -ekkenOffset / 2, cellHeight / 4,
    cellWidth / 4, cellHeight / 2,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV, width / 2, height,
    -ekkenOffset / 2 + cellWidth / 4, cellHeight / 4,
    cellWidth / 4, cellHeight / 2,
  );
  ctx.drawImage(
    image,
    offsetH + width / 2, offsetV, width / 2, height,
    cellWidth / 2 + ekkenOffset / 2, cellHeight / 4,
    cellWidth / 4, cellHeight / 2,
  );
  ctx.drawImage(
    image,
    offsetH + width / 2, offsetV, width / 2, height,
    cellWidth * 3 / 4 + ekkenOffset / 2, cellHeight / 4,
    cellWidth / 4, cellHeight / 2,
  );
};

export default animationEkken;
