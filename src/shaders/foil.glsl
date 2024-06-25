precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform float keyframe;
uniform float ratio;
uniform float width;
uniform float brightness;

void main(void) {
  gl_FragColor = texture2D(texture, vUv);
  // y = ratio * x + [1, - ratio]
  float dist = ratio * vUv.x + 1. - (ratio + 1.) * keyframe - vUv.y;
  gl_FragColor.rgb += brightness * max(0., width - abs(dist / sqrt(ratio))) / width;
}
