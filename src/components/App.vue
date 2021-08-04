<script lang="ts">
import { defineComponent } from "vue";
import { NConfigProvider, NTabs, NTabPane, NLayout, NLayoutHeader, NLayoutFooter, NGrid, NGridItem } from "naive-ui";
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
    NTabs,
    NTabPane,
    NLayout,
    NLayoutHeader,
    NLayoutFooter,
    Space,
    NGrid,
    NGridItem,
    Button,
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
        fukumojiTab: "base",
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
    <NLayout>
      <NLayoutHeader bordered style="padding: 12px;">
        <Header />
      </NLayoutHeader>

      <NLayout content-style="padding: 12px">
        <NTabs :value="ui.mode" @update:value="onSelectMode">
          <NTabPane name="text" tab="テキスト絵文字" />
          <NTabPane name="file" tab="画像絵文字" />
          <NTabPane name="fukumoji" tab="キメラ絵文字" />
        </NTabs>
        <NGrid cols="1 840:3" :x-gap="12" :y-gap="12">
          <NGridItem span="2">
            <TextSource
                :show="ui.mode == 'text' && !ui.showTargetPanel"
                @render="onRender" />
            <FileSource
                :show="ui.mode == 'file' && !ui.showTargetPanel"
                @render="onRender" />
            <FukumojiSource
                :show="ui.mode == 'fukumoji' && !ui.showTargetPanel"
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
      </NLayout>

      <NLayoutFooter style="padding: 12px;">
        <Footer />
      </NLayoutFooter>
    </NLayout>
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
  --fontSizeMedium: 14px;
  --fontSizeIcon: 26px;
  --fontSizePart: 48px;

  /* layout */
  --borderRadiusSmall: 2px;
  --borderRadius: 4px;
  --paddingMedium: 10px 12px;
  --paddingSmall: 8px 10px;
  --paddingMinimal: 4px;
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
