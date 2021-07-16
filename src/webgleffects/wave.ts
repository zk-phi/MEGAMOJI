import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderWave from "../shaders/wave.glsl";

const shader = webglEffectShader(shaderWave.sourceCode);

const webglWave: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "frequency", 2.0);
  webglSetFloat(program, "amplitude", 0.04);
  webglSetFloat(program, "keyframe", keyframe);
  return program;
};

export default webglWave;
