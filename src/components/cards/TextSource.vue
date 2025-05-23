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
import Select from "../inputs/Select.vue";
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

type PaddingOption = { label: string, value: number };

const PADDING_OPTIONS = [
  { label: "極小 (推奨)", value: 0.02 },
  { label: "大きめ (角丸対応)", value: 0.1 },
  { label: "なし", value: 0 },
];

export default defineComponent({
  components: {
    FontSelectBlock,
    FontColorSelectBlock,
    OutlineBlock,
    Fieldset,
    Slider,
    Select,
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
      PADDING_OPTIONS,
      conf: {
        /* basic */
        content: "",
        align: "stretch",
        color: "#ffb700",
        gradient: [] as ColorStop[],
        outlines: [] as string[],
        outlineThickness: 8,
        outlineX: 0,
        outlineY: 0,
        padding: PADDING_OPTIONS[0],
        font: fonts[0].fonts[0].value,
        /* advanced */
        lineSpacing: 0.05,
        paddingValue: 0.02,
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
          (this.emojiSize || EMOJI_SIZE) * 1.5,
          this.conf.align,
          Number(this.conf.lineSpacing),
          this.absoluteOutlines,
          this.conf.outlineThickness,
          this.conf.outlineX,
          this.conf.outlineY,
          this.absoluteGradient,
          Number(this.conf.paddingValue),
        );
        const name = this.conf.content.replace(/\n/g, "");
        this.$emit("render", canvas, name);
      }
      window.setTimeout(() => {
        this.running = false;
        this.render();
      }, 50);
    },
    selectPadding(padding: PaddingOption): void {
      this.conf.paddingValue = padding.value;
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
          <Fieldset v-if="showDetails" label="行間 (文字分)">
            <Slider
                v-model="conf.lineSpacing"
                block
                :min="0"
                :max="1"
                :step="0.01" />
          </Fieldset>
          <Fieldset v-if="showDetails" label="余白">
            <Slider
                v-model="conf.paddingValue"
                block
                :min="0"
                :max="0.5"
                :step="0.01" />
          </Fieldset>
          <Fieldset v-else label="余白">
            <Select
                v-model="conf.padding"
                name="余白"
                :options="PADDING_OPTIONS"
                @update:model-value="selectPadding($event)" />
          </Fieldset>
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
