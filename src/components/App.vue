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
      emojiSize: null as (number | null),
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
              :emoji-size="emojiSize"
              @render="onRender" />
          <FileSource
              :show="ui.mode == 'file' && !ui.showTargetPanel"
              @render="onRender" />
          <FukumojiSource
              :show="ui.mode == 'parts' && !ui.showTargetPanel"
              @render="onRender" />
          <Target
              v-model:emoji-size="emojiSize"
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
  --fg:             #000000d0;
  --bg:             #ffffffff;
  --accentBg:       #00000004;
  --border:         #00000040;
  --primaryLighter: #ffb81c; /* l = 80 */
  --primary:        #eeaa00; /* okhsl(80, 100, 75) */
  --primaryDarker:  #cd9200; /* l = 65 */
  --dangerLighter:  #fa837e; /* l = 70 */
  --danger:         #f76b68; /* okhsl(24, 90, 65) */
  --dangerDarker:   #e53c42; /* l = 55 */
  --primaryBg:      #eeaa0020;
  --dangerBg:       #f76b6820;
  --primaryShadow:  0 0 0 2px #eeaa0030;
  --dangerShadow:   0 0 0 2px #f76b6830;

  --elevatedBg:      #ffffffff;
  --elevationShadow: rgb(0 0 0 / 0.19) 0 10px 20px, rgb(0 0 0 / 0.23) 0 6px 6px;

  --pressableShadowDefault:      0 1px #00000040;
  --pressableShadowPrimary:      0 1px #00000020, 0 1px var(--primary);
  --pressableShadowPrimaryHover: 0 1px #00000020, 0 1px var(--primaryLighter);
  --pressableShadowDanger:       0 1px #00000020, 0 1px var(--danger);
  --pressableShadowDangerHover:  0 1px #00000020, 0 1px var(--dangerLighter);

  --distantFg:     var(--bg);
  --light:         var(--bg);
  --dark:          var(--fg);
  --primaryHover:  var(--primaryLighter);
  --primaryActive: var(--primaryDarker);
  --dangerHover:   var(--dangerLighter);
  --dangerActive:  var(--dangerDarker);
}

@media (prefers-color-scheme: dark) {
  :root {
    --fg:             #ffffffd0;
    --bg:             #222222ff;
    --accentBg:       #ffffff10;
    --border:         #ffffff40;
    --primaryLighter: #e6af47; /* l = 75 */
    --primary:        #d7a139; /* okhsl(80, 80, 70) */
    --primaryDarker:  #c79431; /* l = 65 */
    --dangerLighter:  #f38882; /* l = 70 */
    --danger:         #ee736e; /* okhsl(24, 80, 65) */
    --dangerDarker:   #e65f5c; /* k = 60 */
    --primaryBg:      #d7a13920;
    --dangerBg:       #ee736e20;
    --primaryShadow:  0 0 0 2px #e6af4730;
    --dangerShadow:   0 0 0 2px #ee736e30;

    --elevatedBg:      #555555ff;
    --elevationShadow: none;

    --pressableShadowDefault:      0 1px #00000080;
    --pressableShadowPrimary:      0 1px #00000040, 0 1px var(--primary);
    --pressableShadowPrimaryHover: 0 1px #00000040, 0 1px var(--primaryDarker);
    --pressableShadowDanger:       0 1px #00000040, 0 1px var(--danger);
    --pressableShadowDangerHover:  0 1px #00000040, 0 1px var(--dangerDarker);

    --distantFg:     var(--bg);
    --light:         var(--fg);
    --dark:          var(--bg);
    --primaryHover:  var(--primaryDarker);
    --primaryActive: var(--primaryLighter);
    --dangerHover:   var(--dangerDarker);
    --dangerActive:  var(--dangerLighter);
  }
}

:root {
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
  --borderRadiusMicro: 4px; /* elements that should not be "too rounded" (eg. checkboxes) */
  --borderRadiusSmall: 4px;
  --borderRadius: 8px;

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
  --tabButtonPadding: 0 calc(var(--paddingH) * 0.75) calc(var(--paddingV) - 3px);
}

/* stylelint-disable-next-line selector-max-type */
html {
  padding: var(--spacingLarge);
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
