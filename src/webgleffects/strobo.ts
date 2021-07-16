import { WebGLEffect } from "../types";
import { webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderAdjust from "../shaders/adjust";

let lastStrobe = true;
const webglStrobo: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shaderAdjust);

  webglSetFloat(program, "brightness", lastStrobe ? 0 : -0.1);
  webglSetFloat(program, "contrast", 0);
  webglSetFloat(program, "hue", 0);

  lastStrobe = !lastStrobe;

  return program;
};

export default webglStrobo;
