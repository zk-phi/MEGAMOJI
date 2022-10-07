<script lang="ts">
import { defineComponent } from "vue";
import { load as loadFont, parse as parseFont, Font } from "opentype.js";
import Analytics from "../../utils/analytics";
import FontColorSelectBlock from "../formblocks/FontColorSelectBlock.vue";
import OutlineBlock from "../formblocks/OutlineBlock.vue";
import Button from "../inputs/Button.vue";
import Checkbox from "../inputs/Checkbox.vue";
import Textarea from "../inputs/Textarea.vue";
import ToggleButton from "../inputs/ToggleButton.vue";
import Fieldset from "../inputs/Fieldset.vue";
import FileSelect from "../inputs/FileSelect.vue";
import Slider from "../inputs/Slider.vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import Grid from "../global/Grid.vue";
import GridItem from "../global/GridItem.vue";
import AlignJustify from "../icons/AlignJustify.vue";
import AlignCenter from "../icons/AlignCenter.vue";
import AlignLeft from "../icons/AlignLeft.vue";
import AlignRight from "../icons/AlignRight.vue";
import Text from "../icons/Text.vue";

import { ColorStop } from "../../types";
import { absColor } from "../../utils/color";
import { makeTextImageSVG } from "../../utils/textimage";
import { urlToImg } from "../../utils/canvas";
import { EMOJI_SIZE } from "../../constants/emoji";
import fonts from "../../constants/fonts";

const fontCache: Record<string, Font> = {};

type FontPreview = { viewBox: string, pathData: string };
const makeFontPreview = (label: string, font: Font) => {
  const path = font.getPath(label, 0, 0, 32);
  const box = path.getBoundingBox();
  const viewBox = `${box.x1} ${box.y1} ${box.x2 - box.x1} ${box.y2 - box.y1}`;
  return { viewBox, pathData: path.toPathData(2) };
};

export default defineComponent({
  components: {
    FontColorSelectBlock,
    OutlineBlock,
    Fieldset,
    FileSelect,
    Slider,
    Button,
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
    Text,
  },
  props: {
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data() {
    return {
      fonts,
      fontPreviews: {} as Record<string, FontPreview>,
      conf: {
        /* basic */
        content: "",
        align: "stretch",
        color: "#ffda00",
        gradient: [] as ColorStop[],
        outlines: [] as string[],
        font: fonts[0].fonts[0].label,
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
    // render when a font is loaded (and dirty = true)
    fontPreviews: {
      handler(): void {
        this.render();
      },
      deep: true,
    },
  },
  mounted() {
    Analytics.changeFont(this.conf.font);
    fonts.forEach(category => category.fonts.forEach(async font => {
      const fontObj = await loadFont(font.uri);
      fontCache[font.label] = fontObj;
      this.fontPreviews[font.label] = makeFontPreview(font.label, fontObj);
    }));
  },
  methods: {
    render(dirty?: boolean): void {
      if (dirty) {
        this.dirty = true;
      }
      if (!this.dirty || this.running || !fontCache[this.conf.font]) {
        return;
      }
      this.running = true;
      this.dirty = false;
      if (this.conf.content) {
        const blobUrl = makeTextImageSVG(
          this.conf.content,
          this.conf.color,
          // i don't know why but "as Font" is needed here
          fontCache[this.conf.font] as Font,
          this.conf.align,
          Number(this.conf.lineSpacing),
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
    fontLoaded(buffer: ArrayBuffer) {
      const fontObj = parseFont(buffer)
      fontCache.custom = fontObj;
      this.fontPreviews.custom = makeFontPreview("その他", fontObj)
      this.conf.font = "custom";
    },
  },
});
</script>

<template>
  <Card v-if="show">
    <Grid :columns="[[450, 1], [Infinity, 3]]" spaced>
      <GridItem>
        <Space vertical xlarge full>
          <Fieldset v-for="(category, ix) in fonts" :key="category.label" :label="category.label">
            <Space vertical>
              <Checkbox
                  v-for="font in category.fonts"
                  v-model="conf.font"
                  :key="font.label"
                  :value="font.label">
                <svg
                    v-if="fontPreviews[font.label]"
                    class="font-preview"
                    :viewBox="fontPreviews[font.label].viewBox">
                  <path
                      fill="currentColor"
                      :d="fontPreviews[font.label].pathData" />
                </svg>
                <span v-else>{{ font.label }}</span>
              </Checkbox>
            </Space>
          </Fieldset>
          <Fieldset v-if="showDetails" label="その他のフォント">
            <Space vertical>
              <Checkbox v-if="fontPreviews.custom" v-model="conf.font" key="custom" value="custom">
                <svg class="font-preview" :viewBox="fontPreviews.custom.viewBox">
                  <path fill="currentColor" :d="fontPreviews.custom.pathData" />
                </svg>
              </Checkbox>
              <FileSelect type="buffer" @load="fontLoaded">
                <Text /> ファイルを選ぶ
              </FileSelect>
            </Space>
          </Fieldset>
        </Space>
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

<style scoped>
.font-preview {
  height: 1em;
  vertical-align: baseline;
}
</style>
