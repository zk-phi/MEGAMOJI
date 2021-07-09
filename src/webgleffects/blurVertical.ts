import { WebGLEffect } from "../types";
import { webglLoadEffectShader, webglSetVec2 } from "../utils/webgl";
import shaderBlur from "../shaders/blur";

const webglBlurVertical: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shaderBlur);

  const radius = 0.07 + 0.01 * Math.cos(2 * Math.PI * keyframe);
  webglSetVec2(program, "delta", [0, radius]);

  return program;
};

export default webglBlurVertical;
