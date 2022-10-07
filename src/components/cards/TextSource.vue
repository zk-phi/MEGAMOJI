<script lang="ts">
import { defineComponent } from "vue";
import Analytics from "../../utils/analytics";
import FontSelectBlock from "../formblocks/FontSelectBlock.vue";
import FontColorSelectBlock from "../formblocks/FontColorSelectBlock.vue";
import OutlineBlock from "../formblocks/OutlineBlock.vue";
import Button from "../inputs/Button.vue";
import Textarea from "../inputs/Textarea.vue";
import ToggleButton from "../inputs/ToggleButton.vue";
import Fieldset from "../inputs/Fieldset.vue";
import Slider from "../inputs/Slider.vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import Grid from "../global/Grid.vue";
import GridItem from "../global/GridItem.vue";
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
    OutlineBlock,
    Fieldset,
    Slider,
    Button,
    Textarea,
    Grid,
    GridItem,
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
        lineSpacing: 0.05,
      },
      showDetails: false,
      /* internals */
      running: false,
      dirty: false,
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
        Analytics.changeFont(this.conf.font);
        this.render(true);
      },
      deep: true,
    },
  },
  mounted() {
    Analytics.changeFont(this.conf.font);
  },
  methods: {
    render(dirty?: boolean): void {
      if (dirty) {
        this.dirty = true;
      }
      if (!this.dirty || this.running) {
        return;
      }
      this.running = true;
      this.dirty = false;
      if (this.conf.content) {
        const blobUrl = makeTextImage(
          this.conf.content,
          this.conf.color,
          this.conf.font,
          EMOJI_SIZE,
          this.conf.align,
          Number(this.conf.lineSpacing) * EMOJI_SIZE,
          this.absoluteOutlines,
          this.absoluteGradient,
        );
        urlToImg(blobUrl, (img) => this.$emit("render", img));
      }
      window.setTimeout(() => {
        this.running = false;
        this.render();
      }, 50);
    },
  },
});
</script>

<template>
  <Card v-if="show">
    <Grid :columns="[[450, 1], [Infinity, 3]]" spaced>
      <GridItem>
        <FontSelectBlock
            v-model="conf.font"
            :show-details="showDetails" />
      </GridItem>
      <GridItem :span="2">
        <Space vertical xlarge full>
          <Fieldset label="テキスト (改行可)">
            <Space vertical full>
              <Textarea v-model="conf.content" block autofocus :rows="5" />
              <Space small>
                <ToggleButton v-model="conf.align" size="smallIcon" value="stretch">
                  <AlignJustify />
                </ToggleButton>
                <ToggleButton v-model="conf.align" size="smallIcon" value="center">
                  <AlignCenter />
                </ToggleButton>
                <ToggleButton v-model="conf.align" size="smallIcon" value="left">
                  <AlignLeft />
                </ToggleButton>
                <ToggleButton v-model="conf.align" size="smallIcon" value="right">
                  <AlignRight />
                </ToggleButton>
              </Space>
            </Space>
          </Fieldset>
          <Fieldset v-if="showDetails" label="行間 (文字分)">
            <Slider
                v-model="conf.lineSpacing"
                block
                :min="0"
                :max="1"
                :step="0.01" />
          </Fieldset>
          <FontColorSelectBlock
              v-model="conf.color"
              v-model:gradient="conf.gradient"
              :show-details="showDetails" />
          <OutlineBlock
              v-model="conf.outlines"
              :base-color="conf.color"
              :show-details="showDetails" />
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
</template>
