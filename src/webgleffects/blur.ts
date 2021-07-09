import { WebGLEffect } from "../types";
import { webglSetVec2 } from "../webgleffects";
import shaderBlur from "../shaders/blur";

const webglBlur: WebGLEffect = (keyframe, _w, _h, args) => {
  const program = shaderBlur(args);
  const radius = 0.07 + 0.01 * Math.cos(2 * Math.PI * keyframe);
  webglSetVec2(program, "delta", [radius, 0]);
};

export default webglBlur;
