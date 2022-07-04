import { Effect } from "../types";
import { scaleCentered } from "../utils/canvas";

const effectStraight: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  scaleCentered(ctx, cellWidth, cellHeight, keyframe, keyframe);
};

export default effectStraight;
