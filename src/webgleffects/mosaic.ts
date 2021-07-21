import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat, webglSetVec2 } from "../utils/webgl";
import shaderMosaic from "../shaders/mosaic.glsl";

const shader = webglEffectShader(shaderMosaic.sourceCode);

const webglMosaic: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);

  const size = 0.075;
  const offset = keyframe * size;
  webglSetFloat(program, "size", size);
  webglSetVec2(program, "offset", [offset, offset]);

  return program;
};

export default webglMosaic;
