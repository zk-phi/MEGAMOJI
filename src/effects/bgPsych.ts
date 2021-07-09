import { Effect } from "../types";
import { HSV2RGB } from "../utils/color";

const effectBGPsych: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
  const { data } = imageData;
  for (let row = 0; row < cellHeight; row += 1) {
    for (let col = 0; col < cellWidth; col += 1) {
      if (row % 10 <= 5 && col % 10 >= 5) {
        const color = HSV2RGB({ h: Math.floor(keyframe * 360 * 4 + 180) % 360, s: 1, v: 1 });
        data[(row * cellWidth + col) * 4] = color.r;
        data[(row * cellWidth + col) * 4 + 1] = color.g;
        data[(row * cellWidth + col) * 4 + 2] = color.b;
        data[(row * cellWidth + col) * 4 + 3] = 255;
      } else if (row % 10 < 5 !== col % 10 < 5) {
        const color = HSV2RGB({ h: Math.floor(keyframe * 360 * 4 + 90) % 360, s: 1, v: 1 });
        data[(row * cellWidth + col) * 4] = color.r;
        data[(row * cellWidth + col) * 4 + 1] = color.g;
        data[(row * cellWidth + col) * 4 + 2] = color.b;
        data[(row * cellWidth + col) * 4 + 3] = 255;
      } else {
        const color = HSV2RGB({ h: Math.floor(keyframe * 360 * 4) % 360, s: 1, v: 1 });
        data[(row * cellWidth + col) * 4] = color.r;
        data[(row * cellWidth + col) * 4 + 1] = color.g;
        data[(row * cellWidth + col) * 4 + 2] = color.b;
        data[(row * cellWidth + col) * 4 + 3] = 255;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

export default effectBGPsych;
