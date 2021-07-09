import { Effect } from "../types";

const effectBlink: Effect = (keyframe, ctx, cellWidth) => {
  if (keyframe >= 0.5) {
    ctx.translate(-cellWidth * 2, 0); /* hide */
  }
};

export default effectBlink;
