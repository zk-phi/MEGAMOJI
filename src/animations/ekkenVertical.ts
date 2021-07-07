import { Animation } from "../animations";

const animationEkkenVertical: Animation = (
  keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
) => {
  const kf = keyframe < 0.5 ? 1 : (keyframe - 0.5) * 2;
  const size = 1.0 * kf + 0.5 * (1 - kf);
  const ekkenOffset = cellHeight / 2 * kf;
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    cellWidth * (2 - size) / 4, cellHeight * (2 - size) / 4,
    cellWidth * size / 2, cellHeight * size / 2,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height / 2,
    cellWidth / 4, -ekkenOffset / 2,
    cellWidth / 2, cellHeight / 4,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height / 2,
    cellWidth / 4, cellWidth / 4 - ekkenOffset / 2,
    cellWidth / 2, cellHeight / 4,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV + height / 2, width, height / 2,
    cellWidth / 4, cellHeight / 2 + ekkenOffset / 2,
    cellWidth / 2, cellHeight / 4,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV + height / 2, width, height / 2,
    cellWidth / 4, cellHeight * 3 / 4 + ekkenOffset / 2,
    cellWidth / 2, cellHeight / 4,
  );
};

export default animationEkkenVertical;
