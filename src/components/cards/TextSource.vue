<script lang="ts">
import { defineComponent } from "vue";
import { NGrid, NGridItem } from "naive-ui";
import FontSelectBlock from "../formblocks/FontSelectBlock.vue";
import FontColorSelectBlock from "../formblocks/FontColorSelectBlock.vue";
import GradientBlock from "../formblocks/GradientBlock.vue";
import OutlineBlock from "../formblocks/OutlineBlock.vue";
import Button from "../inputs/Button.vue";
import Input from "../inputs/Input.vue";
import Textarea from "../inputs/Textarea.vue";
import ToggleButton from "../inputs/ToggleButton.vue";
import Fieldset from "../inputs/Fieldset.vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import AlignJustify from "../icons/AlignJustify.vue";
import AlignCenter from "../icons/AlignCenter.vue";
import AlignLeft from "../icons/AlignLeft.vue";
import AlignRight from "../icons/AlignRight.vue";

import { ColorStop } from "../../types";
import { absColor } from "../../utils/color";
import { makeTextImage } from "../../utils/textimage";
import { urlToImg } from "../../utils/canvas";
import { EMOJI_SIZE } from "../../constants/emoji";

export default defineComponent({
  components: {
    FontSelectBlock,
    FontColorSelectBlock,
    GradientBlock,
    OutlineBlock,
    Fieldset,
    Button,
    Input,
    Textarea,
    NGrid,
    NGridItem,
    Space,
    Card,
    ToggleButton,
    AlignJustify,
    AlignCenter,
    AlignLeft,
    AlignRight,
  },
  props: {
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data() {
    return {
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
  <Card v-if="show">
    <NGrid cols="1 440:3" :x-gap="24">
      <NGridItem>
        <FontSelectBlock
            v-model="conf.font"
            :show-details="showDetails" />
      </NGridItem>
      <NGridItem :span="2">
        <Fieldset label="テキスト (改行可)">
          <Space vertical full>
            <Textarea v-model="conf.content" block autofocus :rows="3" />
            <Space small>
              <ToggleButton v-model="conf.align" size="small" value="stretch">
                <AlignJustify />
              </ToggleButton>
              <ToggleButton v-model="conf.align" size="small" value="center">
                <AlignCenter />
              </ToggleButton>
              <ToggleButton v-model="conf.align" size="small" value="left">
                <AlignLeft />
              </ToggleButton>
              <ToggleButton v-model="conf.align" size="small" value="right">
                <AlignRight />
              </ToggleButton>
            </Space>
          </Space>
        </Fieldset>
        <Fieldset v-if="showDetails" label="行間 (文字分)">
          <Input v-model="conf.lineSpacing" />
        </Fieldset>
        <FontColorSelectBlock
            v-model="conf.color"
            :base-color="conf.color"
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
    <div style="text-align: right;">
      <Button type="text" @click="showDetails = !showDetails">
        {{ showDetails ? '- 詳細を閉じる' : '+ 詳細オプション' }}
      </Button>
    </div>
  </Card>
</template>
