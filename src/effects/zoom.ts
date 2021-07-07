import { Effect } from '../effects';

const effectZoom: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const zoom = Math.abs(keyframe - 0.5) * 2 - 0.5;
  ctx.transform(1 + zoom, 0, 0, 1 + zoom, -cellWidth / 2 * zoom, -cellHeight / 2 * zoom);
};

export default effectZoom;
