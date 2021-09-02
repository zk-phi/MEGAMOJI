<script lang="ts">
import { defineComponent, PropType } from "vue";
import EffectBlock from "../formblocks/EffectBlock.vue";
import CellcountBlock from "../formblocks/CellcountBlock.vue";
import Button from "../inputs/Button.vue";
import Select from "../inputs/Select.vue";
import Checkbox from "../inputs/Checkbox.vue";
import Slider from "../inputs/Slider.vue";
import Fieldset from "../inputs/Fieldset.vue";
import Color from "../inputs/Color.vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import Grid from "../global/Grid.vue";
import GridItem from "../global/GridItem.vue";
import DevTool from "./DevTool.vue";

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
    Color,
    EffectBlock,
    Checkbox,
    CellcountBlock,
    Card,
    Button,
    Grid,
    GridItem,
    Fieldset,
    Space,
    Select,
    Slider,
    DevTool,
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
      devMode: false,
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
    devMode: {
      handler(): void {
        this.conf.animation = null;
        this.conf.effects = [];
        this.conf.webglEffects = [];
      },
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
  <Card v-if="show && !devMode">
    <Grid :columns="[[450, 1], [Infinity, 2]]">
      <GridItem>
        <Space vertical xlarge full>
          <Fieldset label="アニメーション">
            <Space vertical full>
              <Select v-model="conf.animation" nullable :options="animations" />
              <Checkbox v-model="conf.animationInvert">
                {{ "逆再生" }}
              </Checkbox>
            </Space>
          </Fieldset>
          <EffectBlock v-model="conf.webglEffects" :effects="webgleffects" />
          <EffectBlock v-model="conf.effects" :effects="effects" />
          <EffectBlock v-if="showDetails" v-model="conf.effects" :effects="bgeffects" />
          <Fieldset v-if="showDetails" label="開発者向け">
            <Button danger type="text" @click="devMode = true">
              開発者モード
            </Button>
          </Fieldset>
        </Space>
      </GridItem>
      <GridItem>
        <Space vertical xlarge full>
          <Fieldset v-if="!showDetails" label="切り抜き">
            <Select
                v-model="conf.trimming"
                :options="TRIMMING_OPTIONS"
                @update:model-value="refreshDefaultSettings" />
          </Fieldset>
          <CellcountBlock
              v-if="showDetails"
              v-model="conf.cells"
              @update:model-value="refreshDefaultSettings" />
          <Fieldset v-if="showDetails" label="トリミング 横">
            <Slider
                v-model="conf.trimH"
                block
                :marks="[0, baseImage.width]"
                :min="baseImage ? - Math.floor(baseImage.width * 0.5) : 0"
                :max="baseImage ? Math.ceil(baseImage.width * 1.5) : 0" />
          </Fieldset>
          <Fieldset v-if="showDetails" label="トリミング 縦">
            <Slider
                v-model="conf.trimV"
                block
                :marks="[0, baseImage.height]"
                :min="baseImage ? - Math.floor(baseImage.height * 0.5) : 0"
                :max="baseImage ? Math.ceil(baseImage.height * 1.5) : 0" />
          </Fieldset>
          <EffectBlock v-model="conf.staticEffects" :effects="staticeffects" />
          <Fieldset v-if="!showDetails" label="アニメ速度">
            <Select
                v-model="conf.speed"
                :options="SPEED_OPTIONS"
                @update:model-value="selectSpeed($event)" />
          </Fieldset>
          <Fieldset v-if="showDetails" label="アニメ長さ">
            <Slider
                v-model="conf.duration"
                block
                :min="0.1"
                :step="0.1"
                :max="2.0" />
          </Fieldset>
          <Fieldset label="背景色">
            <Space vertical full>
              <Color
                  v-model="conf.backgroundColor"
                  block
                  @update:model-value="conf.transparent = false" />
              <Checkbox v-model="conf.transparent">
                {{ "透過 (アニメ gif は非推奨)" }}
              </Checkbox>
            </Space>
          </Fieldset>
        </Space>
      </GridItem>
    </Grid>
    <template #footer>
      <div style="text-align: center;">
        <Button type="text" @click="showDetails = !showDetails">
          {{ showDetails ? '- 詳細を閉じる' : '+ 詳細オプション' }}
        </Button>
      </div>
    </template>
  </Card>
  <DevTool
      v-model:no-crop="conf.noCrop"
      :show="show && devMode"
      @close="devMode = false"
      @build-animation="conf.animation = $event"
      @build-effect="conf.effects = [$event]"
      @build-shader="conf.webglEffects = [$event]" />
</template>
