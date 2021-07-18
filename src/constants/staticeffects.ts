import effectFlip from "../effects/flip";
import effectFlipVertical from "../effects/flipVertical";

export default [
  {
    label: "反転",
    effects: [
      { label: "左右", value: effectFlip },
      { label: "上下", value: effectFlipVertical },
    ],
  },
];
