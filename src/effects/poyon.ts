import { Effect } from "../effects";

const effectPoyon: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  if (keyframe < 0.6) {
    ctx.translate(0, -cellHeight / 6 * Math.sin(Math.PI * keyframe / 0.6));
  } else {
    const ratio = Math.sin(Math.PI * (keyframe - 0.6) / 0.4) / 2;
    ctx.transform(
      1 + ratio,
      0, 0,
      1 - ratio,
      -ratio * cellWidth / 2, ratio * cellHeight * 3 / 4,
    );
  }
};

export default effectPoyon;
