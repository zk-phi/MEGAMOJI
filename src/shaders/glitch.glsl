// ideas are based on https://qiita.com/uriuriuriu/items/7be0ed117ab8ae3e7f79

#define WAVE_HEIGHT 0.05
#define NOISE_STRENGTH 0.015
#define WARP_COUNT 2
#define WARP_MAX_WIDTH .35
#define WARP_MAX_HEIGHT .05
#define SCANLINE_STRENGTH 0.02
#define SCANLINE_FREQ 50.

precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform float keyframe;

@include "./utils/PI.glsl"
@include "./utils/step2.glsl"
@include "./utils/switch.glsl"
@include "./utils/random1.glsl"
@include "./utils/map.glsl"

float seed = keyframe;
float rand() {
  seed = random1(seed);
  return seed;
}

void main(void) {
  vec2 pos = vUv;

  // random warp
  for (int i = 0; i < WARP_COUNT; i++) {
    float blockW = rand() * WARP_MAX_WIDTH;
    float blockH = rand() * WARP_MAX_HEIGHT;
    float blockY = .25 + (.5 - blockH) * rand();
    float blockSrcX = .25 + (.5 - blockW) * rand();
    float blockDistX = switch(rand(), .5, .25, .75 - blockW);
    float flagX = step2(blockDistX, blockDistX + blockW, pos.x);
    float flagY = step2(blockY, blockY + blockH, pos.y);
    pos.x += flagX * flagY * (blockSrcX - blockDistX);
  }

  // noise
  pos.x += (random1(keyframe + pos.y) - 0.5) * NOISE_STRENGTH;

  // wave
  float y = mix(.25, .75, keyframe);
  pos.y += step2(y, y + WAVE_HEIGHT, pos.y) * WAVE_HEIGHT;

  vec4 color = texture2D(texture, pos);

  // scanline
  color = mix(color, vec4(vec3(0), 1.), SCANLINE_STRENGTH * sin(pos.y * 2. * PI * SCANLINE_FREQ));

  gl_FragColor = color;
}
