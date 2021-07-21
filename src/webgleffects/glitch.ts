import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderGlitch from "../shaders/glitch.glsl";

const shader = webglEffectShader(shaderGlitch.sourceCode);

const webglGlitch: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "keyframe", keyframe);
  return program;
};

export default webglGlitch;
