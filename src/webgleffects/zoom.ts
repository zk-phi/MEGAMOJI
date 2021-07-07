import { gl, WebGLEffect } from '../webgleffects';
import shaderZoomBlur from '../shaders/zoomBlur';

const webglZoom: WebGLEffect = (keyframe, _w, _h, flipY) => {
  const program = shaderZoomBlur(flipY);
  const strength = 0.25 + 0.25 * Math.sin(2 * Math.PI * keyframe);
  gl.uniform2f(gl.getUniformLocation(program, 'center'), 0.5, 0.5);
  gl.uniform1f(gl.getUniformLocation(program, 'strength'), strength);
};

export default webglZoom;
