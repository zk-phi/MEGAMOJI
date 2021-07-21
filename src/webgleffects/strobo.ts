import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderAdjust from "../shaders/adjust.glsl";

const shader = webglEffectShader(shaderAdjust.sourceCode);

let lastStrobe = true;
const webglStrobo: WebGLEffect = () => {
  const program = webglLoadEffectShader(shader);

  webglSetFloat(program, "brightness", lastStrobe ? 0 : -0.1);
  webglSetFloat(program, "saturation", 0);
  webglSetFloat(program, "hue", 0);

  lastStrobe = !lastStrobe;

  return program;
};

export default webglStrobo;
