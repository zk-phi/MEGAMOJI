import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat, webglSetVec2 } from "../utils/webgl";
import shaderZoomBlur from "../shaders/zoomBlur.glsl";

const shader = webglEffectShader(shaderZoomBlur.sourceCode);

const webglZoom: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);

  const strength = 0.25 - 0.25 * Math.cos(2 * Math.PI * keyframe);
  webglSetVec2(program, "center", [0.5, 0.5]);
  webglSetFloat(program, "strength", strength);

  return program;
};

export default webglZoom;
