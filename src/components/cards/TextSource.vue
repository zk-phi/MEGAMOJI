<script lang="ts">
import FontSelectBlock from "../formblocks/FontSelectBlock.vue";
import TextBlock from "../formblocks/TextBlock.vue";
import TextAreaBlock from "../formblocks/TextAreaBlock.vue";
import TextAlignSelectBlock from "../formblocks/TextAlignSelectBlock.vue";
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
    TextAlignSelectBlock,
    FontColorSelectBlock,
    GradientBlock,
    OutlineBlock,
  },
  props: {
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data: (): Record<string, unknown> => ({
    conf: {
      /* basic */
      content: "",
      align: "stretch",
      color: "#ffbf00",
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
  <div v-if="show" class="card">
    <div class="card-content">
      <div class="columns">
        <div class="column">
          <FontSelectBlock
              v-model="conf.font"
              :show-details="showDetails" />
          <TextBlock
              v-if="showDetails"
              v-model="conf.lineSpacing"
              label="行間 (文字分)" />
        </div>
        <div class="column">
          <TextAreaBlock
              v-model="conf.content"
              label="テキスト (改行可)"
              :rows="3" />
          <TextAlignSelectBlock
              v-model="conf.align" />
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
