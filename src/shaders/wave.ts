import { EffectShader, webglEffectShader } from "../utils/webgl";

const shaderWave: EffectShader = webglEffectShader(`
  #define PI 3.141592653589793

  precision highp float;
  uniform sampler2D texture;
  varying vec2 vUv;
  uniform float keyframe;
  uniform float frequency;
  uniform float amplitude;

  void main() {
    vec2 pos = vec2(vUv.x, vUv.y + amplitude * sin((keyframe + vUv.x) * frequency * 2. * PI));
    gl_FragColor = texture2D(texture, pos);
  }
`);

export default shaderWave;
