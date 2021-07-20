import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderFocusLine from "../shaders/focusLine.glsl";

const shader = webglEffectShader(shaderFocusLine.sourceCode);

const webglFocusLine: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "keyframe", keyframe);
  return program;
};

export default webglFocusLine;
