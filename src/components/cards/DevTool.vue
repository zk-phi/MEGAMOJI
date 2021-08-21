<script lang="ts">
import { WebGLEffect } from "../../types";
import { defineComponent } from "vue";
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
import Card from "../global/Card.vue";
import Space from "../global/Space.vue";

const sampleAnimation = `ctx.drawImage(
  image, offsetH, offsetV, width, height,
  cellWidth / 4, cellHeight / 4, cellWidth / 2, cellHeight / 2,
);`;

const sampleEffect = "ctx.translate(0, 0);";

const sampleShader = `precision highp float;
uniform sampler2D texture;
varying vec2 vUv;

uniform vec2 resolution;
uniform float keyframe;

void main(void) {
  gl_FragColor = texture2D(texture, vUv);
}`;

export default defineComponent({
  components: {
    Card, Textarea, Button, Checkbox, Space, Fieldset, TabGroup, TabButton,
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
    buildAnimation(): void {
      // eslint-disable-next-line no-new-func
      const animation = new Function(
        "keyframe", "ctx", "image",
        "offsetH", "offsetV", "width", "height", "cellWidth", "cellHeight",
        this.source.animation,
      );
      this.$emit("buildAnimation", { label: "カスタム", value: animation });
    },
    buildEffect(): void {
      // eslint-disable-next-line no-new-func
      const effect = new Function(
        "keyframe", "ctx", "cellWidth", "cellHeight",
        this.source.effect,
      );
      this.$emit("buildEffect", { label: "カスタム", value: effect });
    },
    buildShader(): void {
      const webglEffect: WebGLEffect = (keyframe, w, h) => {
        const program = webglLoadEffectShader(webglEffectShader(this.source.webgl));
        webglSetFloat(program, "keyframe", keyframe);
        webglSetVec2(program, "resolution", [w, h]);
        return program;
      };
      this.$emit("buildShader", { label: "カスタム", value: webglEffect });
    },
  },
});
</script>

<template>
  <Card v-if="show">
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
          <p v-if="tab === 'animation'" class="description">
            args: keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight
          </p>
          <p v-if="tab === 'effect'" class="description">
            args: keyframe, ctx, cellWidth, cellHeight
          </p>
          <Textarea v-model="source[tab]" block :rows="20" />
          <Button @click="build">
            適用
          </Button>
        </Space>
      </Fieldset>
      <Fieldset label="デバッグ">
        <Checkbox :model-value="noCrop" @update:model-value="$emit('update:noCrop', $event)">
          {{ "余白を切らない" }}
        </Checkbox>
      </Fieldset>
      <Button type="text" @click="$emit('close')">
        開発者モードを終わる
      </Button>
    </Space>
  </Card>
</template>

<style scoped>
.description {
  font-size: var(--fontSizeMedium);
}
</style>
