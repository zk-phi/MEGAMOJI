precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform float size;
uniform vec2 offset;

@include "./utils/premultiplied.glsl"
@include "./utils/unmultiplied.glsl"

void main() {
  vec2 topLeft = vUv - mod(vUv - offset, size);

  vec4 color = vec4(0.0);
  float total = 0.0;
  for (float x = 0.; x <= 10.; x++) {
    for (float y = 0.; y <= 10.; y++) {
      vec2 d = size * vec2(x / 10., y / 10.);
      color += premultiplied(texture2D(texture, topLeft + d));
    }
  }

  gl_FragColor = unmultiplied(color / 100.);
}
