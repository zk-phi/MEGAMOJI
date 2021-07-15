<script lang="ts">
import { defineComponent } from "vue";
import { NConfigProvider, NTabs, NTabPane, NLayout, NLayoutHeader, NLayoutFooter, NSpace, NGrid, NGridItem, NButton } from "naive-ui";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import TextSource from "./cards/TextSource.vue";
import FileSource from "./cards/FileSource.vue";
import FukumojiSource from "./cards/FukumojiSource.vue";
import Target from "./cards/Target.vue";
import Result from "./cards/Result.vue";
import Tutorial from "./cards/Tutorial.vue";
import theme from "../constants/theme";
import ga from "../utils/analytics";

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
    NSpace,
    NGrid,
    NGridItem,
    NButton,
  },
  data() {
    return {
      theme,
      baseImage: null as (HTMLImageElement | null),
      resultImages: [[]] as HTMLImageElement[][],
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
  methods: {
    onSetShowTarget(value: boolean): void {
      this.ui.showTargetPanel = value;
      ga("send", "pageview", value ? "/target" : (`/${this.ui.mode}`));
    },
    onSelectMode(value: string): void {
      this.ui.mode = value;
      this.ui.showTargetPanel = false;
      ga("send", "pageview", `/${value}`);
    },
    onRenderTarget(imgs: HTMLImageElement[][]): void {
      this.resultImages = imgs;
      ga("send", "event", this.ui.mode, "render");
    },
    onRender(img: HTMLImageElement): void {
      this.baseImage = img;
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
            <NSpace v-else vertical>
              <Result :images="resultImages" />
              <NButton block type="primary" ghost @click="onSetShowTarget(!ui.showTargetPanel)">
                {{ ui.showTargetPanel ? 'もどる' : '効果をつける' }}
              </NButton>
            </NSpace>
          </NGridItem>
        </NGrid>
      </NLayout>

      <NLayoutFooter style="padding: 12px;">
        <Footer />
      </NLayoutFooter>
    </NLayout>
  </NConfigProvider>
</template>
