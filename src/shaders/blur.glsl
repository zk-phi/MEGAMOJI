// based on glfx.js (by evanw, MIT License)

precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform vec2 delta;

@include "./utils/premultiplied.glsl"
@include "./utils/unmultiplied.glsl"

void main() {
  vec4 color = vec4(0.0);
  float total = 0.0;

  for (float t = -30.0; t <= 30.0; t++) {
    float percent = t / 30.0;
    float weight = 1.0 - abs(percent);
    vec4 sample = premultiplied(texture2D(texture, vUv + delta * percent));
    color += sample * weight;
    total += weight;
  }

  gl_FragColor = unmultiplied(color / total);
}
