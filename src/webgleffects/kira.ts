import { gl, WebGLEffect } from '../webgleffects';
import shaderAdjust from '../shaders/adjust';

const webglKira: WebGLEffect = (keyframe, _w, _h, flipY) => {
  const program = shaderAdjust(flipY);
  gl.uniform1f(gl.getUniformLocation(program, 'brightness'), 0.1);
  gl.uniform1f(gl.getUniformLocation(program, 'contrast'), -0.1);
  gl.uniform1f(gl.getUniformLocation(program, 'hue'), -1 + 2 * keyframe);
};

export default webglKira;
