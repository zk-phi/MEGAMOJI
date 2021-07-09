import { WebGLEffect } from "../types";
import { webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderAdjust from "../shaders/adjust";

const webglKira: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shaderAdjust);

  webglSetFloat(program, "brightness", 0.1);
  webglSetFloat(program, "contrast", -0.1);
  webglSetFloat(program, "hue", -1 + 2 * keyframe);

  return program;
};

export default webglKira;
