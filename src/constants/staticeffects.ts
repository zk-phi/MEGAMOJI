import effectFlip from "../effects/flip";
import effectFlipVertical from "../effects/flipVertical";

export default [
  {
    effects: [
      { label: "左右を反転", fn: effectFlip },
      { label: "上下を反転", fn: effectFlipVertical },
    ],
  },
];
