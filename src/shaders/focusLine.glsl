// idea based on https://blog.narumium.net/2020/06/16/glsl%E3%81%A7%E9%9B%86%E4%B8%AD%E7%B7%9A%E3%82%92%E6%9B%B8%E3%81%8F/

#define NUM_LINES 100.

precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform float keyframe;

@include "./utils/PI.glsl"
@include "./utils/random1.glsl"
@include "./utils/cross2.glsl"
@include "./utils/quantize.glsl"

void main(void) {
  vec2 p = vUv - vec2(.5);

  float rad = quantize(atan(p.y,p.x), -PI, PI, NUM_LINES);
  rad += 1.5 * random1(rad + keyframe) * (2. * PI / NUM_LINES);

  float prod = abs(cross2(vec2(cos(rad), sin(rad)), p));
  float flag = step(prod, .01 + .01 * length(p) * random1(rad + keyframe));

  float strength = pow(smoothstep(.1 + .05 * random1(rad + keyframe), sqrt(2.) * .25, length(p)), 2.);

  vec4 texColor = texture2D(texture, vUv);
  gl_FragColor = mix(texColor, vec4(vec3(0.), 1.), flag * strength);
}
