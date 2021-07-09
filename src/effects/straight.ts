import { Effect } from "../types";
import { scaleCentered } from "../utils/canvas";

const effectStraight: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  if (keyframe < 0.5) {
    scaleCentered(ctx, cellWidth, cellHeight, keyframe * 2, keyframe * 2);
  }
};

export default effectStraight;
