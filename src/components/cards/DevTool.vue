<script lang="ts">
import { defineComponent } from "vue";
import { Animation, Effect, WebGLEffect } from "../../types";
import {
  webglEffectShader,
  webglLoadEffectShader,
  webglSetFloat,
  webglSetVec2,
} from "../../utils/webgl";
import Textarea from "../inputs/Textarea.vue";
import Button from "../inputs/Button.vue";
import Checkbox from "../inputs/Checkbox.vue";
import Fieldset from "../inputs/Fieldset.vue";
import TabGroup from "../inputs/TabGroup.vue";
import TabButton from "../inputs/TabButton.vue";
import Space from "../global/Space.vue";

const sampleAnimation = `// kf ... アニメーションの進度 (0-1)
// ctx ... CanvasRenderingContext2D
// src ... 入力画像
// sx, sy, sw, sh ... ユーザーが指定した描画範囲
// dw, dh ... 出力用 canvas のサイズ (外周はカットされます)

const dx = dw/4 * kf;
const dy = dh/4 * kf;

ctx.drawImage(src, sx, sy, sw, sh, dw/4 + dx, dh/4, dw/4, dh/4);
ctx.drawImage(src, sx, sy, sw, sh, dw/2, dh/4 + dy, dw/4, dh/4);
ctx.drawImage(src, sx, sy, sw, sh, dw/4, dh/2 - dy, dw/4, dh/4);
ctx.drawImage(src, sx, sy, sw, sh, dw/2 - dx, dh/2, dw/4, dh/4);
`;

const sampleEffect = `// kf ... アニメーションの進度 (0-1)
// ctx ... CanvasRenderingContext2D
// dw, dh ... 出力用 canvas のサイズ (外周はカットされます)

const dx = dw/8 * Math.sin(2 * Math.PI * kf);
ctx.translate(dx, 0);
`;

const sampleShader = `precision highp float;

uniform sampler2D texture; // 入力画像
varying vec2 vUv; // 二次元座標 (0-1)

uniform vec2 resolution; // 画像サイズ [w, h]
uniform float keyframe; // アニメーションの進度 (0-1)

#define PI 3.14159265359

void main(void) {
  vec4 color = texture2D(texture, vUv);
  float shineFactor = 0.1 * sin(2.0 * PI * keyframe) + 0.1;
  gl_FragColor =  vec4(color.rgb + shineFactor, color.a);
}
`;

export default defineComponent({
  components: {
    Textarea, Button, Checkbox, Space, Fieldset, TabGroup, TabButton,
  },
  props: {
    show: { type: Boolean, required: true },
    noCrop: { type: Boolean, required: true },
  },
  emits: [
    "update:noCrop", "buildAnimation", "buildEffect", "buildShader", "close",
  ],
  data: () => ({
    tab: "animation",
    source: {
      animation: sampleAnimation,
      effect: sampleEffect,
      webgl: sampleShader,
    },
  }),
  methods: {
    build(): void {
      if (this.tab === "animation") {
        this.buildAnimation();
      } else if (this.tab === "effect") {
        this.buildEffect();
      } else {
        this.buildShader();
      }
    },
    /* eslint-disable no-console, no-new-func */
    buildAnimation(): void {
      try {
        const animationImpl = new Function(
          "kf",
          "ctx",
          "src",
          "sx",
          "sy",
          "sw",
          "sh",
          "dw",
          "dh",
          this.source.animation,
        );
        const animation: Animation = (...args) => {
          try {
            animationImpl(...args);
          } catch (error) {
            console.log(error);
          }
        };
        this.$emit("buildAnimation", { label: "カスタム", value: animation });
      } catch (error) {
        console.log(error);
      }
    },
    buildEffect(): void {
      try {
        const effectImpl = new Function(
          "kf",
          "ctx",
          "dw",
          "dh",
          this.source.effect,
        );
        const effect: Effect = (...args) => {
          try {
            effectImpl(...args);
          } catch (error) {
            console.log(error);
          }
        };
        this.$emit("buildEffect", { label: "カスタム", value: effect });
      } catch (error) {
        console.log(error);
      }
    },
    buildShader(): void {
      try {
        const program: WebGLProgram = webglLoadEffectShader(webglEffectShader(this.source.webgl));
        const effect: WebGLEffect = (keyframe, w, h) => {
          webglSetFloat(program, "keyframe", keyframe);
          webglSetVec2(program, "resolution", [w, h]);
          return program;
        };
        this.$emit("buildShader", { label: "カスタム", value: effect });
      } catch (error) {
        console.log(error);
      }
    },
    /* eslint-enable */
  },
});
</script>

<template>
  <Space vertical xlarge full>
    <TabGroup>
      <TabButton v-model="tab" value="animation">
        アニメーション (js)
      </TabButton>
      <TabButton v-model="tab" value="effect">
        エフェクト (js)
      </TabButton>
      <TabButton v-model="tab" value="webgl">
        エフェクト (glsl)
      </TabButton>
    </TabGroup>
    <Fieldset label="ソース">
      <Space vertical full>
        <p class="description">
          コンパイルエラーはコンソールを見てください。
        </p>
        <p class="description">
          ※ 信頼できないコードを貼り付けないで下さい。セキュリティリスクになります。
        </p>
        <Textarea v-model="source[tab]" block :rows="20" />
        <Button @click="build">
          適用
        </Button>
      </Space>
    </Fieldset>
    <Fieldset label="デバッグ">
      <Checkbox
          :model-value="noCrop"
          name="余白を切らない"
          @update:model-value="$emit('update:noCrop', $event)">
        {{ "余白を切らない" }}
      </Checkbox>
    </Fieldset>
    <Button type="text" @click="$emit('close')">
      <template #icon>
        ↩︎
      </template>
      エフェクトエディタを抜ける
    </Button>
  </Space>
</template>

<style scoped>
.description {
  font-size: var(--fontSizeMedium);
}
</style>
