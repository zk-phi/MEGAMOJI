import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderExplode from "../shaders/explode.glsl";

const shader = webglEffectShader(shaderExplode.sourceCode);

const webglExplode: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "keyframe", keyframe);
  return program;
};

export default webglExplode;
