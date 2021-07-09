import { WebGLEffect } from "../types";
import { webglSetVec2 } from "../webgleffects";
import shaderBlur from "../shaders/blur";

const webglBlurVertical: WebGLEffect = (keyframe, _w, _h) => {
  const program = shaderBlur();

  const radius = 0.07 + 0.01 * Math.cos(2 * Math.PI * keyframe);
  webglSetVec2(program, "delta", [0, radius]);

  return program;
};

export default webglBlurVertical;
