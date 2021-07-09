import { WebGLEffect } from "../types";
import { webglSetFloat } from "../webgleffects";
import shaderAdjust from "../shaders/adjust";

const webglKira: WebGLEffect = (keyframe, _w, _h, args) => {
  const program = shaderAdjust(args);
  webglSetFloat(program, "brightness", 0.1);
  webglSetFloat(program, "contrast", -0.1);
  webglSetFloat(program, "hue", -1 + 2 * keyframe);
};

export default webglKira;
