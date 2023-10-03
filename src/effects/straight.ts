import { Effect } from "../types";
import { scaleCentered } from "../utils/canvas";

const effectStraight: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const scale = keyframe < 0.125 ? (
    1
  ) : keyframe < 0.875 ? (
    (keyframe - 0.125) / 0.75 // 0 -> 1
  ) : (
    1
  );
  scaleCentered(ctx, cellWidth, cellHeight, scale, scale);
};

export default effectStraight;
