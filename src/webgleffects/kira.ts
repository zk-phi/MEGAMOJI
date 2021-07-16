import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderAdjust from "../shaders/adjust.glsl";

const shader = webglEffectShader(shaderAdjust.sourceCode);

const webglKira: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);

  webglSetFloat(program, "brightness", 0.1);
  webglSetFloat(program, "contrast", -0.1);
  webglSetFloat(program, "hue", -1 + 2 * keyframe);

  return program;
};

export default webglKira;
