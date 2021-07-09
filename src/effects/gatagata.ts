import { Effect } from "../types";

let lastGata = false;

const effectGatagata: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  lastGata = !lastGata;
  ctx.translate(
    cellWidth / 2 + (Math.random() - 0.5) * 4,
    cellHeight / 2 + (Math.random() - 0.5) * 4,
  );
  ctx.rotate(lastGata ? -0.05 : 0.05);
  ctx.translate(-cellWidth / 2, -cellHeight / 2);
};

export default effectGatagata;
