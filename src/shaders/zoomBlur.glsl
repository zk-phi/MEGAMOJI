// based on glfx.js (by evanw, MIT License)

precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform vec2 center;
uniform float strength;

@include "./utils/random.glsl"

void main() {
  vec4 color = vec4(0.0);
  float total = 0.0;
  vec2 toCenter = center - vUv;

  /* randomize the lookup values to hide the fixed number of samples */
  float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);

  for (float t = 0.0; t <= 40.0; t++) {
    float percent = (t + offset) / 40.0;
    float weight = 4.0 * (percent - percent * percent);
    vec4 sample = texture2D(texture, vUv + toCenter * percent * strength);

    /* switch to pre-multiplied alpha to correctly blur transparent images */
    sample.rgb *= sample.a;

    color += sample * weight;
    total += weight;
  }

  gl_FragColor = color / total;

  /* switch back from pre-multiplied alpha */
  gl_FragColor.rgb /= gl_FragColor.a + 0.00001;
}
