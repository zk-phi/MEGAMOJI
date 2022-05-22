<script lang="ts">
import { defineComponent } from "vue";
import Analytics from "../utils/analytics";
import Header from "./global/Header.vue";
import Footer from "./global/Footer.vue";
import TextSource from "./cards/TextSource.vue";
import FileSource from "./cards/FileSource.vue";
import FukumojiSource from "./cards/FukumojiSource.vue";
import Target from "./cards/Target.vue";
import Result from "./cards/Result.vue";
import Tutorial from "./cards/Tutorial.vue";
import TabButton from "./inputs/TabButton.vue";
import TabGroup from "./inputs/TabGroup.vue";
import Space from "./global/Space.vue";
import Grid from "./global/Grid.vue";
import GridItem from "./global/GridItem.vue";
import Image from "./icons/Image.vue";
import Text from "./icons/Text.vue";
import Emoji from "./icons/Emoji.vue";
import "../css/destyle.css";

export default defineComponent({
  components: {
    TextSource,
    FileSource,
    FukumojiSource,
    Target,
    Result,
    Tutorial,
    TabButton,
    TabGroup,
    Header,
    Footer,
    Space,
    Grid,
    GridItem,
    Image,
    Text,
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
  mounted() {
    Analytics.switchMode("text");
  },
  methods: {
    onToggleShowTarget(): void {
      this.ui.showTargetPanel = !this.ui.showTargetPanel;
      Analytics.switchMode(this.ui.showTargetPanel ? "target" : this.ui.mode, true);
    },
    onSelectMode(value: string): void {
      this.ui.mode = value;
      this.ui.showTargetPanel = false;
      Analytics.switchMode(value, true);
    },
    onRenderTarget(imgs: Blob[][]): void {
      this.resultImages = imgs;
      Analytics.render();
    },
    onRender(img: HTMLImageElement): void {
      this.baseImage = img;
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

      <Grid :columns="[[760, 1], [Infinity, 3]]" spaced>
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
          <Result
              v-else
              :images="resultImages"
              :show-target="ui.showTargetPanel"
              @toggle-show-target="onToggleShowTarget" />
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
  --elevatedBg: var(--bg);
  --light: var(--bg);
  --dark: var(--fg);
  --distantFg: var(--bg);
  --border: #aaa;
  --primary: #ea0; /* okhsl(80, 100, 75) */
  --primaryHover: #ffb81c; /* v = 80 */
  --primaryActive: #de9e00; /* v = 70 */
  --primaryShadow: 0 0 0 2px rgba(238, 170, 0, 0.2);
  --danger: #ff91b4; /* h = 0 */
  --dangerHover: #ffaac4;
  --dangerActive: #ff77a7;
  --dangerShadow: 0 0 0 2px rgba(255, 145, 180, 0.2);

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
    --fg: #eee;
    --bg: #222;
    --accentBg: #333;
    --elevatedBg: #555;
    --light: var(--fg);
    --dark: var(--bg);
    --border: #777;
    --popoverShadow: none;
  }
}

/* stylelint-disable-next-line selector-max-type */
html {
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
  padding: var(--spacingLarge);
}
</style>
