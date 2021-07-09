<script lang="ts">
import Nav from "./navigation/Nav.vue";
import TextSource from "./cards/TextSource.vue";
import FileSource from "./cards/FileSource.vue";
import FukumojiSource from "./cards/FukumojiSource.vue";
import CheckboxBlock from "./formblocks/CheckboxBlock.vue";
import Target from "./cards/Target.vue";
import Result from "./cards/Result.vue";

export default {
  components: {
    Nav, TextSource, FileSource, FukumojiSource, CheckboxBlock, Target, Result,
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
    onRenderTarget(imgs): void {
      this.resultImages = imgs;
      ga("send", "event", this.ui.mode, "render");
    },
    onRender(img): void {
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
          <div class="buttons">
            <button v-if="baseImage" class="button is-light is-link is-rounded is-fullwidth"
                    @click="onSetShowTarget(!ui.showTargetPanel)">
              {{ ui.showTargetPanel ? 'もどる' : '効果をつける' }}
            </button>
          </div>
        </div>
      </div>

    </div>

  </section>
</template>
