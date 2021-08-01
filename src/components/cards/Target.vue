<script lang="ts">
import { defineComponent, PropType } from "vue";
import { NCard, NGrid, NGridItem, NFormItem } from "naive-ui";
import ColorBlock from "../formblocks/ColorBlock.vue";
import EffectBlock from "../formblocks/EffectBlock.vue";
import RangeBlock from "../formblocks/RangeBlock.vue";
import CheckboxBlock from "../formblocks/CheckboxBlock.vue";
import SwitchBlock from "../formblocks/SwitchBlock.vue";
import CellcountBlock from "../formblocks/CellcountBlock.vue";
import Button from "../inputs/Button.vue";
import Select from "../inputs/Select.vue";

import { Animation, Effect, WebGLEffect } from "../../types";
import animations from "../../constants/animations";
import effects from "../../constants/effects";
import bgeffects from "../../constants/bgeffects";
import staticeffects from "../../constants/staticeffects";
import webgleffects from "../../constants/webgleffects";

import { renderAllCells } from "../../utils/emoji";
import {
  EMOJI_SIZE,
  ANIMATED_EMOJI_SIZE,
  BINARY_SIZE_LIMIT,
  FRAMERATE_MAX,
  FRAMECOUNT_MAX,
} from "../../constants/emoji";

type AnimationOption = { label: string, value: Animation };
type EffectOption = { label: string, value: Effect };
type WebGLEffectOption = { label: string, value: WebGLEffect };
type SpeedOption = { label: string, value: number };

const TRIMMING_OPTIONS = [
  { label: "ぴっちり", value: "" },
  { label: "はみだす (アス比維持)", value: "cover" },
  { label: "おさめる (アス比維持)", value: "contain" },
];

const SPEED_OPTIONS = [
  { label: "コマ送り", value: 2.0 },
  { label: "遅い", value: 1.3 },
  { label: "ふつう", value: 0.8 },
  { label: "速い", value: 0.3 },
  { label: "爆速", value: 0.1 },
];

export default defineComponent({
  components: {
    ColorBlock,
    EffectBlock,
    RangeBlock,
    CheckboxBlock,
    SwitchBlock,
    CellcountBlock,
    NCard,
    Button,
    NGrid,
    NGridItem,
    NFormItem,
    Select,
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
      animations,
      effects,
      bgeffects,
      staticeffects,
      webgleffects,
      TRIMMING_OPTIONS,
      SPEED_OPTIONS,
      conf: {
        /* basic */
        trimming: TRIMMING_OPTIONS[0],
        speed: SPEED_OPTIONS[2],
        cells: [1, 1],
        animation: null as (AnimationOption | null),
        animationInvert: false,
        staticEffects: [] as EffectOption[],
        effects: [] as EffectOption[],
        webglEffects: [] as WebGLEffectOption[],
        /* advanced */
        trimH: [0, 0],
        trimV: [0, 0],
        noCrop: false,
        duration: SPEED_OPTIONS[2].value,
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
        if (window.ga) {
          const animationName = this.conf.animation ? this.conf.animation.label : "";
          const effectNames = [
            this.conf.staticEffects.map((e) => e.label).join(","),
            this.conf.effects.map((e) => e.label).join(","),
            this.conf.webglEffects.map((e) => e.label).join(","),
          ].join("/");
          window.ga("set", "dimension2", `${animationName}/${effectNames}`);
        }
        this.render();
      },
      deep: true,
    },
  },
  mounted() {
    if (window.ga) {
      window.ga("set", "dimension2", "///");
    }
  },
  methods: {
    refreshDefaultSettings(): void {
      if (this.baseImage) {
        const image = this.baseImage;
        const h = EMOJI_SIZE * this.conf.cells[0];
        const v = EMOJI_SIZE * this.conf.cells[1];
        let widthRatio = h / image.naturalWidth;
        let heightRatio = v / image.naturalHeight;
        if (this.conf.trimming.value === "cover") {
          widthRatio = Math.max(widthRatio, heightRatio);
          heightRatio = widthRatio;
        } else if (this.conf.trimming.value === "contain") {
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
    selectSpeed(speed: SpeedOption): void {
      this.conf.duration = speed.value;
    },
    render(): void {
      if (this.baseImage) {
        const animated = !!(
          this.conf.animation
          || this.conf.effects.length
          || this.conf.webglEffects.length
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
          this.conf.animation ? this.conf.animation.value : null,
          this.conf.animationInvert,
          this.conf.effects.concat(this.conf.staticEffects).map((eff) => eff.value),
          this.conf.webglEffects.map((eff) => eff.value),
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
        <NFormItem label="アニメーション">
          <Select v-model="conf.animation" block nullable :options="animations" />
        </NFormItem>
        <SwitchBlock v-if="showDetails" v-model="conf.animationInvert" label="逆再生" />
        <EffectBlock v-model="conf.webglEffects" :effects="webgleffects" />
        <EffectBlock v-model="conf.effects" :effects="effects" />
        <EffectBlock v-if="showDetails" v-model="conf.effects" :effects="bgeffects" />
        <CheckboxBlock v-if="showDetails" v-model="conf.noCrop" label="開発者用">
          余白を切らない
        </CheckboxBlock>
      </NGridItem>
      <NGridItem>
        <NFormItem v-if="!showDetails" label="切り抜き">
          <Select
              v-model="conf.trimming"
              block
              :options="TRIMMING_OPTIONS"
              @update:model-value="refreshDefaultSettings" />
        </NFormItem>
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
        <NFormItem v-if="!showDetails" label="アニメ速度">
          <Select
              v-model="conf.speed"
              block
              :options="SPEED_OPTIONS"
              @update:model-value="selectSpeed($event)" />
        </NFormItem>
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
        <Button type="text" @click="showDetails = !showDetails">
          {{ showDetails ? '- 詳細を閉じる' : '+ 詳細オプション' }}
        </Button>
      </div>
    </template>
  </NCard>
</template>
