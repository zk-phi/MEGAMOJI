import { Effect } from "../types";

const effectBGTiritiri: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
  const { data } = imageData;
  for (let row = 0; row < cellHeight; row += 1) {
    for (let col = 0; col < cellWidth; col += 1) {
      data[(row * cellWidth + col) * 4 + 3] = Math.floor(255 * Math.random());
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

export default effectBGTiritiri;
