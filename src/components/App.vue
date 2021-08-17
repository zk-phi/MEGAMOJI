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
    <Space vertical xlarge full>
      <Header />

      <TabGroup>
        <TabButton :model-value="ui.mode" value="text" @update:model-value="onSelectMode">
          <Text /> テキスト絵文字
        </TabButton>
        <TabButton :model-value="ui.mode" value="file" @update:model-value="onSelectMode">
          <Image /> 画像絵文字
        </TabButton>
        <TabButton :model-value="ui.mode" value="parts" @update:model-value="onSelectMode">
          <Emoji /> キメラ絵文字
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
          <Space v-else vertical>
            <Result :images="resultImageUrls" />
            <Space>
              <Button @click="onSetShowTarget(!ui.showTargetPanel)">
                <span v-if="ui.showTargetPanel">
                  <Back /> もどる
                </span>
                <span v-else>
                  <Effect /> 効果をつける
                </span>
              </Button>
              <Button v-if="baseImage" type="primary" @click="onDownload">
                <Save /> 絵文字を保存
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
  --fg: #333639;
  --bg: #fff;
  --accentBg: #fafafa;
  --distantFg: #fff;
  --border: #aaa;
  --primary: #18a058;
  --primaryHover: #36ad6a;
  --primaryActive: #0c7a43;
  --primaryShadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
  --danger: #d03050;
  --dangerHover: #de576d;
  --dangerActive: #ab1f3f;
  --dangerShadow: 0 0 0 2px rgba(208, 48, 80, 0.2);

  /* typography */
  --fontSizeTitle: 28px;
  --fontSizeXLarge: 18px;
  --fontSizeLarge: 16px;
  --fontSizeMedium: 14px;
  --fontSizeIcon: 26px;
  --fontSizePart: 48px;
  --multilineTextLineHeight: 1.5;

  /* layout */
  --borderRadiusSmall: 2px;
  --borderRadius: 4px;
  --paddingXLarge: 20px 22px;
  --paddingLarge: 14px 16px;
  --paddingMedium: 10px 12px;
  --paddingSmall: 8px 10px;
  --paddingMinimal: 4px;
  --marginXLarge: 20px;
  --marginLarge: 16px;
  --marginMedium: 12px;
  --marginSmall: 8px;
  --marginXSmall: 4px;

  /* other */
  --textareaLineHeight: 1.4;
  --selectPadding: 10px calc(12px + 1em) 10px 12px;
  --numberPadding: 10px calc(12px + 2em) 10px 12px;
  --inputAddonTop: 10px; /* paddingMedium[0] */
  --sliderRailHeight: 0.375em;
  --sliderMarkHeight: 0.75em;
  --sliderKnobSize: 1.25em;
  --sliderValueMargin: 0.125em;
  --sliderValueWidth: 2.5em;
  --colorSliderRailHeight: 1.125em;
  --fieldsetBottomSpacing: 24px;
  --mediaIconSize: 34px;
  --popoverShadow: rgb(0 0 0 / 19%) 0 10px 20px, rgb(0 0 0 / 23%) 0 6px 6px;
}

/* stylelint-disable-next-line selector-max-type */
body {
  margin: 0;
}

/* stylelint-disable-next-line selector-max-type */
input,
select {
  font: inherit;
}
</style>

<style scoped>
.app {
  padding: var(--paddingLarge);
  font-family:
    v-sans,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol";

  /* taken from naive-ui/global */
  font-size: 14px;
  line-height: 1.6;
}
</style>
