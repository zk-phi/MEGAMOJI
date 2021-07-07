import { gl, WebGLEffect } from '../webgleffects';
import shaderBlur from '../shaders/blur';

const webglBlurVertical: WebGLEffect = (keyframe, _w, _h, flipY) => {
  const program = shaderBlur(flipY);
  const radius = 0.07 + 0.01 * Math.cos(2 * Math.PI * keyframe);
  gl.uniform2f(gl.getUniformLocation(program, 'delta'), 0, radius);
};

export default webglBlurVertical;
