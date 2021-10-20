<script lang="ts">
import { defineComponent } from "vue";
import { saveAs } from "file-saver";
import Header from "./global/Header.vue";
import Footer from "./global/Footer.vue";
import TextSource from "./cards/TextSource.vue";
import FileSource from "./cards/FileSource.vue";
import FukumojiSource from "./cards/FukumojiSource.vue";
import Target from "./cards/Target.vue";
import Result from "./cards/Result.vue";
import Tutorial from "./cards/Tutorial.vue";
import Button from "./inputs/Button.vue";
import TabButton from "./inputs/TabButton.vue";
import TabGroup from "./inputs/TabGroup.vue";
import Space from "./global/Space.vue";
import Grid from "./global/Grid.vue";
import GridItem from "./global/GridItem.vue";
import Effect from "./icons/Effect.vue";
import Back from "./icons/Back.vue";
import Save from "./icons/Save.vue";
import Image from "./icons/Image.vue";
import Text from "./icons/Text.vue";
import Emoji from "./icons/Emoji.vue";
import { extension, prepareDownloadFile } from "../utils/file";
import "../css/destyle.css";

export default defineComponent({
  components: {
    TextSource,
    FileSource,
    FukumojiSource,
    Target,
    Result,
    Tutorial,
    Header,
    Footer,
    Space,
    Grid,
    GridItem,
    Button,
    TabButton,
    TabGroup,
    Effect,
    Back,
    Save,
    Text,
    Image,
    Emoji,
  },
  data() {
    return {
      baseImage: null as (HTMLImageElement | null),
      resultImages: [[]] as Blob[][],
      previewMode: false,
      /* ui */
      ui: {
        mode: "text",
        showTargetPanel: false,
        showTargetDetails: false,
      },
    };
  },
  computed: {
    resultImageUrls(): string[][] {
      return this.resultImages.map((row) => row.map((cell) => URL.createObjectURL(cell)));
    },
  },
  methods: {
    onSetShowTarget(value: boolean): void {
      this.ui.showTargetPanel = value;
      if (window.ga) {
        window.ga("send", "pageview", value ? "/target" : (`/${this.ui.mode}`));
      }
    },
    onSelectMode(value: string): void {
      this.ui.mode = value;
      this.ui.showTargetPanel = false;
      if (window.ga) {
        window.ga("send", "pageview", `/${value}`);
      }
    },
    onRenderTarget(imgs: Blob[][]): void {
      this.resultImages = imgs;
      if (window.ga) {
        window.ga("send", "event", this.ui.mode, "render");
      }
    },
    onRender(img: HTMLImageElement): void {
      this.baseImage = img;
    },
    onDownload(): void {
      const download = prepareDownloadFile(this.resultImages);
      download.then((res) => saveAs(res, `megamoji.${extension(res)}`));
      if (window.ga) {
        window.ga("send", "event", this.ui.mode, "download");
      }
    },
  },
});
</script>

<template>
  <div class="app">
    <Space vertical large full>
      <Header />

      <TabGroup>
        <TabButton :model-value="ui.mode" value="text" @update:model-value="onSelectMode">
          <template #icon>
            <Text />
          </template>
          テキスト
        </TabButton>
        <TabButton :model-value="ui.mode" value="file" @update:model-value="onSelectMode">
          <template #icon>
            <Image />
          </template>
          画像ファイル
        </TabButton>
        <TabButton :model-value="ui.mode" value="parts" @update:model-value="onSelectMode">
          <template #icon>
            <Emoji />
          </template>
          パーツ
        </TabButton>
      </TabGroup>

      <Grid :columns="[[760, 1], [Infinity, 3]]">
        <GridItem :span="2">
          <TextSource
              :show="ui.mode == 'text' && !ui.showTargetPanel"
              @render="onRender" />
          <FileSource
              :show="ui.mode == 'file' && !ui.showTargetPanel"
              @render="onRender" />
          <FukumojiSource
              :show="ui.mode == 'parts' && !ui.showTargetPanel"
              @render="onRender" />
          <Target
              :show="ui.showTargetPanel"
              :base-image="baseImage"
              @render="onRenderTarget" />
        </GridItem>
        <GridItem>
          <Tutorial v-if="!baseImage" />
          <Space v-else large vertical>
            <Result :images="resultImageUrls" />
            <Space>
              <Button v-if="ui.showTargetPanel" @click="onSetShowTarget(!ui.showTargetPanel)">
                <template #icon>
                  <Back />
                </template>
                もどる
              </Button>
              <Button v-else @click="onSetShowTarget(!ui.showTargetPanel)">
                <template #icon>
                  <Effect />
                </template>
                効果をつける
              </Button>
              <Button v-if="baseImage" type="primary" @click="onDownload">
                <template #icon>
                  <Save />
                </template>
                絵文字を保存
              </Button>
            </Space>
          </Space>
        </GridItem>
      </Grid>

      <Footer />
    </Space>
  </div>
