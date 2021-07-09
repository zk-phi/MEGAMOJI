import { WebGLEffect } from "../types";
import { webglLoadEffectShader, webglSetFloat, webglSetVec2 } from "../utils/webgl";
import shaderZoomBlur from "../shaders/zoomBlur";

const webglZoom: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shaderZoomBlur);

  const strength = 0.25 + 0.25 * Math.sin(2 * Math.PI * keyframe);
  webglSetVec2(program, "center", [0.5, 0.5]);
  webglSetFloat(program, "strength", strength);

  return program;
};

export default webglZoom;
