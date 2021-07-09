import { PostEffect } from "../types";

const postEffectMosaic: PostEffect = (keyframe, ctx, w, h) => {
  const image = ctx.getImageData(0, 0, w, h);
  const { data } = image;

  const cellSize = Math.floor(Math.min(w, h) / 16);
  const cellCountH = Math.ceil(w / cellSize + 1);
  const cellCountV = Math.ceil(h / cellSize + 1);
  const offsetX = Math.floor(w / 4 - cellSize + cellSize * keyframe);
  const offsetY = Math.floor(h / 4 - cellSize + cellSize * keyframe);

  for (let cellX = 0; cellX < cellCountH; cellX += 1) {
    for (let cellY = 0; cellY < cellCountV; cellY += 1) {
      const cellColor = [0, 0, 0, 0];
      const x = offsetX + cellX * cellSize;
      const y = offsetY + cellY * cellSize;
      for (let dx = 0; dx < cellSize; dx += 1) {
        for (let dy = 0; dy < cellSize; dy += 1) {
          const ix = (y + dy) * w + x + dx;
          cellColor[0] += data[ix * 4 + 0] * data[ix * 4 + 3];
          cellColor[1] += data[ix * 4 + 1] * data[ix * 4 + 3];
          cellColor[2] += data[ix * 4 + 2] * data[ix * 4 + 3];
          cellColor[3] += data[ix * 4 + 3];
        }
      }

      cellColor[0] /= cellColor[3];
      cellColor[1] /= cellColor[3];
      cellColor[2] /= cellColor[3];
      cellColor[3] /= cellSize * cellSize;
      for (let dx = 0; dx < cellSize; dx += 1) {
        for (let dy = 0; dy < cellSize; dy += 1) {
          const ix = (y + dy) * w + x + dx;
          data[ix * 4 + 0] = cellColor[0];
          data[ix * 4 + 1] = cellColor[1];
          data[ix * 4 + 2] = cellColor[2];
          data[ix * 4 + 3] = cellColor[3];
        }
      }
    }
  }

  ctx.putImageData(image, 0, 0);
};

export default postEffectMosaic;