</template>

<style>
:root {
  /* colors */
  --fg: #333;
  --bg: #fff;
  --accentBg: #fafafa;
  --light: var(--bg);
  --dark: var(--fg);
  --distantFg: var(--bg);
  --border: #888;
  --primary: #edad0b;
  --primaryHover: #f2c145;
  --primaryActive: #d59b0a;
  --primaryShadow: 0 0 0 2px rgba(237, 173, 11, 0.2);
  --danger: #c7243a;
  --dangerHover: #d04255;
  --dangerActive: #b32034;
  --dangerShadow: 0 0 0 2px rgba(199, 36, 58, 0.2);

  /* typography */
  --fontSizeTitle: 28px;
  --fontSizeXLarge: 18px;
  --fontSizeLarge: 16px;
  --fontSizeMedium: 14px;
  --fontSizeSmallIcon: 16px;
  --fontSizeIcon: 26px;
  --fontSizePart: 48px;
  --multilineTextLineHeight: 1.5;

  /* layout */
  --spacingSmall: 0.25rem;
  --spacingInlineSmall: 0.375rem;
  --spacingMedium: 0.5rem;
  --spacingLarge: 1rem;
  --spacingXLarge: 1.75rem;
  --paddingV: 0.75rem;
  --paddingH: 1rem;
  --padding: var(--paddingV) var(--paddingH);
  --paddingMinimal: 4px;
  --borderRadiusSmall: 1px;
  --borderRadius: 2px;

  /* other */
  --textareaLineHeight: 1.4;
  --selectPadding: var(--paddingV) calc(var(--paddingH) + 1rem) var(--paddingV) var(--paddingH);
  --numberPadding: var(--paddingV) calc(var(--paddingH) + 2rem) var(--paddingV) var(--paddingH);
  --sliderRailHeight: 0.375em;
  --sliderMarkHeight: 0.75em;
  --sliderKnobSize: 1.25em;
  --sliderValueMargin: 0.125em;
  --sliderValueWidth: 2.5em;
  --colorSliderRailHeight: 1.125em;
  --mediaIconSize: 34px;
  --popoverShadow: rgb(0 0 0 / 19%) 0 10px 20px, rgb(0 0 0 / 23%) 0 6px 6px;
  --tabButtonPadding: 0 calc(var(--paddingH) * 0.75) calc(var(--paddingV) - 3px);
}

@media (prefers-color-scheme: dark) {
  :root {
    --fg: #ccc;
    --bg: #333;
    --accentBg: #3a3a3a;
    --light: var(--fg);
    --dark: var(--bg);
    --border: #666;
  }
}

/* stylelint-disable-next-line selector-max-type */
html {
  padding: var(--spacingXLarge);
  font-family:
    "Helvetica Neue",
    Arial,
    "Hiragino Kaku Gothic ProN",
    "Hiragino Sans",
    Meiryo,
    sans-serif;
  font-size: var(--fontSizeMedium);
  line-height: 1;
  color: var(--fg);
  background-color: var(--bg);
}
</style>
