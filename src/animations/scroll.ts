import { Animation } from '../animations';

const animationScroll: Animation = (
  keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
) => {
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    -cellWidth / 2 * keyframe, cellHeight / 4, cellWidth / 2, cellHeight / 2,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    cellWidth / 2 - cellWidth / 2 * keyframe, cellHeight / 4, cellWidth / 2, cellHeight / 2,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    cellWidth - cellWidth / 2 * keyframe, cellHeight / 4, cellWidth / 2, cellHeight / 2,
  );
};

export default animationScroll;
