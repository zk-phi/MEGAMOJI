import { gl, WebGLEffect } from '../webgleffects';
import shaderAdjust from '../shaders/adjust';

const webglFoil: WebGLEffect = (keyframe, _w, _h, args) => {
  const program = shaderAdjust(args);
  const brightness = 0.1 + 0.05 * Math.sin(2 * Math.PI * keyframe);
  gl.uniform1f(gl.getUniformLocation(program, 'brightness'), brightness);
  gl.uniform1f(gl.getUniformLocation(program, 'contrast'), -0.1);
  gl.uniform1f(gl.getUniformLocation(program, 'hue'), 0);
};

export default webglFoil;
