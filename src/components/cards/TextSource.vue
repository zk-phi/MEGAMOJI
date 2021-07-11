<script lang="ts">
import { NCard, NButton, NGrid, NGridItem } from "naive-ui";
import FontSelectBlock from "../formblocks/FontSelectBlock.vue";
import TextBlock from "../formblocks/TextBlock.vue";
import TextAreaBlock from "../formblocks/TextAreaBlock.vue";
import SelectBlock from "../formblocks/SelectBlock.vue";
import FontColorSelectBlock from "../formblocks/FontColorSelectBlock.vue";
import GradientBlock from "../formblocks/GradientBlock.vue";
import OutlineBlock from "../formblocks/OutlineBlock.vue";

import { darkerColor, lighterColor } from "../../utils/color";
import { makeTextImage } from "../../utils/textimage";
import { urlToImg } from "../../utils/canvas";
import { EMOJI_SIZE } from "../../constants/emoji";

export default {
  components: {
    FontSelectBlock,
    TextBlock,
    TextAreaBlock,
    SelectBlock,
    FontColorSelectBlock,
    GradientBlock,
    OutlineBlock,
    NCard,
    NButton,
    NGrid,
    NGridItem,
  },
  props: {
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data: (): Record<string, unknown> => ({
    ALIGN_OPTIONS: [
      { label: "両端", value: "stretch" },
      { label: "左", value: "left" },
      { label: "中央", value: "center" },
      { label: "右", value: "right" },
    ],
    conf: {
      /* basic */
      content: "",
      align: "stretch",
      color: "#ffda00",
      gradient: [],
      outlines: [],
      font: "normal 1em sans-serif",
      /* advanced */
      lineSpacing: "0.05",
    },
    showDetails: false,
  }),
  computed: {
    outlineColors(): string[] {
      return this.conf.outlines.map((color) => {
        if (color === "darker") {
          return darkerColor(this.conf.color);
        } else if (color === "lighter") {
          return lighterColor(this.conf.color);
        } else if (color === "identical") {
          return this.conf.color;
        } else {
          return color;
        }
      });
    },
  },
  watch: {
    conf: {
      handler(): void {
        this.render();
      },
      deep: true,
    },
    "conf.color": {
      handler(): void {
        this.conf.gradient = [];
      },
    },
  },
  methods: {
    render(): void {
      if (this.conf.content) {
        const blobUrl = makeTextImage(
          this.conf.content,
          this.conf.color,
          this.conf.font.replace(/1em/, `${EMOJI_SIZE}px`),
          EMOJI_SIZE,
          this.conf.align,
          this.conf.lineSpacing * EMOJI_SIZE,
          this.outlineColors,
          this.conf.gradient,
        );
        urlToImg(blobUrl, (img) => this.$emit("render", img));
      }
    },
  },
};
</script>

<template>
  <NCard v-if="show" segmented>
    <NGrid cols="1 500:3" :x-gap="24">
      <NGridItem>
        <FontSelectBlock
            v-model="conf.font"
            :show-details="showDetails" />
      </NGridItem>
      <NGridItem :span="2">
        <TextAreaBlock
            v-model="conf.content"
            label="テキスト (改行可)"
            :rows="3" />
        <SelectBlock
            v-model="conf.align"
            label="揃え"
            :options="ALIGN_OPTIONS" />
        <TextBlock
            v-if="showDetails"
            v-model="conf.lineSpacing"
            label="行間 (文字分)" />
        <FontColorSelectBlock
            v-model="conf.color"
            :show-details="showDetails" />
        <GradientBlock
            v-model="conf.gradient"
            :base-color="conf.color" />
        <OutlineBlock
            v-model="conf.outlines"
            :base-color="conf.color"
            :show-details="showDetails" />
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
