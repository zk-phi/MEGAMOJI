precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform float hue;
uniform float saturation;
uniform float brightness;

@include "./utils/rgb2hsv.glsl"
@include "./utils/hsv2rgb.glsl"

void main(void) {
  vec4 col = texture2D(texture, vUv);
  vec3 hsv = rgb2hsv(col.rgb);

  hsv[0] += hue;
  hsv[1] += saturation;
  hsv[2] += brightness;

  gl_FragColor = vec4(hsv2rgb(hsv), col.a);
}
