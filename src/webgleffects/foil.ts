import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderFoil from "../shaders/foil.glsl";

const shader = webglEffectShader(shaderFoil.sourceCode);

const webglFoil: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "width", 0.2);
  webglSetFloat(program, "brightness", 0.4);
  webglSetFloat(program, "keyframe", keyframe);
  return program;
};

export default webglFoil;
