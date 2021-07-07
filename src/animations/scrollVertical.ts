import { Animation } from '../animations';

const animationScrollVertical: Animation = (
  keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
) => {
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    cellWidth / 4, -cellHeight / 2 * keyframe, cellWidth / 2, cellHeight / 2,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    cellWidth / 4, cellHeight / 2 - cellHeight / 2 * keyframe, cellWidth / 2, cellHeight / 2,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    cellWidth / 4, cellHeight - cellHeight / 2 * keyframe, cellWidth / 2, cellHeight / 2,
  );
};

export default animationScrollVertical;
