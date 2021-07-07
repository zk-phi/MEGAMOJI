import { EffectShader, webglEffectShader } from "../webgleffects";

const shaderWarp: EffectShader = webglEffectShader(`
  precision highp float;
  uniform mat3 matrix;
  uniform sampler2D texture;
  varying vec2 vUv;

  void main() {
    vec3 warp = matrix * vec3(vUv, 1.0);
    vec2 coord = warp.xy / warp.z;

    gl_FragColor = texture2D(texture, coord);
    vec2 clampedCoord = clamp(coord, vec2(0.0), vec2(1,1));
    if (coord != clampedCoord) {
      /* fade to transparent if we are outside the image */
      gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));
    }
  }
`);

export default shaderWarp;
