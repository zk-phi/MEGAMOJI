import { Animation } from "../animations";
import animationScrollVertical from "./scrollVertical";

const animationPushVertical: Animation = (
  keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
) => {
  const kf = keyframe < 0.125 ? (
    keyframe * 4
  ) : keyframe < 0.875 ? (
    0.5
  ) : (
    (keyframe - 0.875) * 4 + 0.5
  );
  animationScrollVertical(
    kf, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight,
  );
};

export default animationPushVertical;
