import { Effect } from "../types";

const effectZoom: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const zoom = -0.5 * Math.cos(keyframe * 2 * Math.PI);
  ctx.transform(1 + zoom, 0, 0, 1 + zoom, -cellWidth / 2 * zoom, -cellHeight / 2 * zoom);
};

export default effectZoom;
