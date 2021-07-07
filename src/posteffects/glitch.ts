import { PostEffect } from "../posteffects";

/** the ideas based on https://qiita.com/uriuriuriu/items/7be0ed117ab8ae3e7f79 */
const postEffectGlitch: PostEffect = (keyframe, ctx, w, h) => {
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
};

export default postEffectGlitch;
