<script lang="ts">
import TextBlock from "../formblocks/TextBlock.vue";
import ColorBlock from "../formblocks/ColorBlock.vue";
import AnimationSelectBlock from "../formblocks/AnimationSelectBlock.vue";
import EffectBlock from "../formblocks/EffectBlock.vue";
import RangeBlock from "../formblocks/RangeBlock.vue";
import CheckboxBlock from "../formblocks/CheckboxBlock.vue";
import TrimmingSelectBlock from "../formblocks/TrimmingSelectBlock.vue";
import AnimationSpeedSelectBlock from "../formblocks/AnimationSpeedSelectBlock.vue";
import NumberBlock from "../formblocks/NumberBlock.vue";

import effects from "../../constants/effects";
import bgeffects from "../../constants/bgeffects";
import staticeffects from "../../constants/staticeffects";
import webgleffects from "../../constants/webgleffects";
import posteffects from "../../constants/posteffects";

import { renderAllCells } from "../../utils/emoji";
import { ANIMATED_EMOJI_SIZE, EMOJI_SIZE, BINARY_SIZE_LIMIT } from "../../constants/emoji";

export default {
  components: {
    TextBlock,
    ColorBlock,
    AnimationSelectBlock,
    EffectBlock,
    RangeBlock,
    CheckboxBlock,
    TrimmingSelectBlock,
    AnimationSpeedSelectBlock,
    NumberBlock,
  },
  props: {
    baseImage: { type: Object, default: null },
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data: (): Record<string, unknown> => ({
    effects,
    bgeffects,
    staticeffects,
    webgleffects,
    posteffects,
    conf: {
      /* basic */
      trimming: "",
      hCells: 1,
      vCells: 1,
      animation: null,
      animationInvert: false,
      staticEffects: [],
      effects: [],
      webglEffects: [],
      postEffects: [],
      /* advanced */
      offsetLeft: 0,
      offsetTop: 0,
      hZoom: "1.0",
      vZoom: "1.0",
      noCrop: false,
      framerate: 18,
      framecount: 12,
      backgroundColor: "#ffffff",
      transparent: false,
    },
    showDetails: false,
  }),
  watch: {
    baseImage: {
      handler(): void {
        if (this.baseImage) {
          this.refreshDefaultSettings();
          this.render();
        }
      },
    },
    conf: {
      handler(): void {
        this.render();
      },
      deep: true,
    },
  },
  methods: {
    selectSpeedPreset(speed: string): void {
      if (speed === "") {
        this.conf.framerate = 18;
        this.conf.framecount = 12;
      } else if (speed === "turbo") {
        this.conf.framerate = 60;
        this.conf.framecount = 12;
      } else if (speed === "super-turbo") {
        this.conf.framerate = 60;
        this.conf.framecount = 6;
      }
    },
    refreshDefaultSettings(): void {
      if (this.baseImage) {
        const image = this.baseImage;
        const v = this.conf.vCells;
        const h = this.conf.hCells;
        let widthRatio = (EMOJI_SIZE * h) / image.naturalWidth;
        let heightRatio = (EMOJI_SIZE * v) / image.naturalHeight;
        if (this.conf.trimming === "cover") {
          widthRatio = Math.max(widthRatio, heightRatio);
          heightRatio = widthRatio;
        } else if (this.conf.trimming === "contain") {
          widthRatio = Math.min(widthRatio, heightRatio);
          heightRatio = widthRatio;
        }
        const offsetLeft = (image.naturalWidth - EMOJI_SIZE / widthRatio * h) / 2;
        const offsetTop = (image.naturalHeight - EMOJI_SIZE / heightRatio * v) / 2;
        this.conf.hZoom = `${widthRatio}`;
        this.conf.vZoom = `${heightRatio}`;
        this.conf.offsetLeft = `${offsetLeft}`;
        this.conf.offsetTop = `${Math.min(0, offsetTop)}`;
      }
    },
    render(): void {
      if (this.baseImage) {
        const offsetLeft = Math.floor(Number(this.conf.offsetLeft));
        const offsetTop = Math.floor(Number(this.conf.offsetTop));

        const cellWidth = EMOJI_SIZE / this.conf.hZoom;
        const cellHeight = EMOJI_SIZE / this.conf.vZoom;

        const animated = (
          this.conf.animation
          || this.conf.effects.length
          || this.conf.webglEffects.length
          || this.conf.postEffects.length
        );

        const maxSize = animated ? ANIMATED_EMOJI_SIZE : EMOJI_SIZE;
        renderAllCells(
          this.baseImage,
          offsetLeft, offsetTop,
          this.conf.hCells || 1, this.conf.vCells || 1, cellWidth, cellHeight,
          maxSize, this.conf.noCrop,
          animated,
          this.conf.animation ? this.conf.animation.fn : null,
          this.conf.animationInvert,
          this.conf.effects.concat(this.conf.staticEffects).map((eff) => eff.fn),
          this.conf.webglEffects.map((eff) => eff.fn),
          this.conf.postEffects.map((eff) => eff.fn),
          this.conf.framerate, this.conf.framecount,
          this.conf.backgroundColor, this.conf.transparent, BINARY_SIZE_LIMIT,
        ).then((res) => {
          this.$emit("render", res);
        });
      }
    },
  },
};
</script>

<template>
  <div v-if="show" class="card">
    <div class="card-content">
      <div class="columns">
        <div class="column">
          <AnimationSelectBlock v-model="conf.animation" />
          <EffectBlock v-model="conf.webglEffects" :effects="webgleffects" />
          <EffectBlock v-model="conf.effects" :effects="effects" />
          <EffectBlock v-model="conf.postEffects" :effects="posteffects" />
          <EffectBlock v-if="showDetails" v-model="conf.effects" :effects="bgeffects" />
          <RangeBlock
              v-if="showDetails"
              v-model="conf.framerate"
              :label="`アニメ速度 (フレームレート): ${conf.framerate}`"
              :min="1"
              :max="60" />
          <RangeBlock
              v-if="showDetails"
              v-model="conf.framecount"
              :label="`フレーム数: ${conf.framecount}`"
              :min="1"
              :max="12" />
          <CheckboxBlock v-if="showDetails" v-model="conf.noCrop" label="開発者用">
            余白を切らない
          </CheckboxBlock>
        </div>
        <div class="column">
          <TrimmingSelectBlock
              v-model="conf.trimming"
              @update:model-value="refreshDefaultSettings" />
          <EffectBlock v-model="conf.staticEffects" :effects="staticeffects" />
          <AnimationSpeedSelectBlock @update:model-value="selectSpeedPreset" />
          <CheckboxBlock v-model="conf.animationInvert">
            進行方向を反転
          </CheckboxBlock>
          <ColorBlock
              v-model="conf.backgroundColor"
              label="背景色"
              :disabled="conf.transparent" />
          <CheckboxBlock v-model="conf.transparent">
            背景を塗らない (アニメ gif は非推奨)
          </CheckboxBlock>
          <NumberBlock
              v-if="showDetails"
              v-model="conf.hCells"
              :min="1"
              label="分割 横"
              @update:model-value="refreshDefaultSettings" />
          <NumberBlock
              v-if="showDetails"
              v-model="conf.vCells"
              :min="1"
              label="分割 縦"
              @update:model-value="refreshDefaultSettings" />
          <TextBlock
              v-if="showDetails"
              v-model="conf.offsetLeft"
              label="オフセット左 (px)" />
          <TextBlock
              v-if="showDetails"
              v-model="conf.offsetTop"
              label="オフセット上 (px)" />
          <TextBlock
              v-if="showDetails"
              v-model="conf.hZoom"
              label="拡大率 (横)" />
          <TextBlock
              v-if="showDetails"
              v-model="conf.vZoom"
              label="拡大率 (縦)" />
        </div>
      </div>
    </div>
    <div class="card-footer">
      <a class="card-footer-item" @click="showDetails = !showDetails">
        {{ showDetails ? '- 詳細を閉じる' : '+ 詳細オプション' }}
      </a>
    </div>
  </div>
</template>
