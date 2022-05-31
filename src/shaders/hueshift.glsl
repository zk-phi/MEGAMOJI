precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform float hue;

const mat3 rgb2yiq = mat3(
  0.299,  0.587,  0.114,
  0.596, -0.274, -0.321,
  0.211, -0.523,  0.311
);

const mat3 yiq2rgb = mat3(
  1.000,  0.956,  0.621,
  1.000, -0.272, -0.647,
  1.000, -1.107,  1.705
);

// rotate hue in YIQ color space
void main() {
  vec4 col = texture2D(texture, vUv);
  vec3 yiq = rgb2yiq * col.rgb;

  float newHue = atan(yiq[2], yiq[1]) + hue;
  float chroma = sqrt(yiq[2] * yiq[2] + yiq[1] * yiq[1]);

  vec3 newYiq = vec3(yiq[0], chroma * cos(newHue), chroma * sin(newHue));
  gl_FragColor = vec4(yiq2rgb * newYiq, col.a);
}
