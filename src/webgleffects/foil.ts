import { WebGLEffect } from "../types";
import { webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderAdjust from "../shaders/adjust";

const webglFoil: WebGLEffect = (keyframe, _w, _h) => {
  const program = webglLoadEffectShader(shaderAdjust);

  const brightness = 0.1 + 0.05 * Math.sin(2 * Math.PI * keyframe);
  webglSetFloat(program, "brightness", brightness);
  webglSetFloat(program, "contrast", -0.1);
  webglSetFloat(program, "hue", 0);

  return program;
};

export default webglFoil;
