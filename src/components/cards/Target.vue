<script lang="ts">
import { defineComponent, PropType } from "vue";
import { NCard, NButton, NGrid, NGridItem } from "naive-ui";
import ColorBlock from "../formblocks/ColorBlock.vue";
import AnimationSelectBlock from "../formblocks/AnimationSelectBlock.vue";
import EffectBlock from "../formblocks/EffectBlock.vue";
import RangeBlock from "../formblocks/RangeBlock.vue";
import CheckboxBlock from "../formblocks/CheckboxBlock.vue";
import SelectBlock from "../formblocks/SelectBlock.vue";
import SwitchBlock from "../formblocks/SwitchBlock.vue";
import CellcountBlock from "../formblocks/CellcountBlock.vue";

import { Animation, Effect, WebGLEffect, PostEffect } from "../../types";
import effects from "../../constants/effects";
import bgeffects from "../../constants/bgeffects";
import staticeffects from "../../constants/staticeffects";
import webgleffects from "../../constants/webgleffects";
import posteffects from "../../constants/posteffects";

import { renderAllCells } from "../../utils/emoji";
import {
  EMOJI_SIZE,
  ANIMATED_EMOJI_SIZE,
  BINARY_SIZE_LIMIT,
  FRAMERATE_MAX,
  FRAMECOUNT_MAX,
} from "../../constants/emoji";

type AnimationOption = { label: string, fn: Animation };
type EffectOption = { label: string, fn: Effect };
type WebGLEffectOption = { label: string, fn: WebGLEffect };
type PostEffectOption = { label: string, fn: PostEffect };

export default defineComponent({
  components: {
    ColorBlock,
    AnimationSelectBlock,
    EffectBlock,
    RangeBlock,
    CheckboxBlock,
    SelectBlock,
    SwitchBlock,
    CellcountBlock,
    NCard,
    NButton,
    NGrid,
    NGridItem,
  },
  props: {
    baseImage: { type: Object as PropType<HTMLImageElement>, default: null },
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data() {
    return {
      effects,
      bgeffects,
      staticeffects,
      webgleffects,
      posteffects,
      TRIMMING_OPTIONS: [
        { label: "ぴっちり", value: "" },
        { label: "はみだす (アス比維持)", value: "cover" },
        { label: "おさめる (アス比維持)", value: "contain" },
      ],
      SPEED_OPTIONS: [
        { label: "スローモ", value: 2.0 },
        { label: "遅い", value: 1.3 },
        { label: "ふつう", value: 0.8 },
        { label: "速い", value: 0.3 },
        { label: "爆速", value: 0.1 },
      ],
      conf: {
        /* basic */
        trimming: "",
        speedPreset: "",
        cells: [1, 1],
        animation: null as (AnimationOption | null),
        animationInvert: false,
        staticEffects: [] as EffectOption[],
        effects: [] as EffectOption[],
        webglEffects: [] as WebGLEffectOption[],
        postEffects: [] as PostEffectOption[],
        /* advanced */
        trimH: [0, 0],
        trimV: [0, 0],
        noCrop: false,
        duration: 0.8,
        backgroundColor: "#ffffff",
        transparent: false,
      },
      showDetails: false,
    };
  },
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
    refreshDefaultSettings(): void {
      if (this.baseImage) {
        const image = this.baseImage;
        const h = EMOJI_SIZE * this.conf.cells[0];
        const v = EMOJI_SIZE * this.conf.cells[1];
        let widthRatio = h / image.naturalWidth;
        let heightRatio = v / image.naturalHeight;
        if (this.conf.trimming === "cover") {
          widthRatio = Math.max(widthRatio, heightRatio);
          heightRatio = widthRatio;
        } else if (this.conf.trimming === "contain") {
          widthRatio = Math.min(widthRatio, heightRatio);
          heightRatio = widthRatio;
        }
        const offsetH = Math.floor((image.naturalWidth - h / widthRatio) / 2);
        const offsetV = Math.floor((image.naturalHeight - v / heightRatio) / 2);
        this.conf.trimH = [offsetH, image.naturalWidth - offsetH];
        this.conf.trimV = offsetV < 0 ? (
          [offsetV, image.naturalHeight - offsetV]
        ) : (
          [0, image.naturalHeight - offsetV * 2]
        );
      }
    },
    render(): void {
      if (this.baseImage) {
        const animated = (
          this.conf.animation
          || this.conf.effects.length
          || this.conf.webglEffects.length
          || this.conf.postEffects.length
        );

        const framerate = Math.min(FRAMERATE_MAX, Math.ceil(FRAMECOUNT_MAX / this.conf.duration));
        const framecount = Math.floor(this.conf.duration * framerate);

        const maxSize = animated ? ANIMATED_EMOJI_SIZE : EMOJI_SIZE;
        renderAllCells(
          this.baseImage,
          this.conf.trimH[0], this.conf.trimV[0],
          this.conf.cells[0], this.conf.cells[1],
          this.conf.trimH[1] - this.conf.trimH[0],
          this.conf.trimV[1] - this.conf.trimV[0],
          maxSize, this.conf.noCrop,
          animated,
          this.conf.animation ? this.conf.animation.fn : null,
          this.conf.animationInvert,
          this.conf.effects.concat(this.conf.staticEffects).map((eff) => eff.fn),
          this.conf.webglEffects.map((eff) => eff.fn),
          this.conf.postEffects.map((eff) => eff.fn),
          framerate, framecount,
          this.conf.backgroundColor, this.conf.transparent, BINARY_SIZE_LIMIT,
        ).then((res) => {
          this.$emit("render", res);
        });
      }
    },
  },
});
</script>

