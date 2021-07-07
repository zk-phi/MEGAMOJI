export const POST_EFFECTS = [
  {
    label: "エフェクト",
    effects: [
      { label: "集中線", fn: postEffectFocusLine },
      { label: "グリッチ", fn: postEffectGlitch },
      { label: "モザイク", fn: postEffectMosaic },
    ],
  },
];

/** the idea based on https://qiita.com/nekoneko-wanwan/items/0911a59bf835d5b9e35a */
function postEffectFocusLine(keyframe, ctx, w, h) {
  const circumPos = (deg, r) => ({
    x: Math.cos(Math.PI / 180 * deg) * r + w / 2,
    y: Math.sin(Math.PI / 180 * deg) * r + h / 2,
  });

  const outerRadius = Math.sqrt((w / 4) ** 2 + (h / 4) ** 2);
  const innerRadiusMin = outerRadius * 0.6;
  const innerRadiusMax = outerRadius * 0.8;

  for (let i = 0; i < 200; i += 1) {
    const deg1 = Math.random() * 360;
    const deg2 = deg1 + Math.random() * 1.2;
    const innerRadius = Math.random() * (innerRadiusMax - innerRadiusMin) + innerRadiusMin;
    const pos1 = circumPos(deg1, outerRadius);
    const pos2 = circumPos(deg2, outerRadius);
    const pos3 = circumPos((deg1 + deg2) / 2, innerRadius);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = "black";
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.lineTo(pos3.x, pos3.y);
    ctx.fill();
    ctx.closePath();
  }
}

/** the ideas based on https://qiita.com/uriuriuriu/items/7be0ed117ab8ae3e7f79 */
function postEffectGlitch(keyframe, ctx, w, h) {
  // wave
  {
    const lineThickness = h / 25;
    const x = (h / 2 + lineThickness) * keyframe + h / 4 - lineThickness;
    const image = ctx.getImageData(0, x + lineThickness, w, lineThickness);
    ctx.putImageData(image, 0, x);
  }

  // random fill
  for (let i = 0; i < 3; i += 1) {
    const glitchH = 14 * Math.random() + 1;
    const glitchW = (w / 2 - 1) * Math.random() * 0.7 + 1;
    const glitchX1 = w / 4 + (w / 2 - glitchW) * Math.random();
    const glitchX2 = Math.random() < 0.5 ? w / 4 : 3 * w / 4 - glitchW;
    const glitchY = h / 4 + (h / 2 - glitchH) * Math.random();
    const image = ctx.getImageData(glitchX1, glitchY, glitchW, glitchH);
    ctx.putImageData(image, glitchX2, glitchY);
  }

  for (let y = h / 4; y < 3 * h / 4; y += 1) {
    if (Math.random() < 0.2) y += 1;
    const image = ctx.getImageData(0, y, w, 1);
    ctx.putImageData(image, Math.random() * 6 - 3, y);
  }
}

function postEffectMosaic(keyframe, ctx, w, h) {
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
}
