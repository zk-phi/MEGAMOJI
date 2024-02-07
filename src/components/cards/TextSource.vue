<script lang="ts">
import { defineComponent } from "vue";
import Analytics from "../../utils/analytics";
import FontSelectBlock from "../formblocks/FontSelectBlock.vue";
import FontColorSelectBlock from "../formblocks/FontColorSelectBlock.vue";
import OutlineBlock from "../formblocks/OutlineBlock.vue";
import Checkbox from "../inputs/Checkbox.vue";
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
import { EMOJI_SIZE } from "../../constants/emoji";
import fonts from "../../constants/fonts";

export default defineComponent({
  components: {
    FontSelectBlock,
    FontColorSelectBlock,
    OutlineBlock,
    Fieldset,
    Slider,
    Checkbox,
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
    emojiSize: { type: Number, default: null },
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
        outlineThickness: 8,
        outlineX: 0,
        outlineY: 0,
        font: fonts[0].fonts[0].value,
        /* advanced */
        lineSpacing: 0.05,
        padding: 0.02,
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
    emojiSize: {
      handler(): void {
        this.render(true);
      },
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
        const canvas = makeTextImage(
          this.conf.content,
          this.conf.color,
          this.conf.font,
          this.emojiSize || EMOJI_SIZE,
          this.conf.align,
          Number(this.conf.lineSpacing),
          this.absoluteOutlines,
          this.conf.outlineThickness,
          this.conf.outlineX,
          this.conf.outlineY,
          this.absoluteGradient,
          Number(this.conf.padding),
        );
        const name = this.conf.content.replace(/\n/g, "");
        this.$emit("render", canvas, name);
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
              <Textarea
                  v-model="conf.content"
                  name="テキスト"
                  block
                  autofocus
                  :rows="5" />
              <Space small>
                <ToggleButton
                    v-model="conf.align"
                    name="両端揃え"
                    size="smallIcon"
                    value="stretch">
                  <AlignJustify />
                </ToggleButton>
                <ToggleButton
                    v-model="conf.align"
                    name="中央揃え"
                    size="smallIcon"
                    value="center">
                  <AlignCenter />
                </ToggleButton>
                <ToggleButton
                    v-model="conf.align"
                    name="左揃え"
                    size="smallIcon"
                    value="left">
                  <AlignLeft />
                </ToggleButton>
                <ToggleButton
                    v-model="conf.align"
                    name="右揃え"
                    size="smallIcon"
                    value="right">
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
          <Fieldset v-if="showDetails" label="パディング (文字分)">
            <Slider
                v-model="conf.padding"
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
              v-model:thickness="conf.outlineThickness"
              v-model:posX="conf.outlineX"
              v-model:posY="conf.outlineY"
              :base-color="conf.color"
              :show-details="showDetails" />
        </Space>
      </GridItem>
    </Grid>
    <template #footer>
      <Checkbox v-model="showDetails" name="職人モード(テキスト)">
        {{ "職人モード" }}
      </Checkbox>
    </template>
  </Card>
</template>

<style scoped>
.font-preview {
  height: 1em;
  vertical-align: baseline;
}
</style>