<template>
  <NCard v-if="show" segmented>
    <NGrid cols="1 500:2" :x-gap="24">
      <NGridItem>
        <AnimationSelectBlock v-model="conf.animation" />
        <SwitchBlock v-if="showDetails" v-model="conf.animationInvert" label="逆再生" />
        <EffectBlock v-model="conf.webglEffects" :effects="webgleffects" />
        <EffectBlock v-model="conf.effects" :effects="effects" />
        <EffectBlock v-model="conf.postEffects" :effects="posteffects" />
        <EffectBlock v-if="showDetails" v-model="conf.effects" :effects="bgeffects" />
        <CheckboxBlock v-if="showDetails" v-model="conf.noCrop" label="開発者用">
          余白を切らない
        </CheckboxBlock>
      </NGridItem>
      <NGridItem>
        <SelectBlock
            v-if="!showDetails"
            v-model="conf.trimming"
            label="切りぬき"
            :options="TRIMMING_OPTIONS"
            @update:model-value="refreshDefaultSettings" />
        <CellcountBlock
            v-if="showDetails"
            v-model="conf.cells"
            @update:model-value="refreshDefaultSettings" />
        <RangeBlock
            v-if="showDetails"
            v-model="conf.trimH"
            range
            label="トリミング 横"
            :marks="{ 0: 'L', [baseImage.width]: 'R' }"
            :min="baseImage ? - Math.floor(baseImage.width * 0.5) : 0"
            :max="baseImage ? Math.ceil(baseImage.width * 1.5) : 0" />
        <RangeBlock
            v-if="showDetails"
            v-model="conf.trimV"
            range
            label="トリミング 縦"
            :marks="{ 0: 'T', [baseImage.height]: 'B' }"
            :min="baseImage ? - Math.floor(baseImage.height * 0.5) : 0"
            :max="baseImage ? Math.ceil(baseImage.height * 1.5) : 0" />
        <EffectBlock v-model="conf.staticEffects" :effects="staticeffects" />
        <SelectBlock
            v-if="!showDetails"
            v-model="conf.duration"
            label="アニメ速度"
            :options="SPEED_OPTIONS" />
        <RangeBlock
            v-if="showDetails"
            v-model="conf.duration"
            label="アニメ長さ"
            :min="0.1"
            :step="0.1"
            :max="2.0" />
        <ColorBlock
            v-model="conf.backgroundColor"
            label="背景色"
            :disabled="conf.transparent" />
        <SwitchBlock v-model="conf.transparent" label="透過 (アニメ gif は非推奨)" />
      </NGridItem>
    </NGrid>
    <template #footer>
      <div style="text-align: center;">
        <NButton text @click="showDetails = !showDetails">
          {{ showDetails ? '- 詳細を閉じる' : '+ 詳細オプション' }}
        </NButton>
      </div>
    </template>
  </NCard>
</template>
