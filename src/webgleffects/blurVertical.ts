import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetVec2 } from "../utils/webgl";
import shaderBlur from "../shaders/blur.glsl";

const shader = webglEffectShader(shaderBlur.sourceCode);

const webglBlurVertical: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);

  const radius = 0.05 + 0.03 * Math.cos(2 * Math.PI * keyframe);
  webglSetVec2(program, "delta", [0, radius]);

  return program;
};

export default webglBlurVertical;
