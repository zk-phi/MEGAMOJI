precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform float keyframe;

@include "./utils/random2.glsl"

void main(void) {
    vec2 vec = vUv - .5;
    vec2 angle = normalize(vec);
    float len = length(vec);

    float v = (1. - len) * random2(vUv) + .05;
    float d = v * keyframe;

    float flag = step(0., len - d);
    gl_FragColor = flag * texture2D(texture, vUv - d * angle - vec2(0., .3) * keyframe);
}
