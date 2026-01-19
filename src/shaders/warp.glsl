precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform mat3 matrix;

void main() {
  vec3 warp = matrix * vec3(vUv, 1.0);
  vec2 coord = warp.xy / warp.z;

  vec2 clampedCoord = clamp(coord, vec2(0.0), vec2(1,1));
  if (coord != clampedCoord) {
    gl_FragColor = vec4(0.0);
  } else {
    gl_FragColor = texture2D(texture, coord);
  }
}
