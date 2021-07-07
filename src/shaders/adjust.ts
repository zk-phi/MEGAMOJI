import { EffectShader, webglEffectShader } from "../webgleffects";

// based on glfx.js (by evanw, MIT License)

const shaderAdjust: EffectShader = webglEffectShader(`
  precision highp float;
  uniform sampler2D texture;
  uniform float hue;
  uniform float brightness;
  uniform float contrast;
  varying vec2 vUv;

  void main(void) {
    vec4 color = texture2D(texture, vUv);

    /* brightness */
    color.rgb += brightness;

    /* contrast */
    if (contrast > 0.0) {
      color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;
    } else {
      color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;
    }

    /* hue */
    if (hue != 0.0) {
      float angle = hue * 3.14159265;
      float s = sin(angle), c = cos(angle);
      vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
      float len = length(color.rgb);
      color.rgb = vec3(
          dot(color.rgb, weights.xyz),
          dot(color.rgb, weights.zxy),
          dot(color.rgb, weights.yzx)
      );
    }

    gl_FragColor = color;
  }
`);

export default shaderAdjust;
