import { PostEffect } from "../posteffects";

/** the idea based on https://qiita.com/nekoneko-wanwan/items/0911a59bf835d5b9e35a */
const postEffectFocusLine: PostEffect = (keyframe, ctx, w, h) => {
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
};

export default postEffectFocusLine;
