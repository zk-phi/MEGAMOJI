import { Effect } from "../types";
import { HSV2RGB } from "../utils/color";

const effectBGDizzy: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
  const { data } = imageData;
  for (let row = 0; row < (cellHeight * cellWidth * 4); row += 4) {
    if (Math.floor(row / 4 + (keyframe * 40)) % 40 < 40
        && Math.floor(row / 4 + (keyframe * 40)) % 40 > 20) {
      const color = HSV2RGB({ h: Math.floor(keyframe * 360 * 4) % 360 + 180, s: 1, v: 1 });
      data[row] = color.r;
      data[row + 1] = color.g;
      data[row + 2] = color.b;
      data[row + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

export default effectBGDizzy;
