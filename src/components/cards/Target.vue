<script lang="ts">
import { NCard, NButton, NGrid, NGridItem } from "naive-ui";
import ColorBlock from "../formblocks/ColorBlock.vue";
import AnimationSelectBlock from "../formblocks/AnimationSelectBlock.vue";
import EffectBlock from "../formblocks/EffectBlock.vue";
import RangeBlock from "../formblocks/RangeBlock.vue";
import CheckboxBlock from "../formblocks/CheckboxBlock.vue";
import SelectBlock from "../formblocks/SelectBlock.vue";
import SwitchBlock from "../formblocks/SwitchBlock.vue";
import CellcountBlock from "../formblocks/CellcountBlock.vue";

import effects from "../../constants/effects";
import bgeffects from "../../constants/bgeffects";
import staticeffects from "../../constants/staticeffects";
import webgleffects from "../../constants/webgleffects";
import posteffects from "../../constants/posteffects";

import { renderAllCells } from "../../utils/emoji";
import { ANIMATED_EMOJI_SIZE, EMOJI_SIZE, BINARY_SIZE_LIMIT } from "../../constants/emoji";

export default {
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
    TRIMMING_OPTIONS: [
      { label: "ぴっちり", value: "" },
      { label: "はみだす (アス比維持)", value: "cover" },
      { label: "おさめる (アス比維持)", value: "contain" },
    ],
    SPEED_OPTIONS: [
      { label: "ふつう", value: "" },
      { label: "速い", value: "turbo" },
      { label: "爆速", value: "jet" },
    ],
    conf: {
      /* basic */
      trimming: "",
      speedPreset: "",
      cells: [1, 1],
      animation: null,
      animationInvert: false,
      staticEffects: [],
      effects: [],
      webglEffects: [],
      postEffects: [],
      /* advanced */
      trimH: [0, 0],
      trimV: [0, 0],
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
      } else if (speed === "jet") {
        this.conf.framerate = 60;
        this.conf.framecount = 6;
      }
    },
    refreshDefaultSettings(): void {
      if (this.baseImage && !this.showDetails) {
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
  <NCard v-if="show" segmented>
    <NGrid cols="1 600:2" :x-gap="24">
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
            v-model="conf.speedPreset"
            label="アニメ速度"
            :options="SPEED_OPTIONS"
            @update:model-value="selectSpeedPreset" />
        <RangeBlock
            v-if="showDetails"
            v-model="conf.framerate"
            label="FPS"
            :min="1"
            :max="60" />
        <RangeBlock
            v-if="showDetails"
            v-model="conf.framecount"
            label="フレーム数"
            :min="1"
            :max="12" />
        <ColorBlock
            v-model="conf.backgroundColor"
            label="背景色"
            :disabled="conf.transparent" />
        <SwitchBlock v-model="conf.transparent" label="透過 (アニメ gif は非推奨)" />
      </NGridItem>
    </NGrid>
    <template #footer>
      <div style="text-align: center">
        <NButton text @click="showDetails = !showDetails">
          {{ showDetails ? '- 詳細を閉じる' : '+ 詳細オプション' }}
        </NButton>
      </div>
    </template>
  </NCard>
</template>
