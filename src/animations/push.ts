import { Animation } from "../types";
import animationScroll from "./scroll";

const animationPush: Animation = (
  keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
) => {
  /*   push: 0 0.5   0.5   1.0
   * scroll: 0 0.125 0.875 1.0 */
  const kf = keyframe < 0.125 ? (
    keyframe * 4
  ) : keyframe < 0.875 ? (
    0.5
  ) : (
    (keyframe - 0.875) * 4 + 0.5
  );
  animationScroll(
    kf, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
  );
};

export default animationPush;
