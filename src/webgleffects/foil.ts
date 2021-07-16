import { WebGLEffect } from "../types";
import { webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderFoil from "../shaders/foil";

const webglFoil: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shaderFoil);
  webglSetFloat(program, "width", 0.2);
  webglSetFloat(program, "brightness", 0.4);
  webglSetFloat(program, "keyframe", keyframe);
  return program;
};

export default webglFoil;
