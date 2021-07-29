<script lang="ts">
import { defineComponent } from "vue";
import { NCard, NGrid, NGridItem } from "naive-ui";
import FontSelectBlock from "../formblocks/FontSelectBlock.vue";
import TextBlock from "../formblocks/TextBlock.vue";
import TextAreaBlock from "../formblocks/TextAreaBlock.vue";
import SelectBlock from "../formblocks/SelectBlock.vue";
import FontColorSelectBlock from "../formblocks/FontColorSelectBlock.vue";
import GradientBlock from "../formblocks/GradientBlock.vue";
import OutlineBlock from "../formblocks/OutlineBlock.vue";
import Button from "../inputs/Button.vue";

import { ColorStop } from "../../types";
import { absColor } from "../../utils/color";
import { makeTextImage } from "../../utils/textimage";
import { urlToImg } from "../../utils/canvas";
import { EMOJI_SIZE } from "../../constants/emoji";

export default defineComponent({
  components: {
    FontSelectBlock,
    TextBlock,
    TextAreaBlock,
    SelectBlock,
    FontColorSelectBlock,
    GradientBlock,
    OutlineBlock,
    NCard,
    Button,
    NGrid,
    NGridItem,
  },
  props: {
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data() {
    return {
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
        gradient: [] as ColorStop[],
        outlines: [] as string[],
        font: "normal 1em sans-serif",
        /* advanced */
        lineSpacing: "0.05",
      },
      showDetails: false,
    };
  },
  computed: {
    absoluteOutlines(): string[] {
      return this.conf.outlines.map((outline) => absColor(outline, this.conf.color));
    },
    absoluteGradient(): { color: string, pos: number }[] {
      return this.conf.gradient.map((cs) => ({
        color: absColor(cs.color, this.conf.color),
        pos: cs.pos,
      }));
    },
  },
  watch: {
    conf: {
      handler(): void {
        if (window.ga) {
          window.ga("set", "dimension1", this.conf.font);
        }
        this.render();
      },
      deep: true,
    },
  },
  mounted() {
    if (window.ga) {
      window.ga("set", "dimension1", this.conf.font);
    }
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
          Number(this.conf.lineSpacing) * EMOJI_SIZE,
          this.absoluteOutlines,
          this.absoluteGradient,
        );
        urlToImg(blobUrl, (img) => this.$emit("render", img));
      }
    },
  },
});
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
        <Button type="text" @click="showDetails = !showDetails">
          {{ showDetails ? '- 詳細を閉じる' : '+ 詳細オプション' }}
        </Button>
      </div>
    </template>
  </NCard>
</template>
