#define PI 3.141592653589793

precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform float width;
uniform float keyframe;
uniform float brightness;

void main(void) {
  gl_FragColor = texture2D(texture, vUv);
  // y = x + [-1, 1]
  float dist = vUv.x + 1. - keyframe * 2. - vUv.y;
  gl_FragColor.rgb += brightness * max(0., width - abs(dist)) / width;
}
