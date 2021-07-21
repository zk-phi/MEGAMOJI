precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform float keyframe;
uniform float frequency;
uniform float amplitude;

@import "./utils/PI.glsl"

void main() {
  vec2 pos = vec2(vUv.x, vUv.y + amplitude * sin((keyframe + vUv.x) * frequency * 2. * PI));
  gl_FragColor = texture2D(texture, pos);
}
