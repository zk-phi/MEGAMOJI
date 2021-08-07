<script lang="ts">
import { defineComponent } from "vue";
import { NConfigProvider, NGrid, NGridItem } from "naive-ui";
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
import Space from "./global/Space.vue";
import Effect from "./icons/Effect.vue";
import Back from "./icons/Back.vue";
import Save from "./icons/Save.vue";
import theme from "../constants/theme";
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
    NConfigProvider,
    Space,
    NGrid,
    NGridItem,
    Button,
    TabButton,
    Effect,
    Back,
    Save,
  },
  data() {
    return {
      theme,
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
  <NConfigProvider :theme-overrides="theme">
    <Header />

    <div class="container">
      <Space vertical large full>
        <Space>
          <TabButton :model-value="ui.mode" value="text" @update:model-value="onSelectMode">
            テキスト絵文字
          </TabButton>
          <TabButton :model-value="ui.mode" value="file" @update:model-value="onSelectMode">
            画像絵文字
          </TabButton>
          <TabButton :model-value="ui.mode" value="parts" @update:model-value="onSelectMode">
            キメラ絵文字
          </TabButton>
        </Space>
        <NGrid cols="1 840:3" :x-gap="12" :y-gap="12">
          <NGridItem span="2">
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
          </NGridItem>
          <NGridItem span="1">
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
          </NGridItem>
        </NGrid>
      </Space>
    </div>

    <Footer />
  </NConfigProvider>
</template>

<style>
:root {
  /* colors */
  --fg: #333639;
  --bg: #fff;
  --distantFg: #fff;
  --border: #aaa;
  --primary: #18a058;
  --primaryHover: #36ad6a;
  --primaryActive: #0c7a43;
  --primaryShadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
  --danger: #d03050;
  --dangerHover: #de576d;
  --dangerActive: #ab1f3f;

  /* typography */
  --fontSizeLarge: 18px;
  --fontSizeMedium: 14px;
  --fontSizeIcon: 26px;
  --fontSizePart: 48px;

  /* layout */
  --borderRadiusSmall: 2px;
  --borderRadius: 4px;
  --paddingMedium: 10px 12px;
  --paddingSmall: 8px 10px;
  --paddingMinimal: 4px;
  --marginLarge: 16px;
  --marginMedium: 12px;
  --marginSmall: 8px;
  --marginXSmall: 4px;

  /* other */
  --textareaLineHeight: 1.4;
  --sliderRailHeight: 0.375em;
  --sliderMarkHeight: 0.75em;
  --sliderKnobSize: 1.25em;
  --sliderValueMargin: 0.125em;
  --sliderValueWidth: 2.5em;
  --fieldsetBottomSpacing: 24px;
}
</style>

<style scoped>
.container {
  padding: var(--marginMedium);
}
</style>
