import { WebGLEffect } from "../types";
import { webglSetFloat } from "../webgleffects";
import shaderAdjust from "../shaders/adjust";

const webglFoil: WebGLEffect = (keyframe, _w, _h, args) => {
  const program = shaderAdjust(args);
  const brightness = 0.1 + 0.05 * Math.sin(2 * Math.PI * keyframe);
  webglSetFloat(program, "brightness", brightness);
  webglSetFloat(program, "contrast", -0.1);
  webglSetFloat(program, "hue", 0);
};

export default webglFoil;
