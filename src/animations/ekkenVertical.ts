import { Animation } from "../types";

const animationEkkenVertical: Animation = (
  keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
) => {
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height,
    cellWidth / 2 * (1 - keyframe / 2), cellHeight / 2 * (1 - keyframe / 2),
    cellWidth * keyframe / 2, cellHeight * keyframe / 2,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV, width, height / 2,
    cellWidth / 4, cellHeight / 4 * (1 - keyframe),
    cellWidth / 2, cellHeight / 4,
  );
  ctx.drawImage(
    image,
    offsetH, offsetV + height / 2, width, height / 2,
    cellWidth / 4, cellHeight / 2 + cellHeight / 4 * keyframe,
    cellWidth / 2, cellHeight / 4,
  );
};

export default animationEkkenVertical;
