import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderHueshift from "../shaders/hueshift.glsl";

const shader = webglEffectShader(shaderHueshift.sourceCode);

const webglKira: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);

  webglSetFloat(program, "hue", keyframe * 2 * Math.PI);

  return program;
};

export default webglKira;
