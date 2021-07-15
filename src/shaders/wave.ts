import { EffectShader, webglEffectShader } from "../utils/webgl";

const shaderWave: EffectShader = webglEffectShader(`
  #define PI 3.141592653589793

  precision highp float;
  uniform sampler2D texture;
  varying vec2 vUv;
  uniform float keyframe;

  void main() {
    vec2 pos = vec2(vUv.x, vUv.y + 0.04 * sin((keyframe + vUv.x) * 4. * PI));
    gl_FragColor = texture2D(texture, pos);
  }
`);

export default shaderWave;
