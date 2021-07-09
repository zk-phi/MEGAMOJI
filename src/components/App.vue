<script lang="ts">
import Nav from "./navigation/Nav.vue";
import TextSource from "./cards/TextSource.vue";
import FileSource from "./cards/FileSource.vue";
import FukumojiSource from "./cards/FukumojiSource.vue";
import Target from "./cards/Target.vue";
import Result from "./cards/Result.vue";
import FullWidthButton from "./navigation/FullWidthButton.vue";

export default {
  components: {
    Nav, TextSource, FileSource, FukumojiSource, Target, Result, FullWidthButton,
  },
  data: (): Record<string, unknown> => ({
    MODES: [
      { value: "text", label: "テキストから作る" },
      { value: "file", label: "画像から作る" },
      { value: "fukumoji", label: "パーツを選んで作る" },
    ],
    baseImage: null,
    resultImages: [[]],
    previewMode: false,
    /* ui */
    ui: {
      mode: "text",
      showTargetPanel: false,
      fukumojiTab: "base",
      showTargetDetails: false,
    },
  }),
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
    onRenderTarget(imgs: HTMLImageElement[]): void {
      this.resultImages = imgs;
      ga("send", "event", this.ui.mode, "render");
    },
    onRender(img: HTMLImageElement): void {
      this.baseImage = img;
    },
  },
};
</script>

<template>
  <section class="section">
    <h1 class="title">
      MEGAMOJI - 簡単アニメ絵文字メーカー
    </h1>
    <h2 class="subtitle">
      Slack (など) の絵文字をサクッと作成できるジェネレータです
      <a target="_blank" href="https://github.com/zk-phi/MEGAMOJI/blob/master/NEWS.markdown">
        更新履歴
      </a>
    </h2>

    <Nav
        :model-value="ui.showTargetPanel ? '' : ui.mode"
        :pages="MODES"
        @update:modelValue="onSelectMode" />

    <div class="columns">
      <div class="column">
        <TextSource :show="ui.mode == 'text' && !ui.showTargetPanel" @render="onRender" />
        <FileSource :show="ui.mode == 'file' && !ui.showTargetPanel" @render="onRender" />
        <FukumojiSource :show="ui.mode == 'fukumoji' && !ui.showTargetPanel" @render="onRender" />
        <Target :show="ui.showTargetPanel" :base-image="baseImage" @render="onRenderTarget" />
      </div>
      <div class="column is-one-third">
        <div class="block">
          <Result :images="resultImages" />
        </div>
        <div class="block">
          <FullWidthButton v-if="baseImage" @click="onSetShowTarget(!ui.showTargetPanel)">
            {{ ui.showTargetPanel ? 'もどる' : '効果をつける' }}
          </FullWidthButton>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <p class="content">
      「パーツを選んで作る」の素材は Twemoji ((C) Twitter, CC-BY) を加工して作成しており、同じく CC-BY のもと自由に使用できます。このページではアクセス数などの集計に Google Analytics (cookie) を使用しています。オプトアウトアドオンで拒否することができます。<a href="https://github.com/zk-phi/MEGAMOJI/blob/gh-pages/LICENSE.org">権利表示</a>
    </p>
  </footer>
</template>
