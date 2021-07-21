// based on glfx.js (by evanw, MIT License)

precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform vec2 center;
uniform float strength;

@include "./utils/premultiplied.glsl"
@include "./utils/unmultiplied.glsl"

void main() {
  vec4 color = vec4(0.0);
  float total = 0.0;
  vec2 toCenter = center - vUv;

  for (float t = 0.0; t <= 40.0; t++) {
    float percent = t / 40.0;
    float weight = 4.0 * (percent - percent * percent);
    vec4 sample = premultiplied(texture2D(texture, vUv + toCenter * percent * strength));
    color += sample * weight;
    total += weight;
  }

  gl_FragColor = unmultiplied(color / total);
}
